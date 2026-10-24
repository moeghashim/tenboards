# Assessment A — independent design review

Target: `/Users/moeghashim/tenboards-v08/src/routes/(main)/dashboard/projects`.
Mode: Operate; compact v0.6.2 dashboard. Assessment A completed independently without detector output or contact with Assessment B. The parent brief substituted for an intake interview. This report evaluates the five read-only project views, not future task005 navigation consolidation or already-approved data/guard/parity work.

## Design specificity verdict

The result is appropriately authored for a compact project workspace. The shared project header, named task keys, consistent status and priority vocabulary, member identities, real schedule spans, and grid/list alternatives make these views feel like one working system. Its visual language is deliberately conventional: neutral surfaces, thin dividers, small controls, and restrained blue emphasis. That is a good fit for the approved Linear/Vercel Operate brief, not a reason to add decorative novelty. The strongest product character comes from the relationships between views rather than ornament.

The five views now form a coherent, credible template. The main opportunity is preserving context while inspecting data on a phone. Desktop composition is strong; mobile retains the information but asks the user to scroll and remember more than necessary.

## Nielsen heuristic scores

| # | Heuristic | Score / 4 | Evidence |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Active project/view, task counts, progress and live result counts are explicit. File-search feedback is far below the input on mobile. |
| 2 | Match with the real world | 3 | Familiar task, owner, priority and schedule concepts; relative dates make upcoming work natural to read. “Exact label” requires knowledge of the project taxonomy. |
| 3 | User control and freedom | 3 | Reset filters recovers the tested empty List state; project/view navigation remains available; task modal closes with Escape and returns focus to its Details trigger. |
| 4 | Consistency and standards | 4 | Header, tabs, semantic colors, control wrappers and identity treatment remain consistent across all five views and both themes. |
| 5 | Error prevention | 3 | Read-only scope removes destructive risks; constrained status/priority/owner options avoid invalid selections. Free-text exact-label filtering still invites needless no-result searches. |
| 6 | Recognition rather than recall | 2 | Task keys and names help recognition, but mobile horizontal scrolling removes task identity and exact labels have no visible choices. |
| 7 | Flexibility and efficiency | 3 | Five complementary views, live search, filtering, sorting, page sizing and URL-backed task filters support inspection. Far-right Details actions slow phone use. Bulk editing is outside this read-only scope and is not a defect. |
| 8 | Aesthetic and minimalist design | 3 | Strong hierarchy, restrained color, useful density and tidy file icons. Unchanged folders dominate the viewport during an active file search. |
| 9 | Error recovery | 3 | Tested no-match List state names the problem and offers reset/project recovery. Source includes plain-language project loading/error/not-found boundaries; network failure was not forced. |
| 10 | Help and documentation | 2 | Visible labels, semantic control names, descriptive page copy and shell help affordances cover basics. The exact-label filter gives no contextual vocabulary assistance. |
| | **Total** | **29 / 40 — Good** | No P0 or P1 design issue established. |

## Concrete strengths

1. **The shared project context is stable and economical.** One clear title/description, a compact project selector, progress summary and five view links establish location without duplicating another heading block. Overview StatCards use a disciplined 2×2 mobile layout and a single comparison row on desktop.
2. **Task identity and semantics survive view changes.** OPS keys, named initials, status dots with text, and priority icons with text provide several recognition cues. Dark mode retains the same hierarchy and semantic differentiation rather than merely inverting backgrounds.
3. **The main inspection interactions are honest and useful.** List search updated after typing without Enter, changed the URL and announced a zero result count; Reset restored the rows. The mobile Details dialog fits its viewport, keeps the title and metadata legible, and Escape returns focus. File icons are restrained and recognizable without competing with filenames.

## Priority issues — only observed problems

### P2 — Mobile tables lose task identity before the details become visible

**Evidence:** Both light/dark mobile List and Timeline screenshots initially show the Task column and only a slice of Status. At a live 390×844 viewport, List measured 1,137 px wide; its first task column was 288 px, with Details beginning at x=1,058. All first-column cells use static positioning. Opening Details required the table to scroll to `scrollLeft=781`, leaving Labels/Subtasks/Comments/Details visible while the task title and key had disappeared. Timeline's mobile table measured 880 px, also with a static first column.

**Impact:** A person checking an owner/date or opening a task must remember which row they were following across a long horizontal swipe. This is manageable, but especially error-prone after an interruption. Local scrolling prevents page overflow; the issue is loss of identity, not missing data.

**Fix:** At project usage sites, keep a compact task key/title anchor visible during horizontal scrolling, or reflow mobile rows into labelled records. Make the task title a Details trigger so opening a task does not require reaching the far-right column. Keep desktop density intact and avoid editing protected table primitives.

**Locations:** `-components/project-tasks.tsx:24` (task title and far-right details columns); `-components/task-rows.tsx:18` (wide table); `-components/project-timeline.tsx:206` (schedule table and static task cell).

**Suggested command:** `$impeccable adapt`.

### P2 — File search leaves its result and empty-state feedback below six unchanged folders

**Evidence:** At 390×844, the Search files input sits at y=439. Searching `roadmap` correctly returns one file, but the result count and All files heading remain at y=1,206 beneath all six folder cards. Searching `zzzz-no-match` leaves those same folders visible and places the no-match recovery message at y=1,244. The screenshots show the same section order in both themes. Source renders `FoldersSection` unconditionally before the filtered files.

**Impact:** A sighted mobile user types a query and sees no nearby change, then must scroll almost another screen to learn whether it matched. This weakens the otherwise useful live search. The result count has `role=status`, so the problem is not absence of a semantic announcement.

**Fix:** While a query or type filter is active, place filtered results immediately under the toolbar and collapse or move the unchanged folder section. At minimum place the live result count near the search field. Preserve normal folder browsing when unfiltered.

**Location:** `$projectId/files.tsx:82–93`.

**Suggested command:** `$impeccable adapt` or `$impeccable distill`.

### P2 — Exact-label filtering requires recall instead of offering the project's vocabulary

**Evidence:** Board and List expose a free-text Label field with `Exact label` placeholder and no options or suggestions (`project-tasks.tsx:128–136`). Yet the rendered tasks use values such as Product, Platform, Finance Ops, Backend and QA. Those labels are scattered across records and, in mobile List, are far offscreen.

**Impact:** The user must already know a label or browse the records to discover it before filtering. This adds avoidable typing and ambiguous no-result searches in an interface that supplies clear choices for the other categorical filters.

**Fix:** Offer known labels through the existing select/combobox pattern, with a clear all-labels state. Preserve the approved exact-match semantics; the improvement is recognition and input assistance, not a new filtering rule. The option source must cover the project rather than only the current page.

**Suggested command:** `$impeccable clarify`.

## Cognitive load

Desktop is low-to-moderate: hierarchy, proximity and familiar controls keep the dense information organized. The overview has four comparable metrics, then a clear primary work list and secondary team column. No forced multistep decision is present.

At narrow sizes, three checklist failures recur: **minimal visible choices** (Board/List expose six filter/sort fields plus Reset), **working memory** (table identity disappears while inspecting later columns), and **progressive disclosure** (all filters and unchanged folder cards remain expanded before results). Grouping, visual hierarchy and one-task-at-a-time inspection remain sound. Under the rubric this is **moderate cognitive load**, not a critical overload.

Decision points above four choices: five project-view links; Board/List's search, status, assignee, priority, label and sort controls; the status selector's all-state plus six statuses; the member selector's all/unassigned plus nine members. These counts are not automatically defects: the project links and categorical menus are familiar, coherent groups. The phone's vertical toolbar cost and hidden row context are the practical friction.

## Emotional journey

Arrival is calm and credible: clear project ownership, an understandable summary and restrained styling. The positive peak is finding a task through immediate filtering or opening the compact Details dialog. The valleys are the phone's long sideways table inspection and file searches whose visible feedback sits below unrelated folders. Reset and Escape give a reassuring end to inspection. There are no high-stakes destructive moments in this read-only scope, so no additional confirmation flow is needed.

## Persona red flags

- **Alex, impatient power user:** No blocking issue. The task modes, live filtering and URL state provide quick inspection paths. Exact-label entry adds recall, and the far-right List Details button is inefficient on a narrow viewport. No forced onboarding or slow animation was observed.
- **Sam, accessibility-dependent user:** Status/priority meanings are not color-only; avatars and selects have accessible names; result counts have status semantics. Escape/focus return were observed. The mobile table issue also affects zoomed sighted users. This was not a screen-reader or full keyboard audit; no contrast failure or keyboard failure is asserted from screenshots. T3 key simulation did not reliably enter browser `:focus-visible`, so focus-ring appearance should be covered by the dedicated evidence assessment rather than treated as an established defect here.
- **Casey, distracted mobile user:** The specific risks are losing task identity during horizontal swipes and seeing unchanged folders after typing a file query. Standard controls are 32 px high, below the persona's ideal 44 px but consistent with the approved compact contract; this alone is not raised as a release issue or a WCAG failure.

## Minor observations

- Filtering Files to one result renders `1 files`; a small pluralization polish item (P3).
- At 390 px the first Board/List record starts around y=655; Timeline starts around y=704. A collapsible secondary filter group could improve initial data visibility later, but this is not a separate blocker and should not turn into an unauthorized shell redesign.
- The floating palm icon in local screenshots is TanStack Devtools, not product decoration; it is excluded from design findings.
- The mobile Timeline correctly selects Table by default. This is a useful adaptation; it is not a mislabeled Gantt state.

## Questions for parent synthesis

- Can a user inspect any task on a phone without having to remember which row survived the horizontal swipe?
- When someone searches files, should anything unrelated to that result remain between the input and the answer?
- Can every categorical filter offer recognition rather than requiring exact vocabulary recall?

## Evidence and limits

Read `DESIGN.md`, `PRODUCT.md`, the global Impeccable skill and its Assessment A rubric, and relevant route/components. Ran Impeccable context once from `/Users/moeghashim/tenboards-v08`. No ignore file existed at `.impeccable/critique/ignore.md`.

Visually inspected all 20 supplied project after-captures: five views × light/dark × desktop/mobile in `screenshots/v08-003-round2/after`. Opened new T3 tab `tab_1e` after `preview_status`; inspected all five live routes at localhost:3277, with 1280×800 and 390×844 viewports. Checked task search/no-result/reset, task Details, Escape/focus return, status menu, file live search/no-result and grid/list route switching. No console errors appeared in the inspected snapshots. Closed only the assessment's new tab afterward. No fallback browser was needed, no detector was run/read, and no server was started. No repository files, branches, commits or PRs were changed. The only written artifact is this requested `/tmp/v08-critique-a.md` report.

Questions skipped: this is a delegated Assessment A report; parent synthesis owns the user-facing close.
