# 003 — Read-only data tools

Status: approved. Branch: `feat/v0.10/003-data-tools`. Depends on 001 approval.

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

## Proposed spike clarification — pending reviewer approval

- Use one native SDK planning step without automatic execution, validate at most four calls, then resolve sequentially before returning the Response; stream the final language with tools disabled. Keep the five existing direct adapters. Add v2 data/text-delta/finish/error transport for dashboards and retain v1 for existing replies.
- Each invocation independently guards its session, charges the existing admission buckets and uses the normal source selector. Recorded specs replace the model, not the source selector: zero-config/preview reads fixtures; configured DB reads DB and never falls back.
- Implement dashboard_read with per-domain/metric discriminated enum schemas, an explicit projection catalog and the spike's reference/result DTO. Initially range=available and segment=all; offer additional filters only with honest source support and parity. Reject unsupported date ranges/metrics rather than relabeling fixed aggregates.
- Add a guarded, model-free refresh resolver. Validate and deduplicate reference batches and finish DB work inside the request scope. No render-time fetch or shared cross-user cache.
- Shared budgets: four calls, two model requests, 4,096 aggregate output tokens (1,024 planning + 3,072 final), 2 MiB aggregate provider wire, 5s per tool within existing 20s first/15s idle/60s total deadlines. Results: 8 KiB each, 24 KiB aggregate; dashboard SSE 96 KiB including language, refresh JSON 32 KiB. Charge one admission for the request plus one per invocation; do not reset timers between phases.

Additional acceptance proposed:

- [ ] All five actual adapters pass fragmented native tool-call/result/final-text mocks on Node and compiled workerd; unknown tools, invalid args, fifth calls, late results, cancellation and aggregate budget failures fail closed.
- [ ] DB/session cleanup occurs only after preflight work settles; refresh constructs no provider and configured DB errors remain visible in recorded mode. Injection fixtures cannot bypass authorization, gate or caps.
