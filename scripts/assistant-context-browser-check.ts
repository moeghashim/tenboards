import { chromium } from "playwright";

import { encodeEvent } from "../src/lib/assistant/transport.ts";
import { cacheCaptureFonts } from "./screenshot-assets.ts";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.env.ASSISTANT_TEST_URL ?? "http://127.0.0.1:3170";
const output = "screenshots/v07-003/context";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await cacheCaptureFonts(context);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let reply = 'root = Stack([Text("Synthetic reply")])';
  let gate: Promise<void> | undefined;
  let release = () => {
    /* Test observes the final state. */
  };
  const bodies: { messages: { role: string; content: string }[] }[] = [];
  await page.route("**/api/assistant", async (route) => {
    bodies.push(route.request().postDataJSON());
    await gate;
    await route
      .fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: Buffer.concat([
          encodeEvent({ v: 1, type: "text-delta", text: reply }),
          encodeEvent({ v: 1, type: "finish" }),
        ]),
      })
      .catch(() => {
        /* Test observes the final state. */
      });
  });
  await page.goto(`${base}/dashboard/assistant`);
  await page.waitForLoadState("networkidle");
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  const send = async (text: string) => {
    await input.fill(text);
    await input.press("Enter");
    await page.locator("article").last().getByText(text, { exact: true }).waitFor();
    await page
      .locator("article")
      .last()
      .getByText(/ · completed$/)
      .waitFor();
  };
  for (let i = 0; i < 11; i++) await send(`Context question ${i}`);
  assert.equal(bodies.at(-1)?.messages.length, 19);
  assert.equal(bodies.at(-1)?.messages[0].content, "Context question 1");
  assert.equal(await page.locator("article").count(), 11);
  await page.getByText(/Older complete exchanges were left out/).waitFor();
  await page.screenshot({ path: `${output}/pruned-context.png` });
  await input.fill("é".repeat(4097));
  const count = bodies.length;
  await input.press("Enter");
  await page.getByText(/Keep your message under 8 KiB/).waitFor();
  assert.equal(bodies.length, count);
  await page.getByRole("button", { name: "New conversation", exact: true }).click();
  reply = `root = Stack([List(${JSON.stringify(Array.from({ length: 50 }, (_, i) => `${i} ${"synthetic ".repeat(72)}`))})])`;
  await send("Large response fixture");
  const largeCount = bodies.length;
  await input.fill("Continue");
  await input.press("Enter");
  await page.getByText(/latest reply is too large to reuse/).waitFor();
  assert.equal(bodies.length, largeCount);
  await page.screenshot({ path: `${output}/oversized-context.png` });
  await page.getByRole("button", { name: "New conversation", exact: true }).click();
  reply = `root = Stack([List(${JSON.stringify(Array.from({ length: 40 }, (_, i) => `Item ${i}: ${"synthetic content ".repeat(12)}`))})])`;
  await send("Scroll fixture");
  gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await input.fill("Delayed follow-up");
  await input.press("Enter");
  await page.getByRole("button", { name: "Stop", exact: true }).waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  release();
  gate = undefined;
  await page
    .locator("article")
    .last()
    .getByText(/ · completed$/)
    .waitFor();
  assert.ok(await page.evaluate(() => scrollY < 20), "Completion moved a reader away from older output");
  await page.screenshot({ path: `${output}/reader-scroll-preserved.png` });
  const storage = await page.evaluate(() => ({
    local: Object.values(localStorage).join(""),
    session: Object.values(sessionStorage).join(""),
    cookies: document.cookie,
    url: location.href,
  }));
  assert.ok(!JSON.stringify(storage).includes("Scroll fixture"));
  assert.ok(!JSON.stringify(storage).includes("Delayed follow-up"));
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await page.waitForURL("**/dashboard/default");
  await page.getByText("Total Revenue", { exact: true }).first().waitFor();
  await page.getByRole("link", { name: "AI Assistant", exact: true }).click();
  await page.waitForURL("**/dashboard/assistant");
  await page.getByRole("heading", { name: "AI Assistant", exact: true }).waitFor();
  assert.equal(await page.locator("article").count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS visible whole-pair context pruning, local UTF8 cap, oversized latest stays visible and blocks replay",
  );
  console.log(
    "PASS reader scroll preserved, transient history absent from storage/cookies/URL, navigation clears, no page errors",
  );
  await context.close();
} finally {
  await browser.close();
}
