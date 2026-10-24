# v0.6 / 001 evidence

Base: actual squash of planning PR #56, a1a1aa7 (tree identical to approved 3781063).
Runtime: Node 24.21.0; Wrangler 4.152.0; Nitro 3.0.260903-beta; postgres.js 3.4.9;
Better Auth 1.7.12; Docker Postgres 17; local compatibility date 2026-10-23.

Preview https://40f2c0dc-tenboards-preview.mohanadgh.workers.dev and alias
https://pr-57-tenboards-preview.mohanadgh.workers.dev are demo only. The first-use
ASSETS-only deploy created tenboards-preview; no production operation occurred.
The redacted remote inventory shows only ASSETS and an empty secrets list.

Passing: build/check/typecheck; Node auth 486/486; Node parity 22 reads/130 scenarios;
fresh and v0.4 upgrade through v0.5/repeated migration/seed (fresh databases dropped);
local workerd runtime/config/lifetime/readiness/recovery, 22/130 HTTP parity;
compiled Worker protection 283/283, accounts 15/15, security 12/12. The Worker
harness is a separate test entry excluded from app builds. No real OAuth consent,
Neon, hosted pooling/TLS/cache or real Cloudflare proxy behavior is claimed.

Readiness test fails twice with a renamed required table, succeeds after restoring
it without restarting, then succeeds with an unused auth table absent (memoized
success). Later missing session storage fails closed and recovers. Distinct users
are checked sequentially and concurrently on one Worker isolate, with actual
protected DB reads. Runtime-only secret equality probe does not print values.

Before: baseline-v05 is a new capture of immutable released demo ad11a46d. After:
20 local and 20 isolated preview cases (five routes × light/dark × desktop/mobile),
plus actual authenticated form/account/shell captures. 1.2-second hydration delay
includes each V2 form. Inspected layouts preserve hierarchy, sizing and access;
no visual/token changes, so no new contrast calculation. All final reports have
zero unexpected errors. The first exploratory capture used IPv4 while Vite listened
on IPv6; rerunning with the explicit localhost origin resolved the connection error.

The initial Worker security probe's localhost HTTPS header was rewritten by
Wrangler's proxy and rejected with 403. The passing adaptation uses reserved
https://secure.example.test only for the Secure-cookie header test; auth defenses
are unchanged. Both original failure and passing retry logs are retained.

Inherited warnings: Base UI dependency use-client bundling, chunk-size advisory,
Base UI Collapsible transition/animation advisory, Biome highlighter index-key
warning and ten informational diagnostics. No warning suppression added.

Review-only databases tenboards_review_v06_001 and tenboards_review_v06_node are
used across the stack's verification, then removed at completion. No shared data
is reset. Source config/credentials/test storage state are excluded from evidence.
