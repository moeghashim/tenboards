# Finance verification

Build (preview:deploy), check and typecheck passed. Final preview f2202fc1, alias v02-004.

## Hydration diagnosis and fix
On 2026-10-23T11:49:55Z, fetched Workers SSR markup from 8fbffc83 rendered Finance upcoming dates January 3/5/11, 1970 and Finance V1 payments January 3/3/8/10, 1970 while the request-time header was October 23, 2026. Module-initialization Date values and browser initialization used different clocks. Dev server in Pacific/Kiritimati also reproduced header/client date differences (October 24 vs October 23) and legacy due dates (October 26 vs October 25). before-timezone.log preserves eight failures and before-workers.log preserves React #418 in all eight states.

Fixed at the shared demo fixture boundary: explicit ISO dates, en-US UTC formatting, visibly dated October 23, 2026 statement. No suppressed warnings, SSR opt-out, or test clock replacement. Helper shared only between the two finance routes. Upcoming copy now says upcoming bills and scheduled autopay, avoiding live-date claims.

Timezone server launch: TZ=Pacific/Kiritimati npm run dev -- --host 127.0.0.1 --port 3001. server-timezone.txt records the live process TZ and actual node date (October 24 while Chicago is October 23). Final after-timezone/report.json: both routes, light/dark, desktop/mobile, direct/refresh. Workers and workers-kiritimati report.json repeat both runtime browser zones. Ordinary four-preset captures include all eight route states per preset. All capture contexts use reduced motion with actual clocks.

## Interaction observations
T3 collaborative browser: Finance Accounts and Transactions tabs reveal their existing coming-soon panels; Dashboard restores content. Account currency changed USD to EUR, total €234,896 and four account amounts updated; mobile document width remained 390px. Legacy cash-flow picker now reads This Year and changes to Last 6 Months. Activity, Insights, Utilities remain aria-disabled=true. Demo actions remain placeholders; no financial behavior added. Chart series remain directly labelled, allocation segments have names/percentages, cashflow has signed positive/negative geometry and totals, semantic values carry explicit signs. Currency interaction image predates leader-line removal; final screenshot matrix shows that correction.

## Design and scope
Prefactor inspection found shared date formatting to isolate as a narrow fixture seam. Shared 001 cards/chart presentation reused; no runtime dependencies, shell redesign, protected UI/calendar or PLAN changes. Chart/status token values unchanged; supported contrast from 001: chart text >=6.86:1, strokes >=5.96:1; existing semantic token pairs and primary/primary-foreground audited in 001. Default/Graphite/Pine/Iris preserve labels and signs without color-only identification. Local screenshots contain inherited dev-tool overlay; Workers captures have unobscured content.

## Failures and inherited warnings
Initial malformed date edit caused TS1005/TS1136; corrected before validation, original output in typecheck-initial-failure.log. Expected before-fix hydration errors are retained separately. Inherited Biome highlighter.tsx noArrayIndexKey; build third-party use-client directive/chunk-size warnings; commit preset generator DEP0180. Final check/typecheck/build logs retained.

Keyboard: T3 DOM keydown ArrowRight on the focused Recharts application reveals Apr / Income $7,100 / Expenses -$3,200. Native preview_press failed to deliver that key; DOM key dispatch verified the chart handler. T3 snapshot later failed with PreviewAutomationExecutionError on two tabs; repository screenshot runner remained available.
