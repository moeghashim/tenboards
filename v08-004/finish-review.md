# Task004 finish review — Home and Projects index

**Verdict: SHIP. No material design fix is required for the reviewed task004 scope.**

The new screens fit the approved compact v0.6.2 Operate system. Home moves from workspace metrics to personal work and upcoming deadlines, then project progress and activity. Projects places the search/status controls and result count ahead of the cards. Both retain clear hierarchy and readable complete labels in light/dark and desktop/mobile captures. Long task titles wrap instead of being clipped. The neutral surfaces and restrained status colors remain consistent with existing project views.

## Verified

- Inspected `home/index.tsx`, `projects/index.tsx`, `project-summary-card.tsx`, and workspace loading/error boundaries.
- Visually inspected all eight final Home/Projects screenshots under `screenshots/v08-004/after`: both themes × desktop/mobile. No clipped labels, overlapping text, or content loss found.
- `My tasks` visibly identifies **Jordan Lee · sample member**, avoiding an implied connection between the demo account and an unexplained personal task list. Task rows also show project names, keys, status text, dates and named avatars.
- At 390 px the Projects page has no page-level horizontal overflow (document scroll width 390 px). Cards wrap descriptive text and keep status, counts, progress, target date and members legible. The Research queue card explicitly says No target date and No members yet.
- The visible new controls are navigation, search, filtering and reset. No Create/Edit/Delete/upload-looking mutation actions or deceptive editable fields are introduced. Project titles are native links; the arrow icon is decorative.
- Live Home Browse projects navigated to the index. The Tender workflow map link navigated to the correct project List with its title query and returned the expected OPS-100 record.
- Live Projects search for a nonmatching string produced `0 of 3 projects`, a clear `No matching projects` heading, plain-language guidance and a `Show all projects` recovery action. On 390×844 this entire recovery state is visible without scrolling. Clicking the recovery action cleared the input and restored `3 of 3 projects`.
- Project status is a named combobox with complete labels: All statuses, Planning, Active, At risk and Complete. Its popup exposed option/selection semantics and could be dismissed with Escape.
- Search has an associated visible label. Result count uses role=status. Project progress bars have project-specific accessible names and numeric values. Status does not rely on color alone. Named member avatars and semantic link/button controls are retained.
- The Research queue link targets its own empty project overview. Source also provides honest no-project, no-task and no-activity states, with retry/status semantics for workspace loading failures.

## Non-blocking observations and limits

Home is naturally longer on mobile because it retains the task and project information; that is acceptable for this read-only overview. The unequal desktop work-list heights reflect five personal tasks versus ten upcoming items and do not impede reading or navigation. No filler, blank stretching, or larger redesign is needed to equalize them.

An inherited destination List count displays `1 tasks` when opened from a Home task link. This is minor existing task003 pluralization, not a task004 ship blocker.

No claim of a full screen-reader or contrast audit is made. This finish review checked visual readability, semantic names, and accessible interaction structure; the system tokens remain unchanged. T3 logged two Electron harness messages after viewport resizing (`sandboxed_renderer.bundle.js script failed to run` and a `binding.startupData`/`preloadScripts` TypeError). The stack is Electron internal, the app interactions continued successfully, and no application-source error was observed. Do not report the captured console as completely clean without that qualification.

The sidebar/header Home target remains Default by the task005 boundary and is intentionally excluded from findings. TanStack Devtools' floating palm icon is development UI, not product design.

## Method and cleanup

Used the established Impeccable Operate context from this session; no second context run or full critique/detector round. First called T3 preview_status, then opened fresh tab `tab_1g`. Live checks used localhost:3277 at desktop 1280×800 and mobile 390×844; final screenshots supplied the complete both-theme comparison. Remote immutable upload was not needed for this bounded design inspection. Closed only `tab_1g` afterward. No repository edits, branch changes, commits, or PR operations; only this requested report was written.
