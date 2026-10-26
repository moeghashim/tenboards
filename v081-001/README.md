# v0.8.1 / 001 — Default dashboard landing evidence

PR: https://github.com/moeghashim/tenboards/pull/76

Baseline: main `51e3ca9`. Application preview built from `acb41c7`; later changes only stabilize QA focus timing and record acceptance. No application changes follow that preview build.

Version: https://f6b37f80-tenboards-preview.mohanadgh.workers.dev
Alias: https://pr-76-tenboards-preview.mohanadgh.workers.dev
Worker version: `f6b37f80-9f49-4705-a1d2-fc069d079ed3`; guarded uploader verified ASSETS only and no secrets.

## Verification

- `npm run build`: pass; inherited dependency MODULE_LEVEL_DIRECTIVE diagnostics (335 ignored use-client directives). Preview deployment rebuilt successfully.
- `npm run check`: pass; 35 inherited warnings and 10 infos. The first check found formatting in two edited scripts and inherited formatting in dev/milestones.json; formatting was corrected, with no status changes to older milestones.
- `npm run typecheck`: pass.
- `scripts/auth-redirect-check.ts`: 30/30; validation body unchanged, explicit Home remains valid.
- `scripts/auth-return-check.ts`: 10/10 in dev and workerd. Missing/unsafe fallback and validated Home return both exercised.
- `scripts/auth-errors-check.ts`: 5/5 in dev (rerun) and workerd. Real sign-in retry, duplicate submission and limiter recovery exercised.
- `scripts/auth-hydration-check.ts`: 64/64, both themes/sizes/timezones and direct/refresh; no console/hydration errors.
- `scripts/project-redirect-check.ts`: 90/90 in dev and workerd, each demo and authenticated mode. HTTP 307 entry chains, client replace/back history, keyboard brand, legacy project aliases, hashes and revoked sessions covered. `/dashboard/` retains its normalization hop through `/dashboard`.
- `scripts/project-access-check.ts`: pass in dev and workerd, including Home/project guards and RPCs.
- `scripts/legacy-redirect-check.ts`: 96/96 in dev and workerd.
- `scripts/workspace-ui-check.ts`: sequential rerun passes all four theme/viewport combinations and three delayed hydration timezones.
- `scripts/project-navigation-check.ts`: sequential rerun passes all four theme/viewport combinations, six layout/collapse combinations, corrupt/disabled storage, keyboard controls and project-qualified palette navigation.
- `scripts/deploy-check-test.ts`: pass for all fixture modes, including invalid sessions, hostile redirects and timeouts.
- `npm run deploy:check -- <preview> --demo`: pass against version and alias. Supplemental Node HTTP checks verify all eight landing redirect hops across both URLs.
- `npm run screenshots`: baseline entry flows 12/12; after entry/recovery matrix 27/28 with one premature injected-error focus assertion. Final boundary rerun passes 12/12; no original results are overwritten. All entry-route captures hydrate with no unexpected browser errors.

## Evidence map

- `before-rerun/`: baseline `/`, `/dashboard`, `/dashboard/`, light/dark × desktop/mobile, 12/12.
- `after-rerun/`: final landing/recovery matrix, including keyboard recovery for Unauthorized, root not-found and dashboard splat.
- `boundaries-final/`: 12/12 final Default and root not-found/error/reset evidence after moving the focus check past error-boundary capture.
- `auth-hydration/`: 64 delayed hydration screenshots and structured report.
- `workspace-ui-rerun/`, `project-navigation-rerun/`: successful preservation regressions.
- `logs/`: commands/results, original failures and reruns.
- `before-rerun-contact.png`, `after-rerun-contact.png`: visual QA contacts. Full-size original PNGs are retained.

No tokens/presets/styles changed; contrast remeasurement is not applicable. Existing accessible names, keyboard behavior, focus styles and reduced motion remain intact. Base UI renders the recovery anchors with role=button; the test now recognizes that existing role.

## Original failures and recovery

All original logs and screenshot reports remain available. The failures below were resolved without application changes outside the landing task.

1. The first baseline capture used 127.0.0.1 while Vite listened on localhost: `page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/dashboard/`. The localhost rerun passes 12/12.
2. The first dev auth error test timed out under concurrent browser runs; the unchanged test passes sequentially. Exact output:

```
[auth-errors.log]
PASS duplicate registration safe inline error
PASS network failure preserves non-secret input and permits retry
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard/default" until "load"
  navigated to "http://localhost:8111/auth/v2/login?redirect=%2Fdashboard%2Fdefault"
============================================================
    at /Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/scripts/auth-errors-check.ts:67:14 {
  log: [],
  name: 'TimeoutError'
}

Node.js v24.21.0

[workspace-ui.log]
PASS light/desktop: Home KPI parity, named sample person, owning-project links, index live search/status/keyboard/empty recovery, empty project, overflow and console
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: 'No matching projects', exact: true }) to be visible[22m

    at /Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/scripts/workspace-ui-check.ts:65:86 {
  log: [
    "  - waiting for getByRole('heading', { name: 'No matching projects', exact: true }) to be visible"
  ],
  name: 'TimeoutError'
}

Node.js v24.21.0

[project-navigation.log]
PASS light/desktop: exact active, storage pruning, keyboard disclosure, route policy, mobile dismissal, palette typed links, rail escape/outside/route focus, overflow, console
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

locator.waitFor: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('[data-mobile="true"]') to be visible[22m

    at openMobile (/Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/scripts/project-navigation-check.ts:43:51)
    at async file:///Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/scripts/project-navigation-check.ts:86:7 {
  log: [ `  - waiting for locator('[data-mobile="true"]') to be visible` ],
  name: 'TimeoutError'
}

Node.js v24.21.0

```

3. The new root-error locator initially assumed a link role. Exact failure: `locator.getAttribute: Timeout 30000ms exceeded.` while waiting for `getByRole('link', { name: 'Go to Home', exact: true })`. The test now uses the existing button role. The next run hit `Root error recovery link did not receive keyboard focus` in light/desktop only because the focus assertion preceded boundary capture; the focus check now runs after that capture, matching the existing stable Try again check.
4. An ad hoc Python urllib hosted probe returned `AssertionError: ('https://f6b37f80-tenboards-preview.mohanadgh.workers.dev/', 403)`. The Node fetch probe and repository deployment checker passed for both hosted URLs; all eight raw 307 hops are in `logs/preview-landing-http.log`.
5. The pre-commit preset generator emits the inherited `[DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.` It generated no changes.

No outstanding product, access or PLAN questions. No dev/open-questions.md change is required. PLAN, protected components, generated routes, dependency versions and release tags remain unchanged.

## Review round 2

[Label correction, refreshed preview, complete verification and before/after screenshots](round2/README.md). Head `d6a771f`; preview `a9e19f19`. All rerun suites pass after correcting the local fixture URL; original configuration failure retained. This supersedes the initial preview and recovery-label evidence above.
