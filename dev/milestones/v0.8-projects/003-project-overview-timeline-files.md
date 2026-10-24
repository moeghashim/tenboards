---
id: "003"
title: Project Overview, Timeline and Files
milestone: v0.8-projects
status: todo
category: ui
files: ["src/routes/(main)/dashboard/projects/", "src/routes/(main)/dashboard/calendar/", "src/routes/(main)/dashboard/file-manager/", "src/server/data/calendar.types.ts", "src/navigation/route-catalog.ts", "scripts/", "README.md", "dev/milestones.json"]
---

## Goal and scope

Complete all five project views, including an original read-only Gantt view and its accessible table. Re-scope Calendar and File Manager using their existing components; do not rewrite protected wrappers or add a charting dependency.

Follow the [milestone contract](README.md), PLAN Decisions and AGENTS. All acceptance below is pending implementation.

## Files and ownership

- `src/routes/(main)/dashboard/projects/`
- `src/routes/(main)/dashboard/calendar/`
- `src/routes/(main)/dashboard/file-manager/`
- `src/server/data/calendar.types.ts`
- `src/navigation/route-catalog.ts`
- `scripts/`
- `README.md`
- `dev/milestones.json`

Changes stay within the named task. Shared route metadata is generated only by the existing tool; protected UI/calendar wrappers and PLAN stay intact. README/status changes belong to the same PR.

## Before implementation

Inspect the Calendar request-reference/UTC hydration seam, empty calendar-definition assumption, protected EventCalendarViews props, file grid/list/folder/actions and the project shell. Extract a pure span-to-day-position helper and read-only usage adapters only where needed. Keep all new Gantt presentation local to the project route.

Run Impeccable context once from the task worktree, inspect incumbent renders and local components, and read reference/craft-floor.md immediately before UI edits. Use Operate mode and the merged v0.6.2 DESIGN scale. Read current official TanStack documentation before route/framework changes.

## Acceptance criteria

- [ ] Add guarded /overview, /timeline and /files routes plus project-index redirect to validated Overview; complete five route links and concrete route catalog entries. Unknown/empty IDs follow the common contract.
- [ ] Overview uses real scoped aggregate reads for status, member metadata, progress, upcoming work and sample activity; it agrees with Board/List and exposes no mutation controls.
- [ ] Timeline provides validated gantt/table/calendar modes, bounded Weeks/Months ranges and named range controls. CSS/date utilities draw labeled read-only bars with exact dates, unscheduled items and clipping/continuation; no dependency editing, drag/resize or new runtime dependency.
- [ ] Accessible table uses exactly the same filtered schedule rows/order with names, status, assignee, start/end/due and duration. Mobile defaults to the table after safe hydration, with explicit chart opt-in and labeled local horizontal scroll; no hover-only information or duplicate announcements.
- [ ] Reuse Calendar composition and projectEvents for the project event subset; remove Add event at usage sites, handle empty definitions, retain month/week/day access and UTC-to-local request-clock hydration. Convert inclusive task ends to exclusive all-day calendar ends explicitly.
- [ ] Test civil-day spans across DST/leap/month/year edges, missing/endless/same-day/reversed dates, calendar event versus task identity, timezone changes and long names; invalid spans fail validation rather than rendering misleading bars.
- [ ] Reuse file grid/list/folder display and validated view switch with project data. Original shared/starred flags are read-only sample attributes; no fake download/upload/share/delete service, and folder summary limitations remain honest.
- [ ] Screens, detail/empty/loading/error states and keyboard controls meet the merged compact scale and token/focus/motion contract. No protected component edit or unrelated page change.
- [ ] README describes working project views and read-only calendar/file boundaries; old standalone URLs remain working until 005, and final navigation is still pending.

## Tests

Run common test floor, relevant project/calendar/file parity and npm run screenshots for all project views plus old Calendar/File Manager in four states. Inspect Gantt/table/calendar equivalence, keyboard range/navigation, mobile and zoomed overflow, reduced motion and delayed direct/refresh hydration in UTC/Chicago/Kiritimati on dev/isolated preview. Calendar date tests must not freeze live-clock acceptance.

Every task passes `npm run build`, `npm run check`, `npm run typecheck` and dev `/dashboard/default` smoke without console errors. Attach a demo-only immutable preview and alias; use only `npm run preview:deploy -- --preview-alias pr-NNN`. Evidence stays on pr-assets/PR attachments. Report inherited warnings separately.

## Dependencies and handoff

Depends on 002, blocks 004. Hand off five complete view URLs, Calendar mode search contract and tested default/empty project behavior. Old URLs cannot redirect yet; 005 owns the switch.

One approved task per branch/PR; declare any stack and layer compare URL. Conventional commit with DCO sign-off and final `Co-Authored-By: GPT-6-Astra <noreply@openai.com>` trailer. Claude reviews and alone merges.
