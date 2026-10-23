import type { Page } from "playwright";

export async function captureCore(page: Page, route: string, capture: (name: string) => Promise<void>) {
  if (route === "/dashboard/default") {
    const search = page.getByPlaceholder("Search customers...");
    await search.fill("no-matching-customer");
    await page.getByText("No results.", { exact: true }).waitFor();
    await capture("customers-empty");
    await search.fill("");
    await page.getByRole("combobox").filter({ hasText: "All segments" }).click();
    await page.getByRole("option", { name: "Paid", exact: true }).click();
    return ["Customer search empty/reset; segment selector remains local"];
  }
  if (route === "/dashboard/default-v1") {
    for (const [key, label] of [
      ["30d", "Last 30 days"],
      ["7d", "Last 7 days"],
      ["90d", "Last 3 months"],
    ]) {
      const select = page.getByRole("combobox", { name: "Visitor time range" });
      if (await select.isVisible()) {
        await select.click();
        await page.getByRole("option", { name: label, exact: true }).click();
      } else await page.getByRole("button", { name: label, exact: true }).click();
      await capture(`visitors-${key}`);
    }
    await page.getByRole("button", { name: "Cover page", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await capture("proposal-detail");
    await page.keyboard.press("Escape");
    return ["Loaded visitors: 30d, 7d and 90d; proposal detail sheet"];
  }
  if (route === "/dashboard/crm") {
    const search = page.getByRole("textbox", { name: "Search deals" });
    await search.fill("no-matching-deal");
    await page.getByText("No results.", { exact: true }).waitFor();
    await capture("opportunities-empty");
    await search.fill("");
    await page.getByRole("button", { name: "Stage", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "Proposal Sent", exact: true }).click();
    await capture("opportunities-proposal");
    return ["Opportunity search empty/reset; Proposal stage filter"];
  }
  if (route === "/dashboard/crm-v1") {
    await page.getByRole("checkbox", { name: "Select all", exact: true }).click();
    await capture("leads-selected");
    await page.getByRole("button", { name: "View", exact: true }).click();
    await page.getByRole("menuitemcheckbox", { name: "Company", exact: true }).click();
    await page.keyboard.press("Escape");
    return ["Lead selection and column visibility"];
  }
  if (route === "/dashboard/finance-v1") {
    await page.getByRole("combobox", { name: "Cash flow period" }).press("Enter");
    await page.getByRole("option", { name: "Last 6 Months", exact: true }).click();
    return ["Cash flow period selector preserves placeholder behavior"];
  }
  throw new Error(`Unknown core route ${route}`);
}

export async function captureAnalyticsRange(page: Page, capture: (name: string) => Promise<void>) {
  const picker = page.locator("button#date");
  const initial = await picker.textContent();
  const initialPath = await page.locator("path.recharts-area-curve").first().getAttribute("d");
  await picker.click();
  await page.locator('[data-day="10/1/2026"]').first().click();
  await page.locator('[data-day="10/7/2026"]').first().click();
  await page.keyboard.press("Escape");
  if ((await picker.textContent()) === initial) throw new Error("Analytics range did not change");
  const changedPath = await page.locator("path.recharts-area-curve").first().getAttribute("d");
  if (changedPath === initialPath) throw new Error("Analytics loaded revenue range did not change chart");
  await capture("revenue-changed-range");
}
