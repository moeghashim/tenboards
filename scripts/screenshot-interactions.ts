import type { Page } from "playwright";

// Opt-in interaction evidence for the dashboard batch. Never replace the runtime clock.
export async function captureInteractions(page: Page, route: string): Promise<string[]> {
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
