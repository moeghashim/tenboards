# 001 — Public blocks and kit page

Status: planned. Branch: `feat/v0.9/001-blocks-kit`.

## Scope

- Create `src/components/blocks/` with stable typed exports: `PageHeader`, `SectionHeader`, `DashboardCard`, `StatCard`, chart wrappers (`DashboardChart`, tooltip, legend, axis/grid helpers re-exported or moved from `src/lib/charts/theme.tsx`), and a `DataTable` built on the existing `@tanstack/react-table` usage (sorting, pagination, empty state, mobile reflow pattern already in use).
- One barrel `src/components/blocks/index.ts`; each block has a TSDoc summary and prop docs.
- Migrate all existing imports to the blocks path; remove the old route-local copies (no re-export shims left behind except where needed for one release, documented).
- Add `/dashboard/kit` (sidebar group “Developer”, also in the palette and route catalog): every block with live demo data, variants, and a copyable source snippet. Static snippets, no new dependency for highlighting beyond existing `shiki`/code-block.
- DESIGN.md: replace “Dashboard presentation foundation” paths with the blocks API.

## Acceptance criteria

- [ ] Blocks exported from `@/components/blocks` with typed props and TSDoc; no route-local duplicates remain.
- [ ] Every existing dashboard/app page renders identically before/after (screenshot diff evidence for all dashboards, light/dark × desktop/mobile).
- [ ] `/dashboard/kit` shows every block, keyboard accessible, AA contrast, no console/hydration errors; listed in sidebar, palette and route catalog.
- [ ] Protected `src/components/ui/` and `src/components/calendar/` unchanged.
- [ ] Build, check, typecheck, dev smoke, screenshots; README (screens, project layout), DESIGN.md, CHANGELOG draft, milestone status updated; preview version + alias in PR.
