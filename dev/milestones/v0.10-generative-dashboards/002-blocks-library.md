# 002 — Blocks as the OpenUI library

Status: approved. Branch: `feat/v0.10/002-blocks-library`. Depends on 001 approval.

## Scope

- Register tenboards public blocks as OpenUI components with Zod prop schemas: `DashboardCard`, `StatCard`, `DashboardChart` (line, bar, area; series labels and accessible data table), `DataTable` (read-only), `PageHeader`/section heading, a dashboard grid layout. Reuse `@/components/blocks`; no look-alike re-implementations.
- Components accept either literal data (as today) or a named data reference that 003 resolves; keep the reference shape from the spike.
- Keep every v0.7 safety property: literal-language gate, Zod validation, render limits (raise only with reviewer approval, documented), no HTML/links/styles/forms/actions.
- Existing Assistant replies keep working; update the library instructions within the 32 KiB cap.

## Acceptance criteria

- [ ] Recorded examples render each new block correctly in light/dark × desktop/mobile; `verify:page -- /dashboard/assistant` passes with zero axe/console/hydration errors.
- [ ] Invalid props, unknown components and over-limit specs are rejected with tests.
- [ ] `check:design` passes with no new exceptions; build, check, typecheck pass.
- [ ] docs/assistant.md, README, CHANGELOG draft, milestone status updated; preview linked in PR.

## Proposed spike clarification — pending reviewer approval

- Keep OpenUI core/react-lang at 1.0.1. Register strict wrappers, not native block prop spreads; build TanStack table instances and chart marks inside adapters. Retain Stack root, adding DashboardGrid and stable-ID Panel children.
- Use the spike's version-1 literal/data-ref discriminated union and server result map. References are inert; never enable native Query/Mutation, bindings or renderer fetching. Extract a validated tree/serializer seam without weakening the current literal gate or work limit.
- Preserve existing limits; additionally cap eight panels and four distinct references. Test duplicate IDs, unknown reference combinations, incompatible result kinds, partial/unreachable statements and immutable old replies. Keep PageHeader heading hierarchy valid within the Assistant page.

Additional acceptance proposed:

- [ ] Versioned ref/result schemas, panel identity and literal compatibility have focused tests; refresh changes data without parser-side network access.
