---
id: "004"
title: Workspace Home and Projects index
milestone: v0.8-projects
status: todo
category: ui
files: ["src/routes/(main)/dashboard/home/", "src/routes/(main)/dashboard/projects/", "src/server/data/", "src/navigation/route-catalog.ts", "scripts/", "README.md", "dev/milestones.json"]
---

## Goal and scope

Deliver /dashboard/home and /dashboard/projects as usable cross-project entry points after project destinations exist. Home serves sample-workspace scanning; the current default dashboard and root/login destinations stay unchanged.

Follow the [milestone contract](README.md), PLAN Decisions and AGENTS. All acceptance below is pending implementation.

## Files and ownership

- `src/routes/(main)/dashboard/home/`
- `src/routes/(main)/dashboard/projects/`
- `src/server/data/`
- `src/navigation/route-catalog.ts`
- `scripts/`
- `README.md`
- `dev/milestones.json`

Changes stay within the named task. Shared route metadata is generated only by the existing tool; protected UI/calendar wrappers and PLAN stay intact. README/status changes belong to the same PR.

## Before implementation

Inspect DashboardCard/StatCard/SectionHeader/PageHeader, project aggregate DTOs and existing data/date boundaries. Extract only shared metric/date formatting already needed across Home and Overview; do not reshape all dashboard cards or Productivity's independent domain.

Run Impeccable context once from the task worktree, inspect incumbent renders and local components, and read reference/craft-floor.md immediately before UI edits. Use Operate mode and the merged v0.6.2 DESIGN scale. Read current official TanStack documentation before route/framework changes.

## Acceptance criteria

- [ ] Home and index inherit requireAppRoute; each new aggregate/index server function independently guards with requireSession and returns bounded DTOs without sensitive identity/configuration.
- [ ] Home contains greeting, KPI row, My tasks, upcoming deadlines, project progress and recent sample activity; values derive from canonical scoped reads and match the README metric definitions.
- [ ] My tasks visibly refers to the named sample member in demo and auth mode, never claims real auth-user ownership. Historical sample reporting date is labeled separately from serialized request-time greeting/current-day markers.
- [ ] Projects index supports working search/status filtering, stable ordering, status/progress/due/member summaries and Overview links. Default, secondary, empty and missing project paths behave distinctly.
- [ ] All task/activity/progress links reach the owning completed project view; display limits have honest totals and a route to the full dataset. No fake creation/invite/favorite actions.
- [ ] Desktop hierarchy and mobile stacking preserve complete labels and reachable data. Cover zero/one/many projects, no matching search, no upcoming tasks, long titles, missing dates/members and load failures without inventing data.
- [ ] Add concrete capture/catalog entries and generate route metadata. Keep /, /dashboard, /dashboard/ and auth fallback unchanged; 005 switches sidebar/brand-home only after both destinations work.
- [ ] Capture and inspect four-state new screens and unchanged Default/Chat; verify keyboard/filter/focus, AA supported pairs, reduced motion and real-clock delayed hydration. Use compact merged tokens with no per-screen density fork.
- [ ] README clearly distinguishes workspace Home from the retained Default dashboard and documents the sample-person/read-only limitations; update only verified status.

## Tests

Run common test floor, aggregate/project parity, direct RPC guard negatives and npm run screenshots for Home/index/default/Chat in four states. Test KPI/Overview/Board/List consistency, cross-project links, search empty recovery and delayed SSR/refresh under different timezones. Use an isolated demo version preview.

Every task passes `npm run build`, `npm run check`, `npm run typecheck` and dev `/dashboard/default` smoke without console errors. Attach a demo-only immutable preview and alias; use only `npm run preview:deploy -- --preview-alias pr-NNN`. Evidence stays on pr-assets/PR attachments. Report inherited warnings separately.

## Dependencies and handoff

Depends on 003, blocks 005. Hand off working workspace and project destinations to the navigation integration task. No default-route/auth destination rewrite is authorized.

One approved task per branch/PR; declare any stack and layer compare URL. Conventional commit with DCO sign-off and final `Co-Authored-By: GPT-6-Astra <noreply@openai.com>` trailer. Claude reviews and alone merges.
