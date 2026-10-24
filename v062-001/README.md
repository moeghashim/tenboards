# v0.6.2 compact density evidence — PR #65

Baseline: `54c8d70`. Application change: `c08a5e4`, rebased without application changes as `e49bdfd` onto `cc3c5e7` to preserve concurrently merged v0.7 planning documentation.

Preview: https://6795e7df-tenboards-preview.mohanadgh.workers.dev
Alias: https://pr-65-tenboards-preview.mohanadgh.workers.dev
ASSETS only; no secrets. Production untouched.

## Canonical captures

`final-before/` and `final-after/` each contain the requested 32 route/theme/viewport cases, plus expanded/collapsed sidebar captures for seven dashboard routes. Auth has no sidebar. `final-after/` uses the corrected Kanban/Mail captures. Default/CRM/Finance/Tasks/Profile captures are unchanged by that correction. The development-tool badge is inherited and remains visible; no masking alters app content.

`before-measure/` and `final-after/*density.json` contain actual computed sizes. The initial unused `text-label` probe fell back to body size because Tailwind emitted no unused utility; the scale table uses the declared token for that row.

## Verification

- build / check / typecheck pass. Build retains dependency module-directive advisories; Biome retains one highlighter index-key warning and eight class-order infos.
- 72 dev and 72 isolated-preview font × mode × viewport combinations pass with actual face load, target/text floors, no page overflow and no console/hydration errors.
- 96 hydrated + 96 JavaScript-disabled sidebar cases pass across all presets, modes, viewports, sidebar styles and collapse modes, including keyboard/focus handoff and cookies.
- 24 delayed-hydration direct/refresh interaction cases pass across Default/Tasks/Auth after retries; eight additional corrected Kanban/Mail interaction cases pass.
- Eight version-preview Default/Auth captures pass, with no browser errors. Calendar receives four additional compatibility captures.
- 280 contrast checks pass: minimum supported text ratio 4.67:1; control/focus 3.41:1. No color token changed.

Initial transient automation failures are retained, not suppressed: sidebar dialog timeout; settings dialog element-handle timeout; a React development script-tag warning during one Auth refresh. Identical cases pass on rerun. The Kanban visual regression was separately fixed before final captures.

See `critique/review.md` for independent review and its tooling limits.

## Scale (CSS px)

| Element | Before | Compact desktop | Mobile |
| --- | ---: | ---: | ---: |
| Rem root | 16 | 16 | 16 |
| Common body/table text | 14 / 20 line | 13 / 18 line | 13 / 18 line |
| Unstyled body fallback | 16 / 24 line | 13 / 18 line | 13 / 18 line |
| Metadata `text-xs` | 12 / 16 line | 12 / 16 line | 12 / 16 line |
| `text-label` token (unused) | 13 / 18 line | 12 / 16 line | 12 / 16 line |
| Section heading `text-base` | 16 | 14 | 14 |
| `text-lg` / `text-xl` | 18 / 20 | 16 / 18 | 16 / 18 |
| Page heading `text-2xl` | 24 | 21 | 21 |
| Wide KPI `text-3xl` | 30 | 26 | 21 (existing breakpoint) |
| Large metric `text-4xl` | 36 | 32 | 32 |
| Default button/input/select | 32 | 28 | 32 |
| Small controls | 28 | 24.5 | 28 |
| Extra-small button target | 24 | 24 minimum | 24 minimum |
| Standard/small card padding | 16 / 12 | 14 / 12 | 16 / 12 |
| Header | 56 | 48 | 56 |
| Sidebar row / icon | 40 / 18 | 36 / 16 | 40 / 18 |
| Sidebar row horizontal padding | 12 | 10 | 12 |
| Page gutters | 24 desktop / 16 mobile | 21 | 16 |
| Grid gaps (4 / 6 utility steps) | 16 / 24 | 14 / 21 | 16 / 24 |
| Standard KPI card height at 1440 | 129.5 | 114 (−12.0%) | content-driven |
| Customer table row | 59 | 54.25 (−8.1%) | local scrolling |
| Single-line Tasks row | 45 | 39.5 (−12.2%) | wrapping/local scrolling |
