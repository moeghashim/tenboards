# PR #65 — review round 2

Customer Activity's segment trigger now fits its full label without relaxing compact density. In Geist at 1440×900 it grows from 112px to 114.094px; height stays 24.5px. The available label width is now 77.094px, matching the rendered text. JetBrains Mono visibly demonstrates the larger correction in `select-comparison.png`.

Preview: https://a30400b5-tenboards-preview.mohanadgh.workers.dev · alias https://pr-65-tenboards-preview.mohanadgh.workers.dev. Uploaded only through `npm run preview:deploy -- --preview-alias pr-65`; remote inventory confirms ASSETS only and no secrets.

## Implementation and prefactor inspection

The existing shared CSS/data-slot seam was sufficient; no component extraction or structural prefactor was needed. Toolbar selects and tab triggers get `min-width: max-content`, protecting text, icon and gap width. Full-width form selects retain their existing wrapping layout. Calendar changes its desktop fixed width to `auto` at its usage site. The 24px control floor moves into the base cascade layer, allowing larger explicit usage-site minimums to work again (notably Patient Monitoring's footer buttons).

The audit also reproduced fixed-select clipping in Analytics, Products and Calendar with mono fonts; tab squeezing in Finance, Analytics, Logistics and Patient Monitoring; and overridden mobile Patient Monitoring button minimums. All are resolved by these seams. No protected UI/calendar primitive, font registry, palette, density token, auth behavior or dependency changed.

## Trigger audit

T3 collaborative browser, hydrated development app, 1440×900, 1280×900 and 390×900 CSS viewports. All 18 registry fonts loaded from their real stylesheets before measuring text ranges against clipping ancestors and trigger bounds. This is viewport emulation, not a physical-device test.

- All ten dashboard routes plus Users, Products, Tasks, Invoice, Profile, dashboard Mail (including its iframe), Roles, Calendar, Kanban Table and File Manager: 20 routes × 3 widths × 18 fonts = **1,080 cases**, zero remaining trigger clipping and zero document overflow. `after-audit.json` includes 28,701 control observations.
- Open settings/preferences panel and Add Product form: **108 additional cases**, zero clipping. Native preference selects include every option label in the width check.
- Expanded select-label audit: **702 cases** across the 13 routes with select triggers, zero failures. Labels were collected from the rendered menus (Calendar's Month/Week/Day also verified against its local options). For simple select values, each option was temporarily placed in the existing value element for geometry measurement, then the original DOM nodes restored. This tests label fit without changing filters or fixtures; interaction tests separately cover actual state changes. Rich invoice client values retain their rendered wrapping structure.
- `before-audit.json` records the initial failures. Mail message rows deliberately truncate subjects and are not compact action/select triggers; they were excluded from the final trigger count. Their existing content truncation is unchanged. Sidebar navigation is outside this trigger audit and covered by the dedicated 192-case sidebar checks.

Reproducibility: `audit-expression.js`, `select-options-clean.json`, `option-audit.json`, `extra-audit.json`. All final cases wait for hydration before applying font geometry probes. The browser's accumulated diagnostics include exploratory font/DOM probes and Electron host messages; console/hydration acceptance comes from the isolated screenshot tests below.

## Verification

- `npm run build`, `npm run check`, `npm run typecheck`: pass. Inherited Biome one warning/eight class-order infos and dependency build advisories remain separate from failures.
- `npm run screenshots -- --density`: 52 route/theme/viewport captures pass after one Calendar rerun. Four Calendar rerun cases pass. Requested original eight screens plus Analytics, Products, Calendar, Logistics and Patient Monitoring are included.
- 28 additional requested dashboard captures with `--sidebar-states`: pass; expanded/collapsed images included.
- `density-check.ts`: 72 dev + 72 new-preview font/theme/viewport cases pass, now measuring both Tasks and Default. The new assertion **fails as expected on the previous preview**, reporting `actual: ['All segments']`; see `regression-before.log`.
- `sidebar-toggle-check.ts`: 96 hydrated + 96 JavaScript-disabled cases pass.
- Delayed hydration/direct/refresh interactions: 24 original cases pass after rerunning Default; all eight rerun cases pass. Eight Kanban/Mail interaction cases also pass.
- Eight new-version Default/Auth smoke captures pass with no console/page errors. The development Default capture/smoke also passes.
- All 280 supported preset/theme contrast checks pass; colors are unchanged.

Initial automation failures are preserved: Calendar `page.evaluate: Execution context was destroyed, most likely because of a navigation` in `after/report.json`, and Default mobile `locator.waitFor: Timeout 30000ms exceeded` waiting for `[data-mobile="true"]` in `hydration/report.json`. Their corresponding `calendar-rerun` and `hydration-rerun` reports are clean. Two test-script formatting errors were corrected before the final passing Biome run.

## Visual evidence

`select-before.png` / `select-after.png`: exact before/after crop at 1440 light. `select-before-mono.png` / `select-after-mono.png`: JetBrains Mono comparison. `select-comparison.png`: combined view. `four-state-inspection.png`: Default light/dark × desktop/mobile. `before`, `before-extra`, `before-mono`, `after`, `calendar-rerun`, `shell`, and font capture directories retain full renders.

Impeccable Operate mode: preserved hierarchy, compact heights and spacing, clean wrapping at mobile, readable select/tab labels, unchanged focus and contrast treatment. README and DESIGN describe intrinsic trigger sizing. Milestone stays in review. Implementer does not merge or deploy production.
