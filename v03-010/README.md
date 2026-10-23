Task: 010 — Restyle Users and Roles
Linked: dev/milestones/v0.3-app-pages/010-users-roles-pages.md
Preview: https://2ab2c7df-tenboards.mohanadgh.workers.dev · https://v03-010-tenboards.mohanadgh.workers.dev

Stack: 008 (#34) → 009 (#35) → 010 → 011–014. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/feat/v0.3/009-products...feat/v0.3/010-users-roles

Users and Roles now share semantic status treatments, readable directory data and responsive table controls. Fixes the page-local workspace filter value shape for TanStack Table v9.

README: updated (Users and Roles (v0.3 / 010)).

### Acceptance criteria
- [x] Users filters/search/selection/pagination and Roles search/type/owner/status filters retain exact result behavior; empty and selected states remain clear.
- [x] Roles, Permission Sets and Access Reviews tabs preserve their implemented/placeholder distinction; no new permission or auth behavior.
- [x] All rows and actions remain accessible on mobile; keyboard menus, tabs and filter labels work, and all owned identity fixtures pass the audit.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- Users/roles usages and fixture presentation metadata: heading, density, responsive controls and semantic states.
- Users filter adapter: scalar select value → v9 candidate array.
- scripts/screenshot-directories.ts and dispatcher: filter, menu, pagination and tab evidence.
- README/task/status: verified behavior and review state.

### Tests
Build (preview:deploy), check and typecheck pass. Dev/Workers: 8/8 base captures each, 4/4 Roles interactions each (after-fixed/workers-fixed), 4/4 Users interactions each (users-final/workers-users-final); default smoke 4/4 each. Actual status contrast recorded in surface-contrast.json; shared 280-pair four-preset contrast from 008 remains unchanged. Owned source identity scan: no matches. Exact failed workspace-filter, select-transition and incorrect-pagination-role test diagnostics retained; final scenarios pass. Inherited highlighter warning and 10 informational class-order diagnostics remain nonfailures. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-010).

### Screenshots

/dashboard/users

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_users-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_users-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_users-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_users-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_users-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_users-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_users-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_users-dark-mobile.png) |

/dashboard/roles

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_roles-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_roles-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_roles-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_roles-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_roles-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_roles-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/before/_dashboard_roles-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-010/workers-final/_dashboard_roles-dark-mobile.png) |

### Decisions
Prefactor inspection kept existing domain tables separate. Table v9 arrIncludes iterates candidate values, so a scalar workspace string incorrectly compared individual characters; the local adapter preserves intended exact workspace membership. No shared registry changes. Pagination uses the local Base UI button role even when rendered as anchors; tests match that role. Empty/selected, all tab variants and action-menu captures supplement base views. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-010`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
