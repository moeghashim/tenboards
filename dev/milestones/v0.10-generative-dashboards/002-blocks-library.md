# 002 — Blocks as the OpenUI library

Status: proposed. Branch: `feat/v0.10/002-blocks-library`. Depends on 001 approval.

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
