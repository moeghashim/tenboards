# v0.6 / 002 evidence

Base a645f58 (#57). Final immutable preview:
https://f70a72ed-tenboards-preview.mohanadgh.workers.dev ; alias
https://pr-58-tenboards-preview.mohanadgh.workers.dev . Remote bindings ASSETS only,
secret inventory empty. Earlier capture `preview` uses identical runtime 046b87a5;
`preview-final` records the final guarded upload. No production changes.

Build/check/typecheck PASS (only inherited one Biome warning/ten infos and existing
Base UI/chunk warnings). Node auth 486/486, parity 22/130; fresh/v0.5 incremental,
repeated migrations/seeds and schema drift PASS. All earlier migration files and
seed files remain unchanged. Workerd runtime/readiness/config and 22/130 HTTP
parity PASS; compiled protection 283, account 15 and security 12 PASS.

Two independent Workers sharing Docker prove limiter persistence across restart,
strict 3/10s signin enforcement, exactly 3 admitted/9 blocked concurrent requests,
Retry-After recovery, forged origin/forwarding chain rejection and missing-table
fail-closed/recovery. No tests disable the limiter. Independent Node suite fixtures
receive reserved IPs to avoid sharing unrelated counters across restarted servers.

The original missing-header test failed because Wrangler synthesizes a loopback IP
for an empty incoming header. The corrected local-only adapter strips the trusted
header immediately before the real built app. Missing and malformed trusted IPs
then share the expected no-trusted-ip bucket. The adapter is never shipped. Both
original failure and passing retry are retained. Hosted proxy behavior remains 004.

Preview policy negatives reject production name, Hyperdrive/services/vars/env and
secret bindings, contaminated input variables and root/generated-config dotenv.
A real preview build runs while production source contains a dummy Hyperdrive ID
and DB URL, and confirms no inheritance. The fixture is restored and never uploaded.
Build environment is stripped, Vite dotenv disabled, Nitro production config output
disabled, then an independent validated config is generated and re-read before
upload. Remote inventory is checked both before and after the exact uploaded ID.

Before evidence is ../v06-001/preview and ../v06-001/workerd-auth. After: local and
hosted demo five-route four-state captures plus real authenticated forms/account/
shell. Delayed V2 hydration passes. No design/tokens changed; contrast unchanged.
Account contact sheet and selected full-size renders inspected; reports contain no
unexpected errors. Full-stack historical route/preset coverage belongs to task 003.
