Task: 008 — Restyle File Manager grid and list
Linked: dev/milestones/v0.3-app-pages/008-file-manager-page.md
Preview: https://914e4255-tenboards.mohanadgh.workers.dev · https://v03-008-tenboards.mohanadgh.workers.dev

Stack: first layer from main; merge before 009–014. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/main...feat/v0.3/008-file-manager

File cards expose owner/date/shared metadata, star controls stay visible, and the mobile list preserves every column in a local scroll region. Corrects the Base UI star-menu callback and neutralizes all owner initials.

README: updated (File Manager (v0.3 / 008)).

### Acceptance criteria
- [x] Grid/list toggles, direct query URLs, reload, existing filters/actions and folder navigation retain their current behavior.
- [x] Long filenames and metadata remain available in both views; cards reflow and lists scroll locally on mobile; icon-only actions have names and visible focus.
- [x] Every file owner and any author-linked email/initial is neutral in both grid/list presentations.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- File Manager route/components: spacing, full metadata, visible star state, corrected menu callback and neutral owners.
- Screenshot scenario: query refresh readiness, stars and mobile scrolling.
- README/task/status: verified task 008 behavior and review state.

### Tests
Production build (inside preview:deploy), npm run check and npm run typecheck pass. Dev and Workers: 8/8 File Manager direct/refresh interaction cases each and 4/4 default-dashboard smoke cases each. Before captures: grid 4/4 and list 4/4. Supported token contrast: all 280 checks across 4 presets × 2 modes pass. Existing highlighter warning and 6 existing class-order infos; 4 additional class-order infos are nonfailure diagnostics. Initial loopback connection failure, unsupported default interaction invocation and dev refresh-readiness failure remain in exact logs; corrected runs are dev-synced, workers, smoke and workers-smoke. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-008).

### Screenshots

/dashboard/file-manager?view=grid

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-grid-retry/_dashboard_file-manager-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-light-desktop-interactive-grid-starred.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-grid-retry/_dashboard_file-manager-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-light-mobile-interactive-grid-starred.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-grid-retry/_dashboard_file-manager-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-dark-desktop-interactive-grid-starred.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-grid-retry/_dashboard_file-manager-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-dark-mobile-interactive-grid-starred.png) |

/dashboard/file-manager?view=list

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-list/_dashboard_file-manager-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-light-desktop-interactive-list-metadata.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-list/_dashboard_file-manager-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-light-mobile-interactive-list-metadata.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-list/_dashboard_file-manager-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-dark-desktop-interactive-list-metadata.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/before-list/_dashboard_file-manager-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-008/workers/_dashboard_file-manager-dark-mobile-interactive-list-metadata.png) |

### Decisions
Prefactor inspection found the existing shared FileActions seam sufficient; no new abstraction needed. Query contract and view-local state remain intact. Existing folder/filter actions are placeholders, confirmed against baseline. No token/preset edits. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-008`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
