---
id: "005"
title: Nested Projects navigation and legacy redirects
milestone: v0.8-projects
status: todo
category: ui
files: ["src/navigation/", "src/components/navigation/command-palette.tsx", "src/routes/(main)/dashboard/-components/sidebar/", "src/routes/(main)/dashboard/-components/header/", "src/routes/(main)/dashboard/route.tsx", "src/routes/(main)/dashboard/projects/", "src/routes/(main)/dashboard/kanban/", "src/routes/(main)/dashboard/tasks/", "src/routes/(main)/dashboard/calendar/", "src/routes/(main)/dashboard/file-manager/", "scripts/", "README.md", "dev/milestones.json"]
---

## Goal and scope

Integrate complete destinations into sidebar, palette and header, then consolidate old app URLs. Follow the README disclosure/persistence and redirect contracts exactly; preserve v0.7 Assistant next to Chat whenever present.

Follow the [milestone contract](README.md), PLAN Decisions and AGENTS. All acceptance below is pending implementation.

## Files and ownership

- `src/navigation/`
- `src/components/navigation/command-palette.tsx`
- `src/routes/(main)/dashboard/-components/sidebar/`
- `src/routes/(main)/dashboard/-components/header/`
- `src/routes/(main)/dashboard/route.tsx`
- `src/routes/(main)/dashboard/projects/`
- `src/routes/(main)/dashboard/kanban/`
- `src/routes/(main)/dashboard/tasks/`
- `src/routes/(main)/dashboard/calendar/`
- `src/routes/(main)/dashboard/file-manager/`
- `scripts/`
- `README.md`
- `dev/milestones.json`

Changes stay within the named task. Shared route metadata is generated only by the existing tool; protected UI/calendar wrappers and PLAN stay intact. README/status changes belong to the same PR.

## Before implementation

Reinspect latest sidebar metadata/primaryIds, nav-section pathname key, AppPath, header catalog lookup, palette static groups and support-card flattening. Introduce a typed destination builder/active matcher shared by these consumers and a controlled expansion seam only as needed. Read local Collapsible/Popover/Sidebar wrappers; do not edit protected components.

Run Impeccable context once from the task worktree, inspect incumbent renders and local components, and read reference/craft-floor.md immediately before UI edits. Use Operate mode and the merged v0.6.2 DESIGN scale. Read current official TanStack documentation before route/framework changes.

## Acceptance criteria

- [ ] Primary Home points to /dashboard/home, Projects to /dashboard/projects, and brand-home follows Home. Retain Default under Dashboards and leave root/dashboard-index/auth fallback destinations unchanged. Keep Email/Chat and preserve Assistant directly after Chat.
- [ ] Projects section loads guarded summaries and expands each named project to Overview/Board/List/Timeline/Files with exact active child and parent indication. No unresolved parameter navigation, prefix collisions or copied reference assets/data.
- [ ] Disclosure buttons/nested lists expose correct expanded/controls state; Enter/Space/Tab and visible focus work, collapsed content leaves tab order and focus is recovered on collapse. Use the same indented pattern for suitable existing parent groups without unrelated redesign.
- [ ] Named collapsed-rail triggers open usable Popover links, active state and project name; tooltip is supplemental. Escape/outside/route-change dismissal and focus return work. Preserve off-canvas/mobile/header-toggle behavior across layout preferences.
- [ ] Mobile sheet supports disclosure without dismissing, closes on link resolution, scrolls long lists and restores focus. No hover-only or too-small targets; verify merged v0.6.2 density floors.
- [ ] Versioned bounded expansion storage hydrates safely, prunes invalid IDs, handles corrupt/disabled storage, follows route-entry policy and respects manual collapse. Existing sidebar cookies/preferences stay unchanged; stars/status dots remain read-only with text alternatives.
- [ ] Palette/header use project-qualified labels and typed params from guarded summaries, preserve Cmd/Ctrl+K behavior and include a Projects group. Exploration counts use concrete destinations; aliases are absent from search. No protected project fetch occurs on public root/auth surfaces.
- [ ] All four legacy paths use the README permanent redirect table, including Kanban list/table compatibility and Calendar mode, validated File view, hash and trailing slash cases. Auth login-return/revocation and direct RPC guards remain intact; unknown projects never fall back to default.
- [ ] Remove old primary/Pages entries only with their working redirects. Move reused presentation under the project owner and leave thin old route aliases; no wholesale rewrite or destructive database cleanup. Generate routeTree and reconcile concrete capture inventory/redirect coverage.
- [ ] README documents canonical paths, aliases, dynamic capture IDs, navigation state and read-only boundaries. Resolve shared-file merges as a union of v0.7/v0.8 changes; retain compact density and completed legacy-removal behavior.

## Tests

Run common test floor, dedicated HTTP/client redirect checks in demo/auth modes, direct RPC denial/session expiry and nested-nav storage/keyboard/focus tests. npm run screenshots covers Home/index/all views plus default/Chat/Assistant when present, before/after light/dark desktop/mobile; add --sidebar-states and all supported sidebar styles/collapse modes. Inspect palette project search, empty/error summaries, deep links, cross-project switching, no raw $projectId paths and unchanged root destinations on dev and immutable demo preview.

Every task passes `npm run build`, `npm run check`, `npm run typecheck` and dev `/dashboard/default` smoke without console errors. Attach a demo-only immutable preview and alias; use only `npm run preview:deploy -- --preview-alias pr-NNN`. Evidence stays on pr-assets/PR attachments. Report inherited warnings separately.

## Dependencies and handoff

Depends on 004 and all earlier v0.8 tasks. Rebase onto latest merged v0.6.2 and any v0.7 changes; reviewer resolves shared files at merge. Blocks 006. Do not make Assistant a prerequisite or delete it if it arrives concurrently.

One approved task per branch/PR; declare any stack and layer compare URL. Conventional commit with DCO sign-off and final `Co-Authored-By: GPT-6-Astra <noreply@openai.com>` trailer. Claude reviews and alone merges.
