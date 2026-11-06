# 003 — Read-only data tools

Status: proposed. Branch: `feat/v0.10/003-data-tools`. Depends on 001 approval.

## Scope

- A server-only tool registry wrapping existing typed reads (start with Default, Analytics, Finance, CRM and E-commerce). Each tool: Zod input of enumerated options only, independent `requireSession()` in auth mode, data-source selection as today (visible DB error, no fallback), projected and size-capped output, no credentials or internal errors in results.
- Wire tools into the Assistant per the spike's design for all five providers; recorded mode resolves the same tools against demo fixtures.
- Limits: per-turn tool-call cap, tool time counted in existing deadlines, tool calls count toward rate limits; document the numbers in docs/assistant.md.
- Tool results are untrusted data in prompts; add prompt-injection tests (fixture text containing instructions must not change behavior).

## Acceptance criteria

- [ ] Unit tests per tool: schema rejection, auth-on without session → rejected, demo and DB parity (`data:parity`), DB failure → visible error.
- [ ] Mocked provider tests for each provider's tool-call flow; recorded mode shows fixture numbers with no keys.
- [ ] Preview Worker remains recorded-only, ASSETS-only with no secrets.
- [ ] Build, check, typecheck, verify:page pass; docs/assistant.md (tools, limits, privacy), README, CHANGELOG draft, milestone status updated.
