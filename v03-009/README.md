Task: 009 — Restyle Products and product editors
Linked: dev/milestones/v0.3-app-pages/009-products-page.md
Preview: https://80a87017-tenboards.mohanadgh.workers.dev · https://v03-009-tenboards.mohanadgh.workers.dev

Stack: 008 (#34) → 009 → 010–014; base branch feat/v0.3/008-file-manager. PR targets main. Layer compare: https://github.com/moeghashim/tenboards/compare/feat/v0.3/008-file-manager...feat/v0.3/009-products

The catalog uses semantic inventory/status colors, wrapping names/SKUs and a restrained table. Editors retain validation/local state and return focus to the product.

README: updated (Products (v0.3 / 009)).

### Acceptance criteria
- [x] Search, status/category filters, clear filters, selection and pagination work; exercise add/edit validation and duplication-to-draft with unchanged local semantics.
- [x] Drawer/form opening, Escape, focus trapping/return, errors and image controls are keyboard accessible; mobile form actions and table content are reachable.
- [x] Product labels, stock/status signals and prices use semantic tokens/tabular numerals with measured contrast, and the owned fixture audit is clean.
- [x] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [x] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [x] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [x] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [x] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [x] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

### Files touched
- Product route components: token statuses, wrapping content, table density, form grouping and focus return.
- scripts/screenshot-products.ts: reproducible catalog/editor checks.
- README/task/status: verified behavior and review state.

### Tests
Build (preview:deploy), check and typecheck pass. Dev/Workers: 4/4 interaction states and 8/8 direct/refresh captures each; default smoke 4/4 each. Actual badge contrast minimum 6.12:1 light / 7.26:1 dark (surface-contrast.json); shared token audit from task 008 covers all four presets. Owned identity scan: no matches. Initial Biome format failure fixed; devtools intercepted a pointer pagination click in the initial dev run, resolved by testing native keyboard activation; exact logs preserved. Inherited warning: highlighter array index. Six inherited plus four task-008 class-order infos remain informational. Full [logs and reports](https://github.com/moeghashim/tenboards/tree/pr-assets/v03-009).

### Screenshots

/dashboard/products

| State | Before | After |
| --- | --- | --- |
| light/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/before/_dashboard_products-light-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/workers-refresh/_dashboard_products-light-desktop.png) |
| light/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/before/_dashboard_products-light-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/workers-refresh/_dashboard_products-light-mobile.png) |
| dark/desktop | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/before/_dashboard_products-dark-desktop.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/workers-refresh/_dashboard_products-dark-desktop.png) |
| dark/mobile | [Before](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/before/_dashboard_products-dark-mobile.png) | [After](https://github.com/moeghashim/tenboards/blob/pr-assets/v03-009/workers-refresh/_dashboard_products-dark-mobile.png) |

### Decisions
Prefactor inspection kept the existing local table/form seams. A ref records the edited product for overlay focus return. No CRUD abstraction, record/filter semantics, runtime service or token changes. Add remains validation-only; edit/duplicate remain local. Image, filtered/selected, empty, edit-error and add-error captures accompany the base comparison. No runtime dependencies or protected UI changes. PLAN §7 and the hydration/README Decisions govern. Preview alias follows the user's batch instruction (`v03-009`). Claude Opus 5.5 reviews and has merge authority; implementer never merges.
