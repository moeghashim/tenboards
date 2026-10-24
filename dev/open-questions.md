# Open questions

## 2026-10-24 — v0.6 production access and preview-rule reconciliation

**Status: resolved by PLAN's v0.6 template-readiness decision (2026-10-24, bb3c62a).** No project-owned Neon database will be provisioned; the live Worker stays demo-only. Task 004 is now [template deployment readiness](milestones/v0.6-production/004-production-cutover.md), explicitly authorized for implementation. No credential handoff blocks it. Hosted checks belong to adopters and are not claimed from local workerd evidence.

**Preview conflict: resolved by PLAN precedence and merged task 002 (PR #60).** Historical planning context: Current AGENTS/CONTRIBUTING and `preview:deploy` still describe version uploads on `tenboards`. The newer v0.6 previews decision requires `tenboards-preview` with no database bindings or secrets and wins immediately. Do not upload new PR versions to production using the stale command. This documentation-only planning PR cites an explicitly labeled existing immutable demo baseline. Task 001 must use an interim reviewed binding-free configuration targeting `tenboards-preview` for its version-preview gate, or record that gate as blocked; task 002 makes the isolated target permanent and updates contributor wording. No implementation or preview provisioning is authorized in this planning PR.

Technical gates belong to their tasks: 001 proves Nitro binding/request propagation and auth/DB lifetimes; 002 proves preview configuration isolation and shared limiter storage; 003 verifies remote migration opt-in and safe secret/deployment/rollback ordering. A failure requiring scope expansion or a new dependency must be logged here and pause dependent work. Existing trusted-origin and enabled in-memory limiter behavior are preserved/hardened, not treated as missing features. No change to PLAN is proposed.

## 2026-10-23 — v0.1 / 012 full-matrix clock hydration blocker

**Current status: resolved.** This historical finding is closed by the scoped v0.2/v0.3 fixes and the complete task 014 reconciliation below; original diagnosis and waiver history are retained.

Task 009 long-title capture exposed an inherited `new Date()` in `src/routes/(main)/dashboard/patient-monitoring/route.tsx:19`. Direct SSR navigation can render different seconds on the server/client, causing hydration recovery. The failure predates this batch (the page file is unchanged from main). Exact output is retained with task 009 evidence in `pr-assets/009/009-inherited-failure.log`.

Observed diff: client `04:55:30`, server `04:55:29`; a second smoke reproduced client `04:55:50`, server `04:55:49`. React reports: `Hydration failed because the server rendered text didn't match the client.`

Decision requested: authorize a narrow nonvisual clock hydration fix in 012, or leave the full-matrix acceptance criterion blocked. No page content edit made. Independent shell tasks continue; error-free full-route acceptance remains pending.

## 2026-10-23 — v0.1 / 012 Calendar Workers hydration blocker

**Current status: resolved.** This historical finding is closed by the scoped v0.2/v0.3 fixes and the complete task 014 reconciliation below; original diagnosis and waiver history are retained.

The complete task 012 Workers matrix reports a React HTML hydration mismatch on `/dashboard/calendar` in both themes at desktop/mobile. A separate four-state capture against the existing production deployment reproduces the same failure in all four cases, establishing that it predates this shell batch. Calendar source and primitives remain unchanged.

Exact output: `page: Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.` Logs/reports: `pr-assets/012/012-production-calendar.log` and `pr-assets/012/production-calendar/report.json`.

Decision required: authorize a narrowly scoped Calendar SSR/hydration investigation/fix (which may touch the protected calendar surface), or accept this as a documented upstream limitation and explicitly waive the clean full-route gate. Dependent acceptance remains blocked; no Calendar edit is made. Patient Monitoring's clock decision above also remains pending.

Other initial capture failures were an external Google font timeout on Calendar and a null `document.body` during a Finance capture. All eight Calendar/Finance local retry cases passed. Original logs remain in task 012 evidence; these retries do not clear the reproduced Workers Calendar or Patient Monitoring hydration issues.

Finance and Invoice also reproduce React text hydration error #418 in all four preview matrix cases and on the existing production deployment (see `pr-assets/012/012-production-baseline.log`). Their page content is unchanged in this batch. The same decision is required for these inherited non-shell SSR failures; no dashboard/app-page fix is included without authorization. Exact output is the Calendar message above with `args[]=text` instead of `args[]=HTML`.


## 2026-10-23 — v0.1 / 012 final acceptance status

**Current status: resolved.** This historical finding is closed by the scoped v0.2/v0.3 fixes and the complete task 014 reconciliation below; original diagnosis and waiver history are retained.

The final Workers matrix has 32 inherited hydration failures across eight routes: `/dashboard/calendar`, `/dashboard/finance`, `/dashboard/invoice`, `/dashboard/patient-monitoring`, `/dashboard/productivity`, `/dashboard/finance-v1`, `/auth/v2/login`, and `/auth/v2/register`. Each fails in light/dark at desktop/mobile and reproduces on the existing production deployment. Production logs and reports are retained in `pr-assets/012` under `production-calendar`, `production-baseline`, `production-productivity`, `production-finance-v1`, and `production-auth`. No page/auth/calendar implementation is changed.

Exact text error: `page: Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.` Calendar uses `args[]=HTML` as recorded above.

Initial Workers results: 119/152 pass; a CRM light/mobile navigation timeout passed on a four-state retry, leaving 120/152 passing cases and the 32 hydration failures. Local results: 148/152 pass initially; eight Calendar/Finance retry cases pass, leaving two Patient Monitoring clock failures. Original reports are preserved alongside retries. Build, check, typecheck, default-route smoke, 16 local plus 16 Workers shell accessibility scenarios, and 280 contrast comparisons pass.

Task 012 is blocked, with the clean-captures acceptance box unchecked. Required decision: authorize scoped SSR/hydration fixes for these eight inherited routes (including protected Calendar/auth surfaces), or explicitly waive the inherited errors in the full-route gate. Root AGENTS.md requires escalation for scope expansion and protected surfaces; the approved batch is shell-only. No dependent fixes proceed without that decision. Full evidence: https://github.com/moeghashim/tenboards/tree/pr-assets/012.

**Resolution (2026-10-23, user via reviewer)**: Waived for v0.1. All three 012 hydration entries above are answered: each affected route's hydration fix becomes a required acceptance criterion in the v0.2/v0.3 task that restyles it (Finance, Finance V1, Productivity, Patient Monitoring → v0.2; Calendar, Invoice, Auth V2 → v0.3). **Status**: answered

### v0.2 task 004 verification

The Finance and Finance V1 portion of the inherited hydration finding is resolved on the task 004 version preview. Explicit demo statement dates and UTC formatting remove module-clock and timezone differences. Direct/refresh light/dark desktop/mobile pass in dev (Kiritimati server vs Chicago browser) and Workers (Chicago and Kiritimati browser zones). Evidence: `pr-assets/v02-004/after-timezone`, `workers`, `workers-kiritimati`. Other inherited routes remain for their scoped tasks; this does not change production.

### v0.2 task 006 verification

The Productivity portion of the inherited hydration finding is resolved on version preview https://c2ec54fc-tenboards.mohanadgh.workers.dev/dashboard/productivity. Explicit demo calendar fields remove runtime/module-clock differences from the calendar, project dues and notes. Direct/refresh light/dark desktop/mobile pass with a Kiritimati dev server against Chicago browser and on Workers with Chicago and Kiritimati browsers. No frozen clock, SSR removal or warning suppression. Evidence: `pr-assets/v02-006/after-timezone`, `workers`, `workers-kiritimati`; keyboard scenarios pass in dev and Workers using a local focus-ref adapter, leaving protected calendar wrappers intact. Remaining inherited routes retain their assigned tasks; production is unchanged. Status: answered.

### v0.2 tasks 001–006 — DCO sign-off check

GitHub's DCO app reports `ACTION_REQUIRED` on the stack: `There are 6 commits incorrectly signed off.` Each implementation layer lacks an author `Signed-off-by` trailer; the required GPT co-author trailer is present. Build, lint, typecheck, visual, interaction and owned-route hydration gates pass. Exact DCO output is retained at `pr-assets/v02-batch-001-006/dco.txt`.

Status: resolved — reviewer remediation completed; PRs #14–#19 are merged and deployed (verified GitHub merge state). The historical failure above is retained for provenance. Batch 007–012 commits use the authorized local author Signed-off-by trailer plus the required GPT co-author trailer; no DCO blocker remains on PRs #20–#24.


### v0.2 tasks 011–012 — dashboard hydration resolved

Status: resolved for all four v0.2 routes: `/dashboard/finance`, `/dashboard/finance-v1`, `/dashboard/productivity`, `/dashboard/patient-monitoring`. The integrated [task 012 preview](https://c87d1f88-tenboards.mohanadgh.workers.dev/dashboard/default) passes every one of these routes in all four presets, light/dark and desktop/mobile on dev and Workers, without React #418 or other console/page errors. [Full matrix evidence](https://github.com/moeghashim/tenboards/tree/pr-assets/v02-012).

Patient Monitoring's render-time clock was the remaining root cause: SSR and the hydrating client now render the same placeholder; a client effect starts the real UTC clock. Realtime stores retain the stable server snapshot and pause continuous subscriptions for reduced motion. Task 011 passes 8/8 delayed direct/refresh cases per environment with a real 1800 ms JavaScript delay; assertions prove the clock advances, traces pause for reduced motion and resume with normal motion. Workers was tested in Pacific/Kiritimati and dev in America/Chicago. No frozen clock, suppressHydrationWarning or page SSR removal. [Task 011 evidence](https://github.com/moeghashim/tenboards/tree/pr-assets/v02-011).

Calendar, Invoice and Auth V2 login/register remain assigned to v0.3 under the locked inherited-hydration decision. Their v0.1 waiver is historical and does not waive future v0.3 acceptance. No new blocker or scope question is open for v0.2; tasks 007–012 still await authorized review/merge and subsequent production deployment.


## 2026-10-23 — v0.3 breakdown baseline check failure

Status: answered — fixed by reviewer on main in `18096de` (style: restore biome formatting of package.json); `npm run check` passes again. On clean main `1815a6b` (v0.2.0), `npm run check` exits 1 with `package.json format`: `Formatter would have printed the following content`. Biome expects the `lint-staged` array on one line: `"*.{js,ts,jsx,tsx}": ["biome check --write --no-errors-on-unmatched"]`. The file's SHA-1 is `bc0ef2ba1f82442711a81c21f27487e42dcf445a` both in HEAD and the working tree. This is an inherited formatting failure, separate from the one highlighter warning and six informational diagnostics. Build/typecheck and the 100-case scoped dev screenshot smoke pass. Full output: [planning check log](https://github.com/moeghashim/tenboards/blob/pr-assets/v0.3-breakdown/check.log).

The approved step is task breakdown only, so package/source files remain unchanged. The reviewer must resolve this through an authorized change or explicitly record the docs-PR disposition; task 014 and every implementation task still require a passing build/check/typecheck gate. Independent planning, route inspection and documentation are complete; no v0.3 implementation has started.


### v0.3 task 004 Calendar verification

The inherited Calendar hydration finding is resolved on version preview https://12731e75-tenboards.mohanadgh.workers.dev/dashboard/calendar. FullCalendar's server-local today cell differed from the browser's local date. The route now shares a request timestamp and UTC initial timezone through hydration, then adopts browser-local time with a live clock; date fixtures derive from the same snapshot. No warning suppression, SSR disabling or frozen clock. Dev Chicago versus browser Kiritimati and Workers versus Chicago/Kiritimati pass direct/refresh with delayed JavaScript, all four light/dark desktop/mobile states. Today and the real now marker are verified. Evidence: https://github.com/moeghashim/tenboards/tree/pr-assets/v03-004 (`after`, `workers`, `workers-chicago`, `clock-dev`, `clock-workers`, `live-now.txt`). Reviewer pre-approval, v0.3 batch A brief was recorded; no protected calendar structural edits were needed. Invoice and Auth V2 remain assigned to their tasks. Status: answered.


### v0.3 task 007 Invoice verification

The inherited Invoice hydration finding is resolved on version preview https://0befc4c3-tenboards.mohanadgh.workers.dev/dashboard/invoice. Independent module clocks generated different civil dates in server Chicago and browser Kiritimati; request-scoped UTC civil defaults are now serialized by the route loader and retain editable dates. Dev and Workers pass delayed JavaScript/direct/refresh across light/dark desktop/mobile, with Workers browser zones Chicago and Kiritimati. No frozen clock, SSR disabling or suppression. Preview/print totals agree, and rendered one-page Letter PDFs verify long descriptions, addresses, total and neutral issuer. [Reports, baseline exact error and PDF evidence](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-007). Status: answered. Auth V2 login/register retain their task 012 hydration gates; no batch A blocker remains.


### v0.3 task 012 — Auth V2 login resolved

Status: resolved. `/auth/v2/login` server HTML used `© 1970, tenboards.` while the browser rendered `© 2026, tenboards.`: APP_CONFIG evaluated the Worker module clock before a request. Copyright is now formatted from the real request's UTC year and serialized by the parent loader. No warning suppression, SSR disabling or frozen clock. Dev (Chicago server/Kiritimati browser) and [Workers version a9dd9c26](https://a9dd9c26-tenboards.mohanadgh.workers.dev/auth/v2/login) pass delayed-JavaScript direct/refresh in light/dark and desktop/mobile; Workers also passes Chicago browser time. [Exact baseline errors, SSR/client diff and passing reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-012) (`before-workers`, `ssr-copyright.json`, `client-copyright-before.json`, `ssr-copyright-after.json`, `after-final`, `workers-final`, `workers-chicago-final`). The historical v0.1 waiver is superseded for this route.

### v0.3 task 012 — Auth V2 register resolved

Status: resolved. `/auth/v2/register` independently reproduced the same server 1970/client 2026 text diff and React #418. It consumes the same serialized request-year loader data through the shared V2 form frame. Both browser timezones and every delayed direct/refresh light/dark desktop/mobile case pass on [Workers version a9dd9c26](https://a9dd9c26-tenboards.mohanadgh.workers.dev/auth/v2/register), with matching dev coverage. [Evidence](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-012) includes separate raw register SSR before/after, real browser observation and route-specific report rows. V1 forms and bare layout-only V2 also pass. Auth remains a UI-only demo; Better Auth is v0.5. Together with the linked v0.2 dashboard, v0.3 Calendar and Invoice resolutions above, all eight historically affected routes now have scoped fixes; task 014 repeats the integrated matrix.


### v0.3 task 014 — complete hydration reconciliation

Status: resolved for every historical hydration finding. The historical reports and v0.1 waiver above remain intact; all eight routes now have verified scoped resolutions:

| Historical route | Root cause / resolution | Evidence |
| --- | --- | --- |
| Finance, Finance V1 | Module dates / explicit demo civil dates and UTC formatting | [v02-004](https://github.com/moeghashim/tenboards/tree/pr-assets/v02-004), [integrated v02-012](https://github.com/moeghashim/tenboards/tree/pr-assets/v02-012) |
| Productivity | Runtime calendar/project/note dates / explicit demo fields | [v02-006](https://github.com/moeghashim/tenboards/tree/pr-assets/v02-006) |
| Patient Monitoring | Render-time seconds / stable hydration placeholder then real UTC clock | [v02-011](https://github.com/moeghashim/tenboards/tree/pr-assets/v02-011) |
| Calendar | Server/browser local-today mismatch / shared request timestamp and initial UTC, then live browser time | [v03-004](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-004) |
| Invoice | Independent module clocks / serialized request UTC civil defaults | [v03-007](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-007) |
| Auth V2 login | Worker module year 1970 versus browser 2026 / serialized request UTC copyright | [v03-012 login rows and raw SSR](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-012) |
| Auth V2 register | Independently reproduced same year mismatch / shared request loader | [v03-012 register rows and raw SSR](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-012) |

The [v0.3 final matrix](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-014) verifies all 38 catalog routes across four presets, light/dark and desktop/mobile: 608 cases per environment, 1,216 total, with no remaining unexpected errors after documented retries. Supplemental real-clock delayed direct/refresh/timezone, boundary/reset and interaction checks pass. No warning suppression, frozen clocks or SSR disabling were introduced as fixes. Expected QA exceptions/404 diagnostics are isolated. No open product/access question remains; review and merge remain Claude's responsibility, and the milestone stays in review.
