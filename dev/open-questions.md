# Open questions

## 2026-10-23 — 012 full-matrix clock hydration blocker

Task 009 long-title capture exposed an inherited `new Date()` in `src/routes/(main)/dashboard/patient-monitoring/route.tsx:19`. Direct SSR navigation can render different seconds on the server/client, causing hydration recovery. The failure predates this batch (the page file is unchanged from main). Exact output is retained with task 009 evidence in `pr-assets/009/009-inherited-failure.log`.

Observed diff: client `04:55:30`, server `04:55:29`; a second smoke reproduced client `04:55:50`, server `04:55:49`. React reports: `Hydration failed because the server rendered text didn't match the client.`

Decision requested: authorize a narrow nonvisual clock hydration fix in 012, or leave the full-matrix acceptance criterion blocked. No page content edit made. Independent shell tasks continue; error-free full-route acceptance remains pending.

## 2026-10-23 — 012 Calendar Workers hydration blocker

The complete task 012 Workers matrix reports a React HTML hydration mismatch on `/dashboard/calendar` in both themes at desktop/mobile. A separate four-state capture against the existing production deployment reproduces the same failure in all four cases, establishing that it predates this shell batch. Calendar source and primitives remain unchanged.

Exact output: `page: Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.` Logs/reports: `pr-assets/012/012-production-calendar.log` and `pr-assets/012/production-calendar/report.json`.

Decision required: authorize a narrowly scoped Calendar SSR/hydration investigation/fix (which may touch the protected calendar surface), or accept this as a documented upstream limitation and explicitly waive the clean full-route gate. Dependent acceptance remains blocked; no Calendar edit is made. Patient Monitoring's clock decision above also remains pending.

Other initial capture failures were an external Google font timeout on Calendar and a null `document.body` during a Finance capture. All eight Calendar/Finance local retry cases passed. Original logs remain in task 012 evidence; these retries do not clear the reproduced Workers Calendar or Patient Monitoring hydration issues.

Finance and Invoice also reproduce React text hydration error #418 in all four preview matrix cases and on the existing production deployment (see `pr-assets/012/012-production-baseline.log`). Their page content is unchanged in this batch. The same decision is required for these inherited non-shell SSR failures; no dashboard/app-page fix is included without authorization. Exact output is the Calendar message above with `args[]=text` instead of `args[]=HTML`.


## 2026-10-23 — 012 final acceptance status

The final Workers matrix has 32 inherited hydration failures across eight routes: `/dashboard/calendar`, `/dashboard/finance`, `/dashboard/invoice`, `/dashboard/patient-monitoring`, `/dashboard/productivity`, `/dashboard/finance-v1`, `/auth/v2/login`, and `/auth/v2/register`. Each fails in light/dark at desktop/mobile and reproduces on the existing production deployment. Production logs and reports are retained in `pr-assets/012` under `production-calendar`, `production-baseline`, `production-productivity`, `production-finance-v1`, and `production-auth`. No page/auth/calendar implementation is changed.

Exact text error: `page: Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.` Calendar uses `args[]=HTML` as recorded above.

Initial Workers results: 119/152 pass; a CRM light/mobile navigation timeout passed on a four-state retry, leaving 120/152 passing cases and the 32 hydration failures. Local results: 148/152 pass initially; eight Calendar/Finance retry cases pass, leaving two Patient Monitoring clock failures. Original reports are preserved alongside retries. Build, check, typecheck, default-route smoke, 16 local plus 16 Workers shell accessibility scenarios, and 280 contrast comparisons pass.

Task 012 is blocked, with the clean-captures acceptance box unchecked. Required decision: authorize scoped SSR/hydration fixes for these eight inherited routes (including protected Calendar/auth surfaces), or explicitly waive the inherited errors in the full-route gate. Root AGENTS.md requires escalation for scope expansion and protected surfaces; the approved batch is shell-only. No dependent fixes proceed without that decision. Full evidence: https://github.com/moeghashim/tenboards/tree/pr-assets/012.

**Resolution (2026-10-23, user via reviewer)**: Waived for v0.1. All three 012 hydration entries above are answered: each affected route's hydration fix becomes a required acceptance criterion in the v0.2/v0.3 task that restyles it (Finance, Finance V1, Productivity, Patient Monitoring → v0.2; Calendar, Invoice, Auth V2 → v0.3). **Status**: answered

### v0.2 task 004 verification

The Finance and Finance V1 portion of the inherited hydration finding is resolved on the task 004 version preview. Explicit demo statement dates and UTC formatting remove module-clock and timezone differences. Direct/refresh light/dark desktop/mobile pass in dev (Kiritimati server vs Chicago browser) and Workers (Chicago and Kiritimati browser zones). Evidence: `pr-assets/v02-004/after-timezone`, `workers`, `workers-kiritimati`. Other inherited routes remain for their scoped tasks; this does not change production.
