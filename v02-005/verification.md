# Analytics verification

Final version d12e4d81, alias v02-005. Build (preview:deploy), check, typecheck pass; exact logs retained. Before/after matrices cover both routes in light/dark desktop1440x900 and mobile390x844. Four-preset matrix 32 states inspected; dev Default smoke 4 states; Workers Default + both owned routes 12 states. Check reports for final URL/counts.

## Interaction evidence
T3 browser at preceding de986fcf (control code unchanged except current mobile tabs) and final d12e4d81:
- Campaigns tab changes source labels to Spring Launch, Newsletter, Retargeting, Brand Search, Partners. Audience shows its existing placeholder.
- Final Analytics period select opens all four options and changes to Last 7 days. Mobile tab list is66px tall; second-row tab bottom231px, period starts246px, documentwidth390px.
- Legacy filter Enterprise only yields Filters2 and Showing: Enterprise · Renewals. Risk view changes to Momentum.
- Date range changes from24Sep–23Oct to1Sep–23Oct2026, rebuilding revenue path (2229-character path after change).
- Risk Ladder sort ascending puts Soylent Foods/risk31 first. Table960px inside324px scroll container, document390px.
- Local no-op controls remain no-op, including realtime Refresh metrics, queue action and exports. Realtime data was a staticfixture and remains available with reduced motion; animatedping removed. No feature claims of live data.

The T3 screenshot endpoint failed repeatedly after working in004: `Preview snapshot failed: Preview automation snapshot failed on client preview-3b0bf85c654e3ddda362a235782eaa1f.` Error tag PreviewAutomationExecutionError, operation snapshot. Retried existing/new tab and preview_open; DOM evaluation, clicks, and repository screenshots remain functional. Interaction outcomes above are recorded from DOM checks rather than interactive PNGs. Required initial before/after PNGs are complete.

## Contrast and preservation
semantic-contrast.json measures actual computed foreground against10%semantic tint over card in all four presets/lightdark:32pairings, minimum5.86:1. Existing chart-contrast.json from001: charttext>=6.86:1, strokes>=5.96:1. New bars are opaque, source labels outsidebars, forecast shares onepercentageaxis with explicit solid/dotted/dashed key. KPI signs, countrycodes/names and risk text/scores remain understandable without color. No token changes.

Prefactor inspection reused001presentationhelpers and kept domain/state local. Legacy random series and live initial date replaced with deterministic demo range/series to avoid SSR variation. No newdependency or protected/shell/PLAN edits. Scoped identity audit arham/arhamkhnz/aiy/weblabs/khnz haszero matches; greetingJordan.

Initial typecheck TS6133unusedimports corrected; originalerrors in typecheck-initial-failure.log. Inherited Biome highlighter.tsx noArrayIndexKey, build third-party use-client/chunkwarnings, commitDEP0180. Reviewr1 found mobiletaboverlap, fixed usagevariantheight; r2 no blockers andREADMEaccepted.
