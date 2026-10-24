# v0.6 / 003 operations acceptance evidence

Implementation revision c9010d0bc83e19efd8daf46d3cd5d68538bf67ab.
Base 503c653 (#58); operations-only layer. Preview:
https://b890f943-tenboards-preview.mohanadgh.workers.dev
(alias https://pr-59-tenboards-preview.mohanadgh.workers.dev).
`preview-inventory.json` records ASSETS only and an empty secret inventory.
No production Cloudflare resource, binding, secret, database or traffic changed.

## Runtime and operations

Build/check/typecheck pass. Inherited Biome one warning/ten infos and Base UI/chunk
warnings are unchanged. Node auth 486/486; Node and workerd each prove the existing
22 reads/130 parity scenarios. Fresh/v0.5 incremental and repeat migrations/seeds
pass. Compiled workerd protection 283, account 15, security 12 and database limiter
multi-instance/restart/concurrency/recovery checks pass. Logs are in `logs/`.

The default deployment smoke sends GETs only, rejects wrong mode/unsafe redirects,
invalid sessions, server errors, timeouts/unreachable targets, and does not replay
cookies. Real local workerd default checks create no accounts. Explicit round-trip
creates exactly one reported disposable account, revokes its sessions, and the
local test deletes that account. Secret-only and DB/auth-off states fail production
smoke. Remote operations reject absent opt-in and unsafe/non-TLS targets before any
connection. Default/explicit-opt-in migrate/seed repeat on an owned Docker database
with no auth identities seeded, and that database is dropped afterward.

The installed Wrangler accepts one code+binding+secrets-file version upload in a
local dry run; no version or cloud resource is created. `docs/deploy.md` records the
reviewer-only atomic staging/promote sequence, exact targets, rollback compatibility
and independent data recovery. Neon TLS/pooling/cache, actual Cloudflare proxy
headers and control-plane promotion remain task 004 checks, not local claims.

## Capture evidence

`matrix/`: 38 generated UI routes × four presets × light/dark × desktop/mobile ×
local demo/isolated hosted demo = 1,216 baseline captures. `coverage.json` validates
complete inventory and resolves explicitly linked retry reports without erasing
original failures. Four initial cases hit network/navigation/network-idle timeouts:
local default logistics (external map CDN), hosted default finance, hosted iris chat,
and local iris mail. Their exact diagnostics remain in original reports/logs.
Only affected routes are retried, with the same origin/reference/timezone/preset.
No console warning suppression or application changes were made for these retries.

`hydration/`: eight historical routes, two real timezones, direct + refresh,
1,800ms script delay, four states and both local/hosted demo = 256 captures.
`auth-hydration/`: four auth forms plus authenticated dashboard and Profile Account,
two timezones, direct + refresh, 1,500ms script delay and four states = 96 captures
against real workerd/Docker auth. Auth session state stays in memory, never artifacts.
One local Kiritimati V2-login direct capture hit a transient null-body stability
probe error; its refresh passed. The exact eight-case route rerun passed. Original
report and retry are retained and validated by `hydration-coverage.json`.
`workerd-auth/` adds protected shell and account regression evidence.

Before: ../v06-002/preview-final and ../v06-002/workerd-auth. After: current matrix,
hydration and authenticated captures. This layer edits operations/scripts/docs only;
no UI, tokens or contrast pairs change. Contact sheets and selected full-size auth,
account and dashboard renders are inspected; screenshots remain off main.
