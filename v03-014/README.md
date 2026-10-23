Task: 014 — Verify complete v0.3 app and route acceptance
Linked: dev/milestones/v0.3-app-pages/014-app-pages-acceptance.md
Preview: https://a0e873cb-tenboards.mohanadgh.workers.dev · https://v03-014-tenboards.mohanadgh.workers.dev

Stack: 008 (#34) → 009 (#35) → 010 (#36) → 011 (#37) → 012 (#38) → 013 (#39) → 014. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/feat/v0.3/013-system...feat/v0.3/014-acceptance

Complete v0.3 acceptance and documentation: 38 routes × four presets × light/dark × desktop/mobile on dev and Workers. Page source is identical to task 013; this layer adds QA coverage/reporting and reconciles release/readme/hydration/review status.

README: updated (screens, v0.3 status pending merge, hydration resolutions, acceptance commands, and Complete app-page acceptance).

### Acceptance criteria
- [x] All 38 current catalog entries pass on dev and Workers across four presets × light/dark × desktop/mobile, with coverage manifest, exact counts and no unexplained skips or unexpected console/page errors. All 14 dashboards remain covered.
- [x] Calendar, Invoice, Auth V2 login and Auth V2 register each have no React #418 hydration error in dev or Workers preview, light/dark × desktop/mobile; root-cause fixes verified with real clocks, refresh/delay/timezone evidence. No suppressHydrationWarning, no SSR disabling, no frozen clocks are used as fixes.
- [x] Whole-tree command `rg -n -i "arham|arhamkhnz" src` produces no matches (expected exit 1, not a scan failure); retain command/output evidence. This intentionally catches Arham Khan, arhamKhan, taskOwners.arham, emails and bio references. LICENSE, README and docs attribution stay intact.
- [x] Root not-found and controlled root-error/recovery pass supplemental dev/Workers cases with expected injected diagnostics isolated. Exercise Mail/Chat iframe contents; File Manager grid/list, Kanban board/list/table, Profile six tabs, Roles tabs, four auth forms, Invoice print and existing form/table/overlay states.
- [x] Document keyboard/name/focus/heading, mobile overflow, form errors, table scrolling, iframe/drawer/sheet focus and reduced-motion spot checks. Run supported-token contrast checks for all presets/themes and measure changed status/event/chart/selection pairs on actual surfaces; report scope honestly, not a complete accessibility certification.
- [x] CHANGELOG v0.3 entry, README screens/status/hydration information, milestone README/task boxes and milestones.json reflect evidence and actual review state. Every hydration open-question entry is reconciled as resolved; any independent blocker remains explicit.
- [ ] Claude reviews each task and owns squash-merge, stack rebases, production redeploy and milestone release. Record in-review until authorized merges occur; do not mark this milestone done prematurely.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- QA: shell scenarios, explicit route-coverage/retry manifest, stable dialog captures and Invoice date-popover sequencing.
- README/CHANGELOG: completed app-page behavior and released-on-merge v0.3 notes.
- Task/milestone status and open questions: historical hydration reconciliation and truthful in-review state.
- No app source, runtime dependency, package version, generated route or protected UI edits.

### Tests
Build, check and typecheck pass. Coverage manifest verifies 608/608 dev + 608/608 Workers cases, all 38 routes including all 14 dashboards; original network timeout failures and exact route/preset reruns remain recorded. Supplemental gates include 24 Mail/Chat/Kanban/Tasks, 36 File Manager/Products/Users/Roles/Profile/Auth, 24 delayed real-clock Calendar/Invoice/Patient Monitoring, 16 shell and 12 default/root-boundary cases per environment. Expected QA exception/404 diagnostics are isolated. Invoice Workers date-picker sequencing was synchronized after one initial test race; all eight retry cases pass. Shell focus checks use viewport captures after full-page capture disturbed focus; all 32 final shell cases pass. Whole-src identity scan exits 1 with no matches. Both environments pass 280 supported-token comparisons. Actual status/event/selection/paper/chart evidence is indexed in accessibility.md. Print PDFs render as one Letter page with matching $945.18 total and neutral issuer. Inherited warning: highlighter array-index key; ten informational class diagnostics. Initial coverage-helper TS2345 was fixed with an explicitly typed string inventory; exact initial output is retained in typecheck.log. No hydration #418 remains in the final matrix. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-014).

Evidence: [coverage manifest](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/coverage-manifest.json) (1,213 initial passes plus three documented passing reruns; 1,216 effective cases), [224 supplemental cases](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/supplemental-manifest.json), [accessibility](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/accessibility.md), [visual/print review](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/visual-review.md), [exact failures and resolutions](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/FAILURES.md).

### Screenshots

/chat — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_chat-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_chat-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_chat-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_chat-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_chat-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_chat-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_chat-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_chat-dark-mobile.png) |

/dashboard — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard-dark-mobile.png) |

/mail — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_mail-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_mail-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_mail-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_mail-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_mail-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_mail-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_mail-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_mail-dark-mobile.png) |

/unauthorized — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_unauthorized-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_unauthorized-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_unauthorized-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_unauthorized-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_unauthorized-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_unauthorized-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_unauthorized-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_unauthorized-dark-mobile.png) |

/ — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_-dark-mobile.png) |

/auth/v2 — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2-dark-mobile.png) |

/dashboard/academy — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_academy-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_academy-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_academy-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_academy-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_academy-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_academy-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_academy-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_academy-dark-mobile.png) |

/dashboard/analytics — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-dark-mobile.png) |

/dashboard/calendar — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_calendar-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_calendar-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_calendar-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_calendar-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_calendar-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_calendar-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_calendar-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_calendar-dark-mobile.png) |

/dashboard/chat — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_chat-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_chat-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_chat-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_chat-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_chat-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_chat-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_chat-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_chat-dark-mobile.png) |

/dashboard/coming-soon — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_coming-soon-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_coming-soon-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_coming-soon-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_coming-soon-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_coming-soon-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_coming-soon-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_coming-soon-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_coming-soon-dark-mobile.png) |

/dashboard/crm — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-dark-mobile.png) |

/dashboard/default — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-dark-mobile.png) |

/dashboard/ecommerce — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_ecommerce-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_ecommerce-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_ecommerce-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_ecommerce-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_ecommerce-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_ecommerce-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_ecommerce-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_ecommerce-dark-mobile.png) |

/dashboard/file-manager — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_file-manager-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_file-manager-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_file-manager-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_file-manager-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_file-manager-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_file-manager-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_file-manager-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_file-manager-dark-mobile.png) |

/dashboard/finance — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-dark-mobile.png) |

/dashboard/infrastructure — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_infrastructure-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_infrastructure-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_infrastructure-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_infrastructure-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_infrastructure-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_infrastructure-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_infrastructure-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_infrastructure-dark-mobile.png) |

/dashboard/invoice — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_invoice-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_invoice-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_invoice-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_invoice-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_invoice-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_invoice-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_invoice-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_invoice-dark-mobile.png) |

/dashboard/kanban — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_kanban-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_kanban-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_kanban-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_kanban-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_kanban-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_kanban-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_kanban-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_kanban-dark-mobile.png) |

/dashboard/logistics — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_logistics-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_logistics-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_logistics-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_logistics-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_logistics-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_logistics-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_logistics-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_logistics-dark-mobile.png) |

/dashboard/mail — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_mail-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_mail-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_mail-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_mail-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_mail-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_mail-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_mail-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_mail-dark-mobile.png) |

/dashboard/patient-monitoring — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_patient-monitoring-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_patient-monitoring-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_patient-monitoring-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_patient-monitoring-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_patient-monitoring-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_patient-monitoring-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_patient-monitoring-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_patient-monitoring-dark-mobile.png) |

/dashboard/productivity — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_productivity-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_productivity-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_productivity-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_productivity-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_productivity-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_productivity-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_productivity-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_productivity-dark-mobile.png) |

/dashboard/products — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_products-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_products-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_products-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_products-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_products-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_products-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_products-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_products-dark-mobile.png) |

/dashboard/profile — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_profile-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_profile-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_profile-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_profile-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_profile-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_profile-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_profile-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_profile-dark-mobile.png) |

/dashboard/roles — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_roles-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_roles-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_roles-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_roles-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_roles-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_roles-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_roles-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_roles-dark-mobile.png) |

/dashboard/tasks — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_tasks-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/retry-workers-default-tasks/_dashboard_tasks-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_tasks-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/retry-workers-default-tasks/_dashboard_tasks-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_tasks-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/retry-workers-default-tasks/_dashboard_tasks-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_tasks-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/retry-workers-default-tasks/_dashboard_tasks-dark-mobile.png) |

/dashboard/users — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_users-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_users-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_users-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_users-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_users-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_users-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_users-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_users-dark-mobile.png) |

/dashboard/$ — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard__-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard__-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard__-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard__-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard__-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard__-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard__-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard__-dark-mobile.png) |

/dashboard/ — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_-dark-mobile.png) |

/auth/v1/login — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_login-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_login-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_login-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_login-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_login-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_login-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_login-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_login-dark-mobile.png) |

/auth/v1/register — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_register-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_register-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_register-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_register-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_register-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_register-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v1_register-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v1_register-dark-mobile.png) |

/auth/v2/login — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_login-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_login-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_login-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_login-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_login-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_login-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_login-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_login-dark-mobile.png) |

/auth/v2/register — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_register-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_register-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_register-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_register-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_register-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_register-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_auth_v2_register-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_auth_v2_register-dark-mobile.png) |

/dashboard/analytics-v1 — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-v1-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-v1-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-v1-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-v1-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-v1-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-v1-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_analytics-v1-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_analytics-v1-dark-mobile.png) |

/dashboard/crm-v1 — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-v1-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-v1-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-v1-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-v1-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-v1-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-v1-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_crm-v1-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_crm-v1-dark-mobile.png) |

/dashboard/default-v1 — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-v1-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-v1-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-v1-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-v1-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-v1-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-v1-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_default-v1-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_default-v1-dark-mobile.png) |

/dashboard/finance-v1 — integrated baseline (app source unchanged)

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-v1-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-v1-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-v1-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-v1-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-v1-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-v1-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/dev/default/_dashboard_finance-v1-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-014/workers/default/_dashboard_finance-v1-dark-mobile.png) |

### Decisions
Coverage inspection justified a small report verifier for 38-route completeness and explicit retry accounting, plus a route-local QA shell scenario using existing controls. No implementation prefactor/UI edit was warranted. Integrated before/after comparison uses unchanged app source from task 013; source-baseline.txt and source-final.txt match, so this PR makes no visual-change claim. The 38-route Default four-state table and all-presets manifest below are the integrated baseline. Prior page PRs contain their actual before/after differences. All historical hydration entries are resolved; there is no open scope/access blocker. Claude still owns review/merge/rebase, production redeploy and release; version remains 0.2.0. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-014`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
