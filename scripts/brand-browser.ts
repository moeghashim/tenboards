import { chromium } from "playwright";

import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] ?? "unset";
const branded = label !== "unset";
const browser = await chromium.launch();
const errors: string[] = [];
const output = `verify/brand/${label}`;
await mkdir(output, { recursive: true });
try {
  for (const mode of ["light", "dark"])
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        colorScheme: mode as "light" | "dark",
        reducedMotion: "reduce",
      });
      await context.addCookies([
        { name: "theme_preset", value: "graphite", url: "http://127.0.0.1:3000" },
        { name: "theme_mode", value: mode, url: "http://127.0.0.1:3000" },
      ]);
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      for (const route of ["default", "users", "kit"]) {
        await page.goto(`http://127.0.0.1:3000/dashboard/${route}`);
        await page.waitForLoadState("networkidle");
        if (branded) {
          assert.equal(await page.locator("html").getAttribute("data-theme-preset"), null);
          assert.equal((await context.cookies()).find((c) => c.name === "theme_preset")?.value, "default");
        }
        await page.screenshot({ animations: "disabled", path: `${output}/${route}-${mode}-${width}.png` });
        if (route === "users") {
          await page.getByRole("button", { name: "Layout settings", exact: true }).last().click();
          await page.getByRole("heading", { name: "Make it your workspace" }).waitFor();
          await page.locator('[data-slot="sheet-content"]').evaluate(async (element) => {
            await Promise.all(element.getAnimations().map((animation) => animation.finished));
          });
          assert.equal(await page.getByLabel("Color preset", { exact: true }).count(), branded ? 0 : 1);
          if (branded) {
            const edge = await page
              .locator("label:has(input:checked)")
              .first()
              .evaluate((element) => {
                const probe = document.createElement("span");
                probe.style.color = "var(--action-accent)";
                element.append(probe);
                const result = { border: getComputedStyle(element).borderColor, accent: getComputedStyle(probe).color };
                probe.remove();
                return result;
              });
            assert.equal(edge.border, edge.accent, "Selected edge uses accessible accent, not button fill");
          }
          await page.screenshot({ animations: "disabled", path: `${output}/settings-${mode}-${width}.png` });
          await page.keyboard.press("Escape");
          await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Layout settings");
        }
      }
      await context.close();
    }
  assert.deepEqual(errors, []);
  await writeFile(
    `${output}/result.json`,
    JSON.stringify(
      { label, picker: branded ? "hidden" : "visible", cookie: branded ? "sanitized" : "preserved", errors },
      null,
      2,
    ),
  );
  console.log(`PASS ${label}: light/dark desktop/mobile, picker, stale cookie, no console/hydration errors`);
} finally {
  await browser.close();
}
