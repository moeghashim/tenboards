# PR 76 — Review round 2

Head: `d6a771f6b216893a1aa4bdcc0b489a06d2e05b04`.

Fixed reviewer finding 1: global recovery labels now say “Go to dashboard” / “Return to dashboard”; not-found and root-error prose say “return to the dashboard”; the brand accessible name is “tenboards dashboard”. Contextual Projects → Home links remain unchanged. Updated the two matching check scripts and README landing description. Recovery checks now require a matching control rather than silently skipping a missing label.

Prefactor inspection: no app extraction needed for this copy-only fix; renamed the root-error QA locator from `home` to `recoveryLink`. No dependency, routing mechanism, token or layout change. Milestone remains in-review with the previously verified acceptance status. PLAN is untouched.

## Before / after evidence

All four affected recovery screens are captured in light/dark × desktop/mobile, plus the `/` landing smoke. Both reports have 20 cases and zero unexpected errors. Expected injected root-error exceptions and unknown-document 404 diagnostics are separated in report.json. Final interactions verify keyboard navigation to Default, root-error recovery-link focus, and Try again reset.

[Before contact sheet](before-contact.jpg) · [After contact sheet](after-contact.jpg) · [Before report](before/report.json) · [After report](after/report.json).

| Theme / viewport | Before recovery screens | After recovery screens |
| --- | --- | --- |
| light / desktop | [Unauthorized](before/_unauthorized-light-desktop.png) · [Dashboard 404](before/_dashboard__-light-desktop.png) · [Root 404](before/qa_root-not-found-light-desktop-state.png) · [Root error](before/qa_root-error-light-desktop-boundary.png) | [Unauthorized](after/_unauthorized-light-desktop-interactive-state.png) · [Dashboard 404](after/_dashboard__-light-desktop-interactive-state.png) · [Root 404](after/qa_root-not-found-light-desktop-interactive-state.png) · [Root error](after/qa_root-error-light-desktop-interactive-boundary.png) |
| light / mobile | [Unauthorized](before/_unauthorized-light-mobile.png) · [Dashboard 404](before/_dashboard__-light-mobile.png) · [Root 404](before/qa_root-not-found-light-mobile-state.png) · [Root error](before/qa_root-error-light-mobile-boundary.png) | [Unauthorized](after/_unauthorized-light-mobile-interactive-state.png) · [Dashboard 404](after/_dashboard__-light-mobile-interactive-state.png) · [Root 404](after/qa_root-not-found-light-mobile-interactive-state.png) · [Root error](after/qa_root-error-light-mobile-interactive-boundary.png) |
| dark / desktop | [Unauthorized](before/_unauthorized-dark-desktop.png) · [Dashboard 404](before/_dashboard__-dark-desktop.png) · [Root 404](before/qa_root-not-found-dark-desktop-state.png) · [Root error](before/qa_root-error-dark-desktop-boundary.png) | [Unauthorized](after/_unauthorized-dark-desktop-interactive-state.png) · [Dashboard 404](after/_dashboard__-dark-desktop-interactive-state.png) · [Root 404](after/qa_root-not-found-dark-desktop-interactive-state.png) · [Root error](after/qa_root-error-dark-desktop-interactive-boundary.png) |
| dark / mobile | [Unauthorized](before/_unauthorized-dark-mobile.png) · [Dashboard 404](before/_dashboard__-dark-mobile.png) · [Root 404](before/qa_root-not-found-dark-mobile-state.png) · [Root error](before/qa_root-error-dark-mobile-boundary.png) | [Unauthorized](after/_unauthorized-dark-mobile-interactive-state.png) · [Dashboard 404](after/_dashboard__-dark-mobile-interactive-state.png) · [Root 404](after/qa_root-not-found-dark-mobile-interactive-state.png) · [Root error](after/qa_root-error-dark-mobile-interactive-boundary.png) |

## Preview

- Version: https://a9e19f19-tenboards-preview.mohanadgh.workers.dev
- Alias: https://pr-76-tenboards-preview.mohanadgh.workers.dev
- Worker version: `a9e19f19-872a-425a-935f-f7d351bfe172`.
- Built from the final application commit `d6a771f`; guarded command: `npm run preview:deploy -- --preview-alias pr-76`. Remote verification: ASSETS only; no secrets. No production deployment or merge.

## Validation

- `npm run build`, `npm run check`, `npm run typecheck`: pass. Inherited dependency MODULE_LEVEL_DIRECTIVE build notices; Biome 35 warnings / 10 infos. Pre-commit emits inherited DEP0180 (`fs.Stats constructor is deprecated.`). No new warnings identified.
- `npm run screenshots -- --base-url http://localhost:3286 --routes '/,/unauthorized,/dashboard/$' --boundaries`: before 20/20. Final run adds `--interactions`: 20/20, no unexpected browser errors. Four `/` → `/dashboard/default` dev smoke cases pass.
- `scripts/auth-errors-check.ts`: 5/5 in dev and 5/5 in local workerd.
- README: updated (Default landing paragraph, explicit recovery labels and brand accessible name).
- No token or preset changes; contrast remeasurement not applicable. Inspected before/final recovery renders at desktop/mobile in light/dark.

## Original failure (retained)

The first auth-errors invocation omitted the password component of the isolated local test database URL and stopped in the existing URL validator before running a case. Corrected to the standard local fixture URL; both runtime suites pass. Exact output:

```text
file:///Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/src/server/data/source-config.ts:25
    throw new Error(
          ^

Error: Database commands require an explicit local Postgres DATABASE_URL.
    at databaseUrl (file:///Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/src/server/data/source-config.ts:25:11)
    at file:///Users/moeghashim/.t3/worktrees/tenboards/t3-b200052c/scripts/auth-test-support.ts:15:1
    at ModuleJob.run (node:internal/modules/esm/module_job:561:25)
    at async node:internal/modules/esm/loader:647:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.21.0
```

Original log: [auth-errors-config-failure.log](logs/auth-errors-config-failure.log). No application test failures in the completed boundary/auth-error suites.

## Final results

- `scripts/auth-hydration-check.ts`: 64/64, zero console/hydration errors, Chicago/Kiritimati × light/dark × desktop/mobile × direct/refresh.
- `scripts/project-redirect-check.ts`: 90/90 in dev and 90/90 in local workerd; each includes demo/auth, keyboard activation of the exact “tenboards dashboard” brand link, entry redirects, client replacement/back, legacy project aliases and revocation.
- `npm run deploy:check -- <url> --demo`: pass for both the version URL and pr-76 alias.
- Hosted label probes: 8/8; Unauthorized, root 404, dashboard splat and Default brand names verified on both URLs.
- Build has 335 inherited MODULE_LEVEL_DIRECTIVE notices. No outstanding test failures. All logs are under [logs/](logs/).

Implementation pushed to PR 76; review and CI remain reviewer-owned. Implementer never merges.
