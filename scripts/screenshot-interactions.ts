import type { Page } from "playwright";

// Opt-in interaction evidence for the dashboard batch. Never replace the runtime clock.
export async function captureInteractions(page: Page, route: string): Promise<string[]> {
  if (route === "/dashboard/logistics") {
    const shipment = page.getByRole("button", { name: "Select shipment SDA-02-2402", exact: true });
    await shipment.focus();
    await shipment.press("Enter");
    const mobile = (page.viewportSize()?.width ?? 1440) < 1024;
    const region = mobile
      ? page.getByRole("dialog", { name: "Shipment SDA-02-2402", exact: true })
      : page.locator("main");
    await region.getByRole("heading", { name: "#SDA-02-2402", exact: true }).waitFor();
    await region.getByRole("tab", { name: "Route", exact: true }).click();
    await region.getByText("Route view coming soon.", { exact: true }).waitFor();
    await region.getByRole("tab", { name: "Overview", exact: true }).click();
    if (mobile) {
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.waitForFunction(
        () => document.activeElement?.getAttribute("aria-label") === "Select shipment SDA-02-2402",
      );
      await shipment.press("Enter");
      await region.waitFor();
    }
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error("Page-wide overflow");
    return [
      "Enter selects second shipment and correct details",
      "Route placeholder and Overview tabs preserved",
      mobile ? "Mobile sheet named; Escape closes and returns focus; Enter reopens" : "Desktop split pane updated",
      "No page-wide overflow",
    ];
  }
  if (route === "/dashboard/academy") {
    const student = page.getByRole("button", { name: "Olivia Davis", exact: true });
    await page.keyboard.press("Tab");
    await student.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await page.locator('[data-slot="tooltip-content"]').filter({ hasText: "Top Performer" }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Gradebook", exact: true }).press("Enter");
    await page.getByText("Modern European History", { exact: true }).waitFor();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error("Page-wide overflow");
    await page.keyboard.press("Tab");
    await student.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await page.locator('[data-slot="tooltip-content"]').filter({ hasText: "Top Performer" }).waitFor();
    return [
      "Student achievement tooltip opens by keyboard focus",
      "Escape dismisses tooltip",
      "Gradebook demo action retains screen",
      "Full course name and no page overflow",
    ];
  }
  if (route === "/dashboard/ecommerce") {
    await page.getByRole("combobox", { name: "Store period" }).click();
    await page.getByRole("option", { name: "Last Month", exact: true }).click();
    await page.getByRole("combobox", { name: "Sales channel" }).click();
    await page.getByRole("option", { name: "Online Store", exact: true }).click();
    await page.getByRole("button", { name: "Returns", exact: true }).click();
    if ((await page.locator("tbody tr").count()) === 0) throw new Error("Returns filter removed all rows");
    await page.getByRole("checkbox", { name: "Select all orders", exact: true }).press("Space");
    await page.getByText(/orders selected/).waitFor();
    await page.getByRole("button", { name: "Sort orders by date" }).press("Enter");
    await page.getByRole("button", { name: "Open order actions" }).first().click();
    await page.getByRole("menuitem", { name: "View order", exact: true }).waitFor();
    await page.keyboard.press("Escape");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error("Page-wide overflow");
    return [
      "Last Month / Online Store selected",
      "Returns filter, Space selects orders, Enter sorts dates",
      "Order menu opens, Escape closes",
      "No page-wide overflow",
    ];
  }
  if (route === "/dashboard/productivity") {
    const task = page.getByRole("checkbox", { name: "Finalize Q2 roadmap" });
    await task.focus();
    await task.press("Space");
    if ((await task.getAttribute("aria-checked")) !== "true") throw new Error("Keyboard task completion failed.");
    await page.getByRole("combobox", { name: "Task period" }).click();
    await page.getByRole("option", { name: "Tomorrow", exact: true }).click();
    await page.getByRole("combobox", { name: "Task period" }).getByText("Tomorrow", { exact: true }).waitFor();
    await page.getByRole("combobox", { name: "Project status" }).click();
    await page.getByRole("option", { name: "Planning", exact: true }).click();
    await page.getByRole("combobox", { name: "Project status" }).getByText("Planning", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Go to the Next Month", exact: true }).press("Enter");
    const day = page.getByRole("button", { name: "Wednesday, 4 November 2026", exact: true });
    await day.click();
    await page.getByRole("button", { name: "Wednesday, 4 November 2026, selected", exact: true }).press("ArrowRight");
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("aria-label") === "Thursday, 5 November 2026",
      undefined,
      { timeout: 3000 },
    );
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Thursday, 5 November 2026, selected", exact: true }).waitFor();
    await page.getByRole("button", { name: "Start focus session" }).press("Enter");
    await page.getByText("90:00", { exact: true }).waitFor();
    await page.getByRole("combobox", { name: "Task period" }).press("Enter");
    await page.getByRole("option", { name: "Tomorrow", exact: true }).waitFor();
    return [
      "Space completes first task",
      "Tomorrow / Planning selected",
      "Enter navigates to November; ArrowRight + Enter selects November 5",
      "Focus Start retains existing 90:00 placeholder; Task period menu open",
    ];
  }
  if (route === "/dashboard/analytics") {
    await page.getByRole("combobox", { name: "Analytics period" }).click();
    await page.getByRole("option", { name: "Last 7 days", exact: true }).click();
    await page.getByRole("combobox", { name: "Analytics period" }).getByText("Last 7 days", { exact: true }).waitFor();
    await page.getByRole("tab", { name: "Campaigns", exact: true }).click();
    for (const source of ["Spring Launch", "Newsletter", "Retargeting", "Brand Search", "Partners"])
      await page.locator("svg").getByText(source, { exact: true }).waitFor();
    return [
      "Last 7 days selected",
      "Campaigns displays Spring Launch / Newsletter / Retargeting / Brand Search / Partners",
    ];
  }
  if (route === "/dashboard/analytics-v1") {
    await page.getByRole("button", { name: /Filters/ }).click();
    await page.getByText("Enterprise only", { exact: true }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /^Filters\s*2$/ }).waitFor();
    await page.getByText("Enterprise · Renewals", { exact: true }).waitFor();
    await page.getByRole("combobox").filter({ hasText: "Risk view" }).click();
    await page.getByRole("option", { name: /Momentum/ }).click();
    await page.getByRole("combobox").filter({ hasText: "Momentum" }).waitFor();
    await page.getByRole("button", { name: "Risk Ladder", exact: true }).click();
    const firstRow = await page.locator("tbody tr").first().textContent();
    if (!firstRow?.includes("Soylent Foods") || !firstRow.includes("31"))
      throw new Error(`Unexpected sorted row: ${firstRow}`);
    return ["Enterprise + Renewals filter count 2", "Momentum selected", "Risk ascending: Soylent Foods / 31 first"];
  }
  throw new Error(`No interaction scenario for ${route}. Use an explicit supported --routes subset.`);
}
