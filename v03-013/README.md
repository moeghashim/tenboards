Task: 013 — Restyle system states and verify HTTP/error recovery
Linked: dev/milestones/v0.3-app-pages/013-system-pages.md
Preview: https://bf4d3eef-tenboards.mohanadgh.workers.dev · https://v03-013-tenboards.mohanadgh.workers.dev

Stack: 008 (#34) → 009 (#35) → 010 (#36) → 011 (#37) → 012 (#38) → 013 → 014. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/feat/v0.3/012-auth...feat/v0.3/013-system

Coming Soon, dashboard splat, root not-found, Unauthorized and RootError now have distinct readable states. Entry redirects and HTTP semantics are preserved; a QA-only browser injection exercises the real root boundary and reset.

README: updated (System states (v0.3 / 013)).

### Acceptance criteria
- [x] Coming Soon, dashboard not-found, root not-found, Unauthorized and RootError each have distinct appropriate copy and matching visual hierarchy; existing recovery links/reset work by keyboard.
- [x] Capture root not-found and a controlled real root error on dev and Workers preview, including reset/recovery. Record expected injected exception/HTTP diagnostics separately; no unexpected console errors or hydration recovery are accepted.
- [x] Verify root unknown-path HTTP semantics and unchanged `/`, `/dashboard`, `/dashboard/` destinations. Do not add an external landing page, redirect behavior or auth gate.
- [x] Supplemental four-state before/after evidence covers both non-route boundaries; ordinary route evidence alone cannot satisfy this task. Owned source has no upstream-author references.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- Five existing system presentations: headings, wrapping copy, spacing and existing recovery controls.
- QA-only boundary scenario/capture flag: actual root error injection/reset and root 404 with expected diagnostics.
- README/task/status: verified HTTP and recovery behavior.

### Tests
Build, check and typecheck pass. Dev and Workers each pass 20/20 owned-state cases (three generated routes plus two supplemental boundaries), with 16/16 entry/default smoke cases each. All 10 HTTP assertions pass: three 307→default redirects, root 404 and dashboard splat 200 per environment. Root reset recovers by keyboard; generic production error text verified. Four-state non-route baseline/after evidence retained. Initial baseline harness classified Chromium’s expected `console: Failed to load resource: the server responded with a status of 404 ()` as unexpected because it expected a reason phrase; exact logs are preserved, and corrected matching checks both status and the unknown document URL. No unexpected errors remain. Inherited highlighter warning and 10 informational diagnostics remain. Supported neutral/primary token pairs are unchanged and audited across all presets/themes in 012. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-013).

### Screenshots

/dashboard/coming-soon

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard_coming-soon-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard_coming-soon-light-desktop-interactive-state.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard_coming-soon-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard_coming-soon-light-mobile-interactive-state.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard_coming-soon-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard_coming-soon-dark-desktop-interactive-state.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard_coming-soon-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard_coming-soon-dark-mobile-interactive-state.png) |

/dashboard/$

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard__-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard__-light-desktop-interactive-state.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard__-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard__-light-mobile-interactive-state.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard__-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard__-dark-desktop-interactive-state.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_dashboard__-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_dashboard__-dark-mobile-interactive-state.png) |

/unauthorized

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_unauthorized-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_unauthorized-light-desktop-interactive-state.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_unauthorized-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_unauthorized-light-mobile-interactive-state.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_unauthorized-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_unauthorized-dark-desktop-interactive-state.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before/_unauthorized-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/_unauthorized-dark-mobile-interactive-state.png) |

Supplemental root-not-found

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-not-found-light-desktop-state.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-not-found-light-desktop-interactive-state.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-not-found-light-mobile-state.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-not-found-light-mobile-interactive-state.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-not-found-dark-desktop-state.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-not-found-dark-desktop-interactive-state.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-not-found-dark-mobile-state.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-not-found-dark-mobile-interactive-state.png) |

Supplemental root-error

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-error-light-desktop-boundary.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-error-light-desktop-interactive-boundary.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-error-light-mobile-boundary.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-error-light-mobile-interactive-boundary.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-error-dark-desktop-boundary.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-error-dark-desktop-interactive-boundary.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/before-workers-boundaries/qa_root-error-dark-mobile-boundary.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-013/workers/qa_root-error-dark-mobile-interactive-boundary.png) |

### Decisions
The five short components have distinct statuses/actions; no presentation helper was warranted. A dedicated QA module isolates browser-only fault injection, and the supplemental capture inventory leaves generated routes untouched. Root reset implementation, production detail guard and entry redirects remain intact. No new auth gate or landing UI. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-013`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
