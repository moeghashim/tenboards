import type { Page } from "playwright";

// This module is imported only by the QA CLI. No fault switch is bundled into the app.
export async function captureSystem(
  page: Page,
  route: string,
  capture: (name: string) => Promise<void>,
): Promise<string[]> {
  if (route === "qa:root-error") {
    await page.evaluate(() => {
      const win = window as unknown as {
        __TSR_ROUTER__: { routesById: Record<string, { options: { component: unknown } }>; invalidate: () => void };
        __QA_ROOT__?: { route: { options: { component: unknown } }; component: unknown };
      };
      const router = win.__TSR_ROUTER__;
      const target = router.routesById["/(main)/dashboard/default"];
      win.__QA_ROOT__ = { route: target, component: target.options.component };
      target.options.component = () => {
        throw new Error("QA_ONLY_ROOT_ERROR");
      };
      router.invalidate();
    });
    await page.getByRole("heading", { name: "Something went wrong.", exact: true }).waitFor();
    if (!page.url().includes("localhost") && (await page.locator("main").textContent())?.includes("QA_ONLY_ROOT_ERROR"))
      throw new Error("Production leaked error detail");
    await capture("boundary");
    await page.evaluate(() => {
      const win = window as unknown as {
        __QA_ROOT__?: { route: { options: { component: unknown } }; component: unknown };
      };
      const saved = win.__QA_ROOT__;
      if (!saved) throw new Error("QA fault state missing");
      saved.route.options.component = saved.component;
      delete win.__QA_ROOT__;
    });
    await page.getByRole("button", { name: "Try again", exact: true }).press("Enter");
    await page.getByText("Total Revenue", { exact: true }).first().waitFor();
    await capture("recovered");
    return [
      "Actual root boundary caught an ephemeral QA component fault; keyboard Try again restored dashboard",
      "Expected QA exception isolated; production error text is generic; no app error trigger",
    ];
  }
  const heading = page.getByRole("heading", { level: 1 }).first();
  await heading.waitFor();
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error("System page overflow");
  await capture("state");
  const recovery = page.getByRole("link", { name: /Go back home|Go to Homepage|Go to dashboard/ }).first();
  if (await recovery.count()) {
    await recovery.press("Enter");
    await page.waitForURL("**/dashboard/default");
    await page.getByText("Total Revenue", { exact: true }).first().waitFor();
  }
  return ["Distinct system heading and no page overflow", "Existing recovery link navigates by keyboard when provided"];
}
