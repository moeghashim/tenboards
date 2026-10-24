import { chromium } from "playwright";

import { cacheCaptureFonts } from "./screenshot-assets.ts";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3270",
  out = process.argv[3] ?? "screenshots/v08-003/interactions";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"] as const)
    for (const [size, viewport] of Object.entries({
      desktop: { width: 1440, height: 900 },
      mobile: { width: 390, height: 844 },
    })) {
      const c = await browser.newContext({
        viewport,
        colorScheme: theme,
        reducedMotion: "reduce",
        timezoneId: "America/Chicago",
      });
      await cacheCaptureFonts(c);
      await c.addCookies([{ name: "theme_mode", value: theme, url: base }]);
      const p = await c.newPage(),
        errors: string[] = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      const visit = async (path: string) => {
        await p.goto(base + path, { waitUntil: "networkidle" });
        await p.getByRole("heading", { name: "Documentation refresh", exact: true }).waitFor();
      };
      await visit("/dashboard/projects/sample-docs");
      assert.match(p.url(), /\/overview$/);
      assert.equal(await p.getByRole("navigation", { name: "Project views" }).getByRole("link").count(), 5);
      await p.getByText("Upcoming work", { exact: true }).waitFor();
      await p.screenshot({ path: `${out}/overview-${theme}-${size}.png`, fullPage: true });
      await visit("/dashboard/projects/sample-docs/timeline");
      const mode = p.getByLabel("Timeline mode");
      assert.equal(await mode.inputValue(), size === "mobile" ? "table" : "gantt");
      const ids = () =>
        p.locator("[data-schedule-id]").evaluateAll((ns) => ns.map((n) => n.getAttribute("data-schedule-id")));
      const original = await ids();
      assert.equal(original.length, 4);
      await mode.selectOption("table");
      await p.waitForURL(/mode=table/);
      await p
        .getByRole("table")
        .filter({ has: p.getByRole("columnheader", { name: "Task", exact: true }) })
        .waitFor();
      assert.deepEqual(await ids(), original);
      await p.screenshot({ path: `${out}/table-${theme}-${size}.png`, fullPage: true });
      await mode.selectOption("gantt");
      await p.waitForURL(/mode=gantt/);
      await p.getByRole("region", { name: "Gantt chart, scroll horizontally", exact: true }).waitFor();
      assert.deepEqual(await ids(), original);
      await p.screenshot({ path: `${out}/gantt-${theme}-${size}.png`, fullPage: true });
      const next = p.getByRole("button", { name: "Next schedule range" });
      await next.focus();
      await p.keyboard.press("Enter");
      await p.waitForURL(/start=2026-07-18/);
      await p.waitForFunction(
        () => document.querySelector<HTMLInputElement>("#schedule-start")?.value === "2026-07-18",
      );
      await p.getByRole("button", { name: "Previous schedule range" }).focus();
      await p.keyboard.press("Enter");
      await p.waitForURL(/start=2026-06-20/);
      await p.getByLabel("Schedule scale").selectOption("months");
      await p.waitForURL(/scale=months/);
      await p.getByLabel("Visible periods").selectOption("12");
      await p.waitForURL(/periods=12/);
      await p.getByRole("button", { name: "Today", exact: true }).focus();
      await p.keyboard.press("Enter");
      await p.waitForFunction(() => !new URL(location.href).searchParams.get("start")?.startsWith("2026-06"));
      await mode.selectOption("calendar");
      await p.waitForURL(/mode=calendar/);
      await p.getByRole("region", { name: "Project calendar", exact: true }).waitFor();
      assert.equal(await p.getByRole("link", { name: "Timeline", exact: true }).getAttribute("aria-current"), "page");
      assert.equal(await p.getByRole("button", { name: "Add event", exact: true }).count(), 0);
      for (const label of ["Week", "Day", "Month"]) {
        await p.getByRole("combobox", { name: "Calendar view", exact: true }).click();
        await p.getByRole("option", { name: label, exact: true }).click();
        await p.waitForTimeout(100);
      }
      await p.getByRole("button", { name: "Previous period", exact: true }).focus();
      await p.keyboard.press("Enter");
      await p.getByRole("button", { name: "Today", exact: true }).focus();
      await p.keyboard.press("Enter");
      await p.screenshot({ path: `${out}/calendar-${theme}-${size}.png`, fullPage: true });
      await p.getByRole("link", { name: "Files", exact: true }).click();
      await p.getByLabel("File display").waitFor();
      assert.equal(await p.getByRole("button", { name: /Upload|Download|Share|Delete|Unstar|Star / }).count(), 0);
      await p.getByLabel("File display").selectOption("list");
      await p.waitForURL(/view=list/);
      assert.equal(await p.getByRole("link", { name: "Files", exact: true }).getAttribute("aria-current"), "page");
      await p.getByLabel("Search files").fill("no-such-file");
      await p.getByText(/No matching files in Documentation refresh/).waitFor();
      await p.getByLabel("Search files").fill("");
      await p.screenshot({ path: `${out}/files-${theme}-${size}.png`, fullPage: true });
      await p.goto(`${base}/dashboard/projects/sample-operations/timeline?mode=gantt`, { waitUntil: "networkidle" });
      const unscheduled = p.getByRole("region", { name: "Unscheduled tasks, scroll vertically", exact: true });
      await unscheduled.focus();
      await p.keyboard.press("End");
      await p.waitForFunction(() => {
        const el = document.querySelector('[aria-label="Unscheduled tasks, scroll vertically"]');
        return el && el.scrollTop > 0 && el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      });
      assert.equal(await unscheduled.locator("li").count(), 96);
      const chart = p.getByRole("region", { name: "Gantt chart, scroll horizontally", exact: true });
      const aligned = await chart.evaluate((el) => {
        const grid = el.firstElementChild;
        const header = grid?.firstElementChild?.children[1]?.getBoundingClientRect();
        const row = grid?.querySelector("[data-schedule-id]")?.children[1]?.getBoundingClientRect();
        return header && row && Math.abs(header.x - row.x) < 1 && Math.abs(header.width - row.width) < 1;
      });
      assert.equal(aligned, true);
      await p.goto(`${base}/dashboard/projects/sample-empty/timeline?mode=calendar`, { waitUntil: "networkidle" });
      await p.getByRole("heading", { name: "Research queue", exact: true }).waitFor();
      await p.getByText(/No matching tasks/).waitFor();
      await p.screenshot({ path: `${out}/empty-calendar-${theme}-${size}.png`, fullPage: true });
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
      assert.deepEqual(errors, []);
      await c.close();
      console.log(
        `PASS ${theme}/${size}: validated index,5views,overview,schedule identity,mobile default,keyboard ranges,12months,live Today,Calendar modes,readonly files/filter,empty calendar and console`,
      );
    }
  for (const zone of ["UTC", "America/Chicago", "Pacific/Kiritimati"]) {
    const c = await browser.newContext({ timezoneId: zone });
    await cacheCaptureFonts(c);
    await c.route("**/*.js", async (route) => {
      await new Promise((r) => setTimeout(r, 150));
      await route.continue();
    });
    const p = await c.newPage(),
      errors: string[] = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`${base}/dashboard/projects/sample-operations/timeline?mode=calendar`, { waitUntil: "networkidle" });
    await p.getByText(/Local time/).waitFor();
    await p.reload({ waitUntil: "networkidle" });
    await p.getByText(/Local time/).waitFor();
    assert.deepEqual(errors, []);
    await c.close();
    console.log(`PASS delayed direct/refresh Calendar hydration ${zone}`);
  }
} finally {
  await browser.close();
}
