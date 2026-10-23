Task: 012 — Restyle Auth V1/V2 and fix request-year hydration
Linked: dev/milestones/v0.3-app-pages/012-auth-pages.md
Preview: https://a9dd9c26-tenboards.mohanadgh.workers.dev · https://v03-012-tenboards.mohanadgh.workers.dev

Stack: 008 (#34) → 009 (#35) → 010 (#36) → 011 (#37) → 012 → 013–014. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/feat/v0.3/011-profile...feat/v0.3/012-auth

Auth V2 serializes request-time UTC copyright through its parent loader, eliminating the demonstrated 1970/2026 server/client mismatch on both forms. Shared flow layout keeps forms, navigation and footers reachable at short heights.

README: updated (Authentication demos (v0.3 / 012)).

### Acceptance criteria
- [x] Auth V2 login: no React #418 hydration error in dev or Workers preview, light/dark × desktop/mobile.
- [x] Auth V2 register: no React #418 hydration error in dev or Workers preview, light/dark × desktop/mobile.
- [x] Both V2 fixes address demonstrated root causes: no suppressHydrationWarning, no SSR disabling, no frozen clocks. Direct loads, refresh, delayed JS and different real server/browser timezones pass; shared layout and V1 variants remain clean.
- [x] All four forms retain labels, validation/errors, password controls, social demo actions and cross-links. Keyboard focus/return, narrow/short viewport overflow and browser autofill are inspected.
- [x] All five URLs receive screenshot/smoke evidence; layout-only `/auth/v2` is explicitly tested rather than mistaken for a missing page. Resolve login and register hydration entries individually with evidence.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- Auth routes/local frame: responsive flow layout, coherent headings/copy and shared request data.
- APP_CONFIG: replace module-time copyright with explicit year formatting; both consumers use loader data.
- Shared forms: associate errors and correct invalid toast nesting without changing validation/submission.
- Auth capture scenario, README and task/status verification.

### Tests
Build, check and typecheck pass. Dev and Workers each pass 40/40 delayed direct/refresh auth interaction cases across five URLs, both themes and viewports (browser Pacific/Kiritimati, dev server Chicago). Final Workers Chicago additionally passes 16/16 V2 hydration cases plus 8/8 default smoke; dev default smoke passes 4/4. Both V2 gates separately pass. Raw SSR before/after files prove ©1970→©2026; real browser year and UTC requests agree. Empty/mismatch errors, keyboard cross-links, masked passwords/autofill, demo submit and Google no-op, 360×500 reachability/overflow verified. Initial form interactions exposed inherited invalid pre-inside-p toast markup; exact failures are preserved in after.log, corrected using span/code and rerun. Initial baseline Workers React #418 logs retained in before-workers. Inherited highlighter warning and 10 informational diagnostics remain; no new runtime dependency/token changes. Additional 16/16 Workers form cases inspect short-height states; supported-token audit passes all 280 comparisons, and actual Auth V2 light text pairs measure at least 6.12:1. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-012).

### Screenshots

/auth/v1/login

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_login-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_login-light-desktop-interactive.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_login-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_login-light-mobile-interactive.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_login-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_login-dark-desktop-interactive.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_login-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_login-dark-mobile-interactive.png) |

/auth/v1/register

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_register-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_register-light-desktop-interactive.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_register-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_register-light-mobile-interactive.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_register-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_register-dark-desktop-interactive.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v1_register-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v1_register-dark-mobile-interactive.png) |

/auth/v2

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2-light-desktop-interactive.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2-light-mobile-interactive.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2-dark-desktop-interactive.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2-dark-mobile-interactive.png) |

/auth/v2/login

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_login-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_login-light-desktop-interactive.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_login-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_login-light-mobile-interactive.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_login-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_login-dark-desktop-interactive.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_login-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_login-dark-mobile-interactive.png) |

/auth/v2/register

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_register-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_register-light-desktop-interactive.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_register-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_register-light-mobile-interactive.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_register-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_register-dark-desktop-interactive.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/before/_auth_v2_register-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-012/workers-final/_auth_v2_register-dark-mobile-interactive.png) |

### Decisions
The repeated V2 frame/footer justified a local AuthFrame; the proven module clock cause justifies the narrowly scoped APP_CONFIG change. Loader serialization follows TanStack data-loading guidance and the existing Invoice request-data pattern. No suppression, SSR disabling, frozen clock or auth behavior change. Bare V2 remains layout-only. Login and register hydration resolutions are separately recorded in open-questions. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-012`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
