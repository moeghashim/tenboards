# v0.9 / 004 evaluation evidence — PR #80

Implementation base: 7832550. Two independent fresh scratch clones contained the
new root guide, both skills and relative Claude mirrors. Neither agent received
an intended implementation. Main implementation contains no generated Sales/Vendors code.

## Prompts and discovery

- Codex exec, GPT-6-Astra/high: “Add a Sales dashboard with revenue KPIs and a top-products table.”
- Claude Code -p, Opus 5.5/high: “Add a Vendors page listing vendors.”

Both prompts also asked the agent to identify discovered tenboards skills, use the
relevant skill, remain in its scratch clone, avoid commit/push/deploy/skill edits,
and verify using a dedicated port (Sales 3404, Vendors 3405). Transcript summaries
preserve assistant messages, commands and skill invocations; they omit private
reasoning, unrelated global integration inventories and image payloads. Claude's
init skills inventory includes both names and its Skill call loads tenboards-build-ui.
Codex identifies both names and reads both SKILL.md files in its command transcript.

## Results

| Eval | Design | Page verification | Runtime |
| --- | --- | --- | --- |
| Sales | PASS, 260 files / 71 inherited exceptions | 4/4, zero axe violations/runtime errors | Local dev after copying dependencies into scratch |
| Vendors | PASS, 259 files / 71 inherited exceptions | 4/4, zero axe violations/runtime errors | Built local Worker preview |

Sales: three revenue/order KPIs, daily chart with accessible data disclosure,
reconciled $42,850 total and five ranked product rows. Vendor listing: seven sample
vendors, status text, annual spend, five-row pagination and responsive table.
Both preserve guarded server loaders and clearly illustrative DB TODOs.
No manual implementation fixes were applied by the parent. Agents made their own
corrections inside each evaluation; these were recorded in the skill's Gotchas.

Sales additionally checks keyboard sorting, visible focus, chart disclosure,
no horizontal overflow, empty data and reduced motion at desktop/mobile. All four
final page captures for each eval were inspected by the parent. Vendors' desktop
axe incomplete item concerns inherited Projects navigation; no violation is suppressed.
Sales dev captures retain the existing devtools launcher. Supplemental scrolled
keyboard captures include the sticky header at its scroll position.

## Failed attempts and corrections

Both scratch clones initially symlinked node_modules. Nitro's dev runner generated
an invalid doubled module path and all routes returned 503 (Runner is unavailable).
Sales copied dependencies locally; Vendors used its built preview. The initial
Sales report is retained in sales-first-attempt; both transcript summaries record
the startup failure and recovery. These are setup failures, not passing page audits.
Sales corrected an unsupported formatCurrency argument, a v8-style numeric sort
name and callback currency binding, and removed a temporary TSX probe that tsc
included despite gitignore. No auth behavior was changed. All lessons appear in Gotchas.

The evaluation snapshot predated the final validator type correction and reported
38 lint warnings: 35 inherited plus three validator warnings fixed on the PR.
Final implementation check reports the baseline 35 warnings / 10 infos, zero errors.
Build warnings are inherited dependency directives/chunk sizing. No new dependency.

## Implementation gates

build.log, check.log, typecheck.log and check-skills-test.log record passing gates.
The validator covers a valid inventory and 16 rejection cases.
smoke/report.json records root → Default and Home in four states each, 8/8 with no
console/hydration errors. No app UI changed, so before/after screenshots are exempt.
Eval diffs and all page-verification reports/screenshots are evidence only on pr-assets.
preview.log records an ASSETS-only, zero-secret upload to tenboards-preview.
