import { chromium } from "playwright";

import { cacheCaptureFonts } from "./screenshot-assets.ts";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3270";
const output = process.argv[3] ?? "screenshots/v08-002/interactions";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"] as const)
    for (const [size, viewport] of Object.entries({
      desktop: { width: 1440, height: 900 },
      mobile: { width: 390, height: 844 },
    })) {
      const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: "reduce" });
      await cacheCaptureFonts(context);
      await context.addCookies([{ name: "theme_mode", value: theme, url: base }]);
      const page = await context.newPage(),
        errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const visit = async (path: string) => {
        await page.goto(base + path, { waitUntil: "networkidle" });
        await page.getByRole("heading", { name: "Documentation refresh", exact: true }).waitFor();
      };
      await visit("/dashboard/projects/sample-docs/board");
      const board = await page
        .locator("[data-task-id]")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-task-id")).sort());
      assert.equal(board.length, 4);
      await page.getByRole("link", { name: "List", exact: true }).click();
      await page.getByRole("table", { name: "Project tasks" }).waitFor();
      const list = await page
        .locator("[data-task-id]")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-task-id")).sort());
      assert.deepEqual(list, board);
      assert.equal(await page.locator('[draggable="true"]').count(), 0);
      assert.equal(await page.getByRole("checkbox").count(), 0);
      assert.equal(await page.getByRole("button", { name: /Add task|Edit|Delete|Save/ }).count(), 0);
      await page.getByLabel("Status", { exact: true }).selectOption("done");
      await page.waitForURL(/status=done/);
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length === 1);
      assert.deepEqual(
        await page.locator("[data-task-id]").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-task-id"))),
        ["sample:route-map"],
      );
      await page.getByRole("button", { name: "Reset filters" }).click();
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length === 4);
      await page.getByLabel("Search tasks", { exact: true }).fill("unfindable");
      await page.getByRole("button", { name: "Apply search" }).click();
      await page.getByText("No matching tasks", { exact: true }).waitFor();
      await page.getByRole("button", { name: "Reset filters" }).click();
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length === 4);
      await page.getByLabel("Label", { exact: true }).fill("verification");
      await page.getByRole("button", { name: "Apply search" }).click();
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length === 1);
      const detail = page.getByRole("button", { name: "Details for Verify the clean install guide" });
      await detail.focus();
      await page.keyboard.press("Enter");
      await page.getByRole("dialog").waitFor();
      await page.screenshot({ path: `${output}/details-${theme}-${size}.png` });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert.equal(await detail.evaluate((node) => node === document.activeElement), true);
      await page.getByLabel("Project", { exact: true }).selectOption("sample-empty");
      await page.getByRole("heading", { name: "Research queue", exact: true }).waitFor();
      assert.equal(await page.locator("[data-task-id]").count(), 0);
      assert.ok(!new URL(page.url()).searchParams.has("label"));
      await page.getByLabel("Project", { exact: true }).selectOption("sample-operations");
      await page.getByRole("heading", { name: "Operations rollout", exact: true }).waitFor();
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length === 100);
      assert.equal(
        await page.evaluate(
          () =>
            document.documentElement.scrollHeight <=
            Math.max(
              window.innerHeight,
              Math.ceil(document.querySelector("main")!.getBoundingClientRect().bottom + window.scrollY),
            ) +
              1,
        ),
        true,
        "Board scrollers contain absolute accessible labels",
      );
      const first = await page
        .locator("[data-task-id]")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-task-id")));
      await page.getByRole("button", { name: "Next", exact: true }).focus();
      await page.keyboard.press("Enter");
      await page.waitForURL(/offset=100/);
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length === 17);
      const second = await page
        .locator("[data-task-id]")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-task-id")));
      assert.equal(new Set([...first, ...second]).size, 117);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
      await page.getByLabel("Status", { exact: true }).selectOption("canceled");
      await page.waitForURL(/status=canceled/);
      await page.waitForFunction(() => document.querySelectorAll("[data-task-id]").length > 0);
      assert.equal(new URL(page.url()).searchParams.get("offset"), "0");
      await page.screenshot({ path: `${output}/canceled-${theme}-${size}.png`, fullPage: true });
      assert.deepEqual(errors, []);
      await context.close();
      console.log(
        `PASS ${theme}/${size}: identity, board/list equality, filters, empty/project switching, details keyboard/focus, 117 unique tasks over bounded pages, canceled and overflow`,
      );
    }
  const context = await browser.newContext();
  const page = await context.newPage();
  const response = await page.goto(`${base}/dashboard/projects/missing/board`);
  assert.equal(response?.status(), 404);
  await page.getByRole("heading", { name: "Project not found", exact: true }).waitFor();
  await context.close();
  console.log("PASS authorized missing project is 404, never default substitution");
} finally {
  await browser.close();
}
