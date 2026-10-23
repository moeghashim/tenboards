Task: 011 — Restyle Profile and neutralize its demo identity
Linked: dev/milestones/v0.3-app-pages/011-profile-page.md
Preview: https://6fa16c89-tenboards.mohanadgh.workers.dev · https://v03-011-tenboards.mohanadgh.workers.dev

Stack: 008 (#34) → 009 (#35) → 010 (#36) → 011 → 012–014. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/feat/v0.3/010-users-roles...feat/v0.3/011-profile

Profile uses a coherent Jordan Lee demo identity, readable wrapping details and semantic status treatments across all six tabs.

README: updated (Profile (v0.3 / 011)).

### Acceptance criteria
- [x] Overview, Personal, Employment, Compensation, Time off and Documents remain reachable and readable; tab scrolling, document controls and header actions preserve current behavior.
- [x] Long names, bios, email addresses, date ranges and document names fit mobile without lost data; heading levels and restricted-state copy remain clear.
- [x] Every personal identity field, bio reference, updater, email and derived avatar matches the neutral demo person; no upstream-author reference remains in owned source.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- Profile components/data: local detail helper, neutral identity/avatar, wrapping metadata, semantic status and restricted demo explanation.
- Screenshot scenario: six-tab and document/menu/identity assertions.
- README/task/status: verified behavior and review state.

### Tests
Build (preview:deploy), check and typecheck pass. Dev and Workers: 8/8 direct/refresh interaction cases each, all six tabs captured in every state. Default dashboard smoke 4/4 each. Whole src identity scan now returns no matches (exit 1); final acceptance repeats and archives the full command. Actual light status labels measured 6.47:1/6.55:1; unchanged success/warning pairs already audited across modes/presets in 008/009. Inherited highlighter warning and 10 informational class diagnostics remain; the new test textContent lint warning was fixed. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-011).

### Screenshots

/dashboard/profile (all six tabs captured)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/before/_dashboard_profile-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/workers/_dashboard_profile-light-desktop-interactive-overview.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/before/_dashboard_profile-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/workers/_dashboard_profile-light-mobile-interactive-overview.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/before/_dashboard_profile-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/workers/_dashboard_profile-dark-desktop-interactive-overview.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/before/_dashboard_profile-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-011/workers/_dashboard_profile-dark-mobile-interactive-overview.png) |

### Decisions
The repeated label/value markup justified a small route-local ProfileField helper before wrapping and density changes. Record/document/time-off relationships stay intact. The demo avatar uses initials without a new image dependency. Compensation copy clarifies the existing demonstration; no authorization logic changes. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-011`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
