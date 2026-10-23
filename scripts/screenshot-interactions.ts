import type { Page } from "playwright";

// Opt-in interaction evidence for the dashboard batch. Never replace the runtime clock.
export async function captureInteractions(page: Page, route: string): Promise<string[]> {
  if (route === "/mail" || route === "/dashboard/mail") {
    const embedded = route === "/dashboard/mail";
    if (embedded)
      await page
        .frameLocator('iframe[title="Mail preview"]')
        .getByRole("heading", { name: "Inbox", exact: true })
        .waitFor();
    const surface = embedded ? page.frames().find((frame) => new URL(frame.url()).pathname === "/mail") : page;
    if (!surface) throw new Error("Mail iframe missing");
    const parentTheme = await page.evaluate(() => ({
      dark: document.documentElement.classList.contains("dark"),
      preset: document.documentElement.dataset.themePreset,
    }));
    const inner = await surface.evaluate(() => ({
      dark: document.documentElement.classList.contains("dark"),
      preset: document.documentElement.dataset.themePreset,
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    if (inner.dark !== parentTheme.dark || inner.preset !== parentTheme.preset || inner.overflow)
      throw new Error(`Mail frame geometry/theme: ${JSON.stringify(inner)}`);
    const row = surface.locator("[data-mail-id]").first();
    await row.press("Enter");
    await surface
      .getByRole("textbox", { name: "Reply message", exact: true })
      .fill("Thanks — reviewing the attached documents.");
    await surface.getByRole("button", { name: "Attachments (3)", exact: true }).press("Enter");
    await surface.getByRole("button", { name: "Attachments (3)", exact: true }).press("Enter");
    await surface.getByRole("button", { name: "More actions", exact: true }).press("Enter");
    await surface.getByRole("menuitem", { name: "Reply all", exact: true }).waitFor();
    await page.keyboard.press("Escape");
    if (inner.width < 768) {
      await page.keyboard.press("Escape");
      await surface.getByRole("dialog", { name: "Mail message", exact: true }).waitFor({ state: "hidden" });
      if (!(await row.evaluate((node) => node === document.activeElement)))
        throw new Error("Mail drawer did not return focus");
      await row.press("Enter");
    } else {
      const handle = surface.locator('[data-slot="resizable-handle"]');
      const oldWidth = await surface
        .locator("#mail-message-list-panel")
        .evaluate((node) => node.getBoundingClientRect().width);
      await handle.press("ArrowRight");
      await surface.waitForFunction(
        (previous) =>
          Math.abs(
            (document.getElementById("mail-message-list-panel")?.getBoundingClientRect().width ?? previous) - previous,
          ) >= 1,
        oldWidth,
      );
      const newWidth = await surface
        .locator("#mail-message-list-panel")
        .evaluate((node) => node.getBoundingClientRect().width);
      if (Math.abs(newWidth - oldWidth) < 1) throw new Error("Keyboard resize did not change panel width");
      const cookie = (await page.context().cookies()).find((item) => item.name === "mail_panel_layout");
      if (!cookie || (!cookie.value.includes("%") && !cookie.value.includes("[")))
        throw new Error("Mail layout cookie missing");
      await surface.getByRole("button", { name: "Close message", exact: true }).press("Enter");
      await surface.getByText("Select an email to read its message", { exact: true }).waitFor();
      await row.press("Enter");
    }
    await surface.getByRole("textbox", { name: "Reply message", exact: true }).focus();
    return [
      "Standalone/iframe theme and preset match; no page overflow",
      "Keyboard selection, attachments and reply menu/composer",
      inner.width < 768
        ? "Mobile Escape restores row focus; drawer reopens"
        : "Resizable panels persist layout cookie; empty selection and reselection",
      "Existing search/filter/send actions remain demo placeholders",
    ];
  }
  if (route === "/dashboard/file-manager" || route === "/dashboard/products") {
    const title = page.getByRole("heading", { level: 1 });
    const original = await title.textContent();
    await title.evaluate((node) => {
      node.textContent =
        "Workspace documents and product catalog for international operations with a verylongunbrokentitlethatmustwrapwithoutclipping";
    });
    const fits = await title.evaluate((node) => {
      const header = node.parentElement?.parentElement;
      return header && header.scrollWidth <= header.clientWidth && node.scrollWidth <= node.clientWidth;
    });
    if (!fits) throw new Error("Long page heading clips");
    await title.evaluate((node, value) => {
      node.textContent = value;
    }, original);
    if (route === "/dashboard/file-manager") {
      await page.getByRole("button", { name: "List View", exact: true }).press("Enter");
      await page.waitForURL("**view=list");
      await page.reload();
      await page.getByRole("button", { name: "List View", exact: true }).waitFor();
      if (!page.url().includes("view=list")) throw new Error("File view did not survive refresh");
      await page.getByRole("button", { name: "Grid View", exact: true }).press("Enter");
      await page.waitForURL("**view=grid");
      return ["Long h1 wraps without clipping", "Keyboard file view links preserve query state through refresh"];
    }
    await page.getByRole("button", { name: "Add product", exact: true }).press("Enter");
    await page.getByRole("dialog", { name: "Add product", exact: true }).waitFor();
    await page.getByRole("textbox", { name: "Product name", exact: true }).fill("Demo catalog item");
    await page.keyboard.press("Escape");
    await page.getByRole("dialog", { name: "Add product", exact: true }).waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Add product", exact: true }).press("Enter");
    if (await page.getByRole("textbox", { name: "Product name", exact: true }).inputValue())
      throw new Error("Drawer did not retain reset-on-close behavior");
    return ["Long h1 wraps without clipping", "Keyboard drawer opens, Escape closes, form resets on reopen"];
  }
  if (route === "/dashboard/finance") {
    const period = page.getByRole("combobox", { name: "Spending period", exact: true });
    await period.press("Enter");
    await page.getByRole("option", { name: "Monthly", exact: true }).click();
    await page.getByRole("tab", { name: "Accounts", exact: true }).click();
    await page.getByText("Accounts view coming soon.", { exact: true }).waitFor();
    await page.getByRole("tab", { name: "Dashboard", exact: true }).click();
    await page.getByRole("textbox", { name: "Transfer amount in USD", exact: true }).fill("125.00");
    await period.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    const geometry = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-slot="card"]'));
      const rect = (title: string) =>
        cards.find((card) => card.querySelector("h2,h3")?.textContent === title)?.getBoundingClientRect();
      const spending = rect("Spending Overview");
      const allocation = rect("Account Allocation");
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        aligned: innerWidth < 1280 || (spending && allocation && Math.abs(spending.bottom - allocation.bottom) < 1),
        outline: document.activeElement ? getComputedStyle(document.activeElement).outlineStyle : "none",
      };
    });
    if (geometry.overflow || !geometry.aligned || geometry.outline === "none")
      throw new Error(`Finance layout/focus: ${JSON.stringify(geometry)}`);
    return [
      "Spending period keyboard menu; Accounts placeholder and Dashboard return",
      "Transfer field editable; named select retains visible focus",
      "Desktop Spending/Allocation bottoms aligned; no page overflow",
    ];
  }
  if (route === "/dashboard/patient-monitoring") {
    const clock = page.locator("[data-monitoring-clock]");
    const beforeClock = await clock.textContent();
    const waveform = page
      .getByRole("img", { name: "C01 II ecg waveform", exact: true })
      .locator(".recharts-line-curve");
    const reducedPath = await waveform.getAttribute("d");
    await page.waitForTimeout(1200);
    if (beforeClock === (await clock.textContent())) throw new Error("Live clock did not advance");
    if (reducedPath !== (await waveform.getAttribute("d"))) throw new Error("Reduced-motion waveform moved");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(300);
    const runningPath = await waveform.getAttribute("d");
    await page.waitForTimeout(400);
    if (runningPath === (await waveform.getAttribute("d"))) throw new Error("Normal-motion waveform did not update");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(250);
    const pausedPath = await waveform.getAttribute("d");
    await page.waitForTimeout(300);
    if (pausedPath !== (await waveform.getAttribute("d"))) throw new Error("Waveform did not pause after media change");
    await page.getByRole("button", { name: "Acknowledge", exact: true }).press("Enter");
    if (!(await page.getByRole("button", { name: "Acknowledged", exact: true }).isDisabled()))
      throw new Error("Acknowledgement did not persist");
    await page.getByRole("button", { name: "Open C01, Ethan Brooks", exact: true }).press("Enter");
    await page.getByRole("tab", { name: "Event review", exact: true }).click();
    await page
      .getByRole("tabpanel", { name: "Event review", exact: true })
      .getByText("Lead II selected", { exact: true })
      .waitFor();
    await page.getByRole("tab", { name: "Trends", exact: true }).click();
    await page.getByRole("button", { name: "Print", exact: true }).focus();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error("Page-wide overflow");
    return [
      "Real clock advances across second boundary",
      "Reduced-motion trace stable",
      "Normal-motion trace updates; runtime reduction pauses it",
      "Keyboard acknowledgement persists; patient selection and event/trend tabs work",
      "Footer keyboard focus and no page-wide overflow",
    ];
  }
  if (route === "/dashboard/infrastructure") {
    const group = page.getByRole("button", { name: "Weblabs Studio (Admin Console)", exact: true });
    await group.press("Enter");
    if ((await group.getAttribute("aria-expanded")) !== "false") throw new Error("Project did not collapse");
    await group.press("Enter");
    await page.getByRole("button", { name: "Project actions for Admin Console", exact: true }).press("Enter");
    await page.getByRole("menuitem", { name: "Activity Logs", exact: true }).waitFor();
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "Environment actions for workspace.example.com/dashboard", exact: true })
      .press("Enter");
    await page.getByRole("menuitem", { name: "View Logs", exact: true }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("textbox", { name: "Search environments", exact: true }).fill("demo");
    if ((await page.locator("tbody tr").count()) !== 4) throw new Error("Fixture rows changed");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error("Page-wide overflow");
    await page.getByRole("button", { name: "Project actions for Inbox", exact: true }).press("Enter");
    await page.getByRole("menuitem", { name: "Project Settings", exact: true }).waitFor();
    return [
      "Enter collapses/reopens project",
      "Named project/environment action menus open; Escape closes",
      "All four fixture rows and empty project retained",
      "Search remains a demo input; no page-wide overflow",
      "Empty-project menu open",
    ];
  }
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
