# v0.7 Assistant — review round 2 evidence

Implementation heads: 001 602cf75; 002 bbcc2b6; 003 2e76926. UI/runtime source in the preview matches these heads; the final 003 commit only records preview-verification recovery. No backend/protected-wrapper/PLAN/pin changes versus the prior integrated head c25f58a.

## Authoritative results

All application checks pass. Per-layer `001/002/003-typecheck-final.log`, `*-check-final.log`, `*-preview-final.log` (includes successful builds), and `*-smoke-final.log` cover build, Biome, TypeScript and four-state Assistant/default smoke without application console errors. `001/002/003-final/` contains those captures. Preview command failure/recovery is explained below, separately from build results.

- `003-assistant.log`: 1,047 assertions and six fan-out attacks.
- `conversation.log`: reducer, regeneration, context/history, safe recovery.
- `ui-final.log` and `ui/`: Enter/Shift+Enter, 1–8 rows, pre-token streaming, Stop, regenerate, copy, paused/resumed auto-scroll, anchored composer, log semantics and no console errors in four states. Synthetic multi-component replies include KPI, compact table and chart; completed-latest captures show the lower reply/actions.
- `recorded-final.log`: real recorded examples, IME, Stop/clear races, no provider egress, reload and overflow, four states.
- `context.log`: whole-pair trimming, scroll preservation, transient history, four states.
- `lifecycle.log`: five single-key pickers and four-state configured-provider lifecycle/recovery with local synthetic mocks.
- `server.log`, `assistant-worker-rerun.log`: 45 actual adapter wire cases on Node and compiled workerd, guard order, storage-off, caps/deadlines/cancellation, DB races and authenticated limits.
- `modes-final.log`: all 12 Node/workerd configuration cases.
- `auth-final.log`: 12 suites / 435 scenarios. `parity-final.log`: 22 reads / 104 scenarios.
- `worker.log`, `worker-auth.log`, `worker-security.log`: runtime/data parity, auth and durable security regressions.
- `artifacts-final.log`: 181 client / 220 server artifacts, no client SDK/credential/test-hook leaks.
- `preset-default.log`, `preset-graphite-final.log`, `preset-pine-final.log`, `preset-iris-final.log`: Assistant/default plus embedded and standalone Chat, direct/refresh, all four presets. Final corrected default Assistant empty captures are in `003-final/` and `ui/`.
- `before-hosted/`: actual reviewed 8cafcdb4 preview, four states. No recreated before images.
- `impeccable-critique.md`: independent design/detector synthesis; implementer critique, not a reviewer verdict.

## Preview recovery

Uploads used only `npm run preview:deploy -- --preview-alias pr-NNN`. Cloudflare initially returned error 100146 for freshly uploaded version IDs; one #70 attempt stopped during inventory inspection. The uploader guard was not bypassed or weakened. Delayed read-only checks in `68/70/72-remote-verification.log` confirm ASSETS only and no secrets. The original failed CLI results are retained, not represented as exit-zero uploads. `001/002/003-hosted-final.log` confirms hosted demo behavior. #68 has two equivalent uploads; 42e068a1 is the remotely verified immutable version, while the pr-68 alias points to equivalent 0cef689c.

- #68: https://42e068a1-tenboards-preview.mohanadgh.workers.dev/dashboard/assistant
- #70: https://7a86da4d-tenboards-preview.mohanadgh.workers.dev/dashboard/assistant
- #72: https://0c268374-tenboards-preview.mohanadgh.workers.dev/dashboard/assistant

## Diagnostics and limits

Earlier interrupted logs remain for audit. Stale route-ready expectations, a duplicate dev server, branch-switch/hook reloads, and host ENOSPC/Docker loss were followed by successful reruns identified above. Isolated native PostgreSQL 17 on port 3189 with `_v07_` databases replaced unavailable Docker; no unrelated files were deleted.

Build diagnostics include inherited dependency `use client`/unused-import warnings and ts-node DEP0180. Biome exits zero with existing diagnostics plus new test-only non-null-assertion warnings; these are warnings, not test failures. Local TanStack devtools can overlap the mobile composer in dev screenshots; it is absent from hosted previews. T3's Electron preload errors are host-browser diagnostics, separate from clean application browser-suite results.

No tokens or presets changed; existing supported token pairs are retained. Only synthetic provider keys/local upstream mocks were used. Live provider entitlement, real mobile soft-keyboard hardware, and hosted Neon/Hyperdrive are not established by this evidence. No reviewer approval, merge or production deployment is claimed.
