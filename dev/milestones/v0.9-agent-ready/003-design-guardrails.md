# 003 — Design guardrails and verify:page

Status: planned. Branch: `feat/v0.9/003-design-guardrails`. Depends on 001.

## Scope

- `npm run check:design`, chained into `npm run check`: scans `src/routes/**` and `src/components/blocks/**` (not `ui/`, `calendar/`, generated files) and fails on raw color literals (hex/rgb/hsl/oklch), arbitrary Tailwind values for color, size, spacing and typography (`[13px]`, `[#…]`, `[oklch(…)]`), `recharts` imports outside `src/lib/charts`, and hand-rolled card/page-header markup where a block exists (heuristic rules documented). Prefer Biome rules/GritQL plugins where Biome can express a rule; a small script for the rest. Every existing violation is fixed through tokens or blocks, or added to a commented allowlist with a reason.
- Messages tell the agent the fix (“use `text-muted-foreground` / `StatCard` / `@/lib/charts`”).
- `npm run verify:page <route> [--base-url]`: starts or reuses the dev server, captures light/dark × desktop/mobile screenshots, runs `@axe-core/playwright` (WCAG 2.2 AA tags), records console/hydration errors, writes `verify/<route>/report.json` (gitignored) and exits nonzero on violations.
- Add `@axe-core/playwright` as an exact-pinned dev dependency (approved in PLAN).

## Acceptance criteria

- [ ] `check:design` passes on main after fixes; seeded violation fixtures prove each rule fails with an actionable message.
- [ ] `verify:page` passes for every route in the route catalog (or documents inherited axe findings separately with issues logged), and fails on a seeded inaccessible fixture.
- [ ] No visual change to existing screens except documented token-only fixes (before/after evidence).
- [ ] README (checks section), CONTRIBUTING, CHANGELOG draft, milestone status; preview in PR.
