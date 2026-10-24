# v0.6.1 / 002 — Collapsed header toggle evidence

PR: https://github.com/moeghashim/tenboards/pull/64
Before application: origin/main 28cdc56, with the screenshot-state capture helper only.
After application: 8875f4e (subsequent changes affect verification/docs only).
Preview: https://530b083a-tenboards-preview.mohanadgh.workers.dev/dashboard/default
Alias: https://pr-64-tenboards-preview.mohanadgh.workers.dev/dashboard/default

## Verification

- `npm run build`, `npm run check`, `npm run typecheck`: pass. The isolated preview command rebuilds the final application and confirms ASSETS only, no secrets.
- `npm run screenshots -- --routes /dashboard/default --sidebar-states --output screenshots/v061-002/{before,after}`: both four-context runs pass, zero console/page/request errors. All submitted PNGs were visually inspected. Desktop expanded/collapsed and mobile sheet open/closed are captured separately in both themes; the base files additionally capture the settled dashboard.
- `node --experimental-strip-types scripts/sidebar-toggle-check.ts`: 96/96 hydrated combinations pass (3 styles × 2 collapse modes × 4 presets × 2 themes × 2 viewports). Checks cover collapsed-cookie direct load, desktop expansion, focus handoff/outline, Ctrl+B, persisted collapse on reload, Cmd+B, mobile sheet Enter/Escape/focus return and mobile-to-desktop focus handoff.
- `node --experimental-strip-types scripts/sidebar-toggle-check.ts --ssr --base-url https://530b083a-tenboards-preview.mohanadgh.workers.dev`: 96/96 cookie combinations pass with JavaScript disabled; each checks collapsed and expanded initial markup. Theme boot is intentionally disabled in this pass, so this verifies server state/visibility rather than theme boot behavior. CSS hides the duplicate without waiting for hydration; the hydrated matrix verifies all actual presets/themes.
- Hosted T3 browser smoke: collapsed desktop has one visible toggle and header display:none; mobile opener opens the sheet and Escape returns its active element. No browser console errors. T3's unfocused background document does not dispatch focus events during scripted resize, so resize focus acceptance uses the focused Playwright matrix instead.
- Breadcrumb starts 24px inside the desktop header, without a placeholder gap. No tokens/presets changed; existing AA pairs and reduced-motion styles remain intact.

## Diagnostics

Inherited Biome: one `src/lib/highlighter.tsx` array-index-key warning and eight nursery class-order infos; no errors. Pre-commit preset generation reports the existing Node `fs.Stats` deprecation. Build and preview deployment succeed.

Initial new-harness failures are preserved in logs: an unscoped header locator also matched TanStack Devtools, a shortcut was sent before post-hydration effects settled, and a hidden off-canvas state was incorrectly awaited as visible. The final check scopes the shell header, waits for network idle after hydration, and waits for off-canvas state attachment. No application defect was found by those three failures; the final matrix passes.

The desktop light chart can differ slightly while settling at capture time; shell inspection is unaffected. All four mobile state captures are pixel-identical before/after. Dark desktop expanded is pixel-identical; dark collapsed changes only the header toggle/breadcrumb region. Capture output remains on pr-assets only.

## Screenshots

| Theme / viewport / sidebar | Before | After |
| --- | --- | --- |
| light / desktop / expanded | [before](before/_dashboard_default-light-desktop-sidebar-expanded.png) | [after](after/_dashboard_default-light-desktop-sidebar-expanded.png) |
| light / desktop / collapsed | [before](before/_dashboard_default-light-desktop-sidebar-collapsed.png) | [after](after/_dashboard_default-light-desktop-sidebar-collapsed.png) |
| light / mobile / expanded | [before](before/_dashboard_default-light-mobile-sidebar-expanded.png) | [after](after/_dashboard_default-light-mobile-sidebar-expanded.png) |
| light / mobile / collapsed | [before](before/_dashboard_default-light-mobile-sidebar-collapsed.png) | [after](after/_dashboard_default-light-mobile-sidebar-collapsed.png) |
| dark / desktop / expanded | [before](before/_dashboard_default-dark-desktop-sidebar-expanded.png) | [after](after/_dashboard_default-dark-desktop-sidebar-expanded.png) |
| dark / desktop / collapsed | [before](before/_dashboard_default-dark-desktop-sidebar-collapsed.png) | [after](after/_dashboard_default-dark-desktop-sidebar-collapsed.png) |
| dark / mobile / expanded | [before](before/_dashboard_default-dark-mobile-sidebar-expanded.png) | [after](after/_dashboard_default-dark-mobile-sidebar-expanded.png) |
| dark / mobile / collapsed | [before](before/_dashboard_default-dark-mobile-sidebar-collapsed.png) | [after](after/_dashboard_default-dark-mobile-sidebar-collapsed.png) |
