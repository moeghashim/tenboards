# v0.6 — Production Cloudflare

Status: **in progress — task 001 in review; tasks 002–004 are todo**. Baseline: `origin/main` **272ee7b** (`272ee7be8d3a409cb1d6803a5c64a6bd1add7da5`), 2026-10-24, following released v0.5.0. [PLAN.md](../../../PLAN.md) is the canonical contract; its six **v0.6 production host / database provisioning / production mode / OAuth / runtime / previews** Decisions log rows win. Precedent: [v0.5](../v0.5-auth/README.md), planning [PR #50](https://github.com/moeghashim/tenboards/pull/50), and [v0.4 planning PR #41](https://github.com/moeghashim/tenboards/pull/41).

## Brief and boundaries

Make the existing app work with Neon through Hyperdrive on **https://tenboards.mohanadgh.workers.dev**, with email/password auth, open sign-up and the existing shared seeded data. Every signed-in user sees the same template records; auth identities remain separate from directory/sample users. Keep local zero-config demo, optional Node/Postgres development and all v0.5 access/session protections. PR previews move to the separate **tenboards-preview** Worker and remain demo-only, with neither database access nor secrets.

Include request-scoped Workers database/auth runtime, distributed auth rate-limit storage, isolated preview tooling, operational documentation, repeatable smoke checks and reviewer-owned cutover. The user creates Neon and supplies its **direct** connection string only at cutover. The reviewer provisions Hyperdrive, disables its query cache, sets secrets, migrates/seeds Neon, commits the nonsecret binding ID, deploys from main and releases v0.6.0. Google/GitHub keys are optional later; both providers stay hidden in production at launch.

Exclude custom domains, Pages/pages.dev, new auth flows, RBAC/tenancy, per-user business data, CRUD, email verification/reset, new hosting or database drivers, UI redesign and general CI work. No new runtime dependency is planned. Preserve PLAN, protected components, migrations already shipped, fixture parity, font/preferences registries, licenses and hydration fixes. New dependencies or scope conflicts require escalation. This explicit planning assignment authorizes new `dev/**` contracts; this PR changes documentation/status only, not application code, tooling, configuration, migrations, cloud resources or secrets.

## Baseline inspection and prefactor findings

| Current surface | Finding and bounded implementation seam |
| --- | --- |
| `vite.config.ts`, `wrangler.jsonc` | Build uses Nitro `cloudflare-module`; source date is `2026-10-23`. Source flags are absent, but the installed Nitro already emits `nodejs_compat`. Make the source intent explicit and verify generated config; do not claim compatibility is wholly absent today. |
| `src/server/data/source.ts` | Selection and validation read only `DATABASE_URL`; `readSource` uses `process.env`. Add a single server runtime resolver shared by source selection and auth, preserving pure validators and `DATA_SOURCE=demo`. |
| `src/server/db/client.server.ts` | Lazy module singleton postgres.js client (`max: 4`) is appropriate for Node, not workerd. Isolate client creation from lifetime selection; keep call sites local through request context. |
| `src/lib/auth/auth.server.ts` | Its singleton Better Auth instance captures the Drizzle client. Fix its lifetime together with the DB client; changing only `getDatabase()` leaves cross-request I/O. Rate limiting is already enabled with **memory** storage. |
| Auth config/session/account modules and `src/start.ts` | All consult `process.env`; the Vite config also validates build-process env. Worker runtime values must govern requests. `trustedOrigins: [config.baseURL]` already exists and the URL validator normalizes to an origin. Preserve and prove this rather than inventing another allowlist. |
| `assertAuthStorage` | Startup middleware and auth handler both query four auth tables. Memoize successful readiness per isolate without retaining an I/O promise/client across requests; failures must remain retryable. Task 002 adds the limiter table to readiness. |
| `scripts/auth-test-support.ts`, `scripts/data-parity.ts` | Auth tests spawn Vite and discover RPCs from Vite-transformed source; parity imports reads directly in Node. Neither proves workerd. Add a runtime-target seam and compiled-RPC test support, with no shipped test endpoint or auth bypass. |
| `scripts/database.ts` | Migrate/seed explicitly reject remote URLs through `databaseUrl(env, true)`. Task 003 must provide a deliberate guarded remote execution option before the Neon runbook can work; preserve local-only defaults and parity/test safeguards. |
| `package.json`, `AGENTS.md`, `CONTRIBUTING.md`, root README | Preview command currently uploads versions to `tenboards`. Task 002 replaces that target and reconciles contributor wording. Never use the old target for new PR uploads. |

These are prefactor candidates, not changes performed by this planning PR. Inspect again before each task and extract only helpers that reduce that task's risk.

## Configuration matrix

“DB” below means DB data with auth off; “auth” means DB data plus a valid `BETTER_AUTH_SECRET`. Absent/empty secret disables auth; malformed nonempty values fail closed. `DATA_SOURCE=db` remains unsupported. Runtime connection precedence is **HYPERDRIVE.connectionString → DATABASE_URL**; a present invalid binding is an error, not permission to fall back. No configured database means demo. `DATA_SOURCE=demo` forces fixtures without opening a connection; combining forced demo with a nonempty auth secret remains an explicit error.

| Environment | Demo | DB / auth off | DB + auth |
| --- | --- | --- | --- |
| Local Node (`npm run dev`) | No DB URL or secret; optional forced demo. No connections. | Local Docker `DATABASE_URL`, no secret; existing pooled Node client. | Same DB plus local secret and canonical loopback `BETTER_AUTH_URL`; existing account/route behavior. |
| Local workerd (`wrangler dev`, non-production env `local`) | No binding/URL/secret, or forced demo without secret. | Local env's `HYPERDRIVE.localConnectionString` points at Docker Postgres; no secret. Exercise `DATABASE_URL` fallback separately with no binding. | Same local binding plus ignored local secret/base URL; request-scoped DB and auth. Never remote dev or a production Hyperdrive ID. |
| PR Worker `tenboards-preview` | **Only allowed mode.** ASSETS only; no Hyperdrive, DB URL, auth/provider secrets or production service bindings. | Prohibited; preview validation rejects database configuration. | Prohibited; preview validation rejects secrets. |
| Production Worker `tenboards` | Allowed only before cutover: omit active Hyperdrive binding, DB URL and auth secret. | Useful local test case, **not a releasable production state**. | Required at cutover: real HYPERDRIVE ID, cache disabled, valid secret and `BETTER_AUTH_URL=https://tenboards.mohanadgh.workers.dev`; OAuth keys absent. |

Required negative cases: secret without DB, secret with forced demo, malformed URL/secret, unsupported source override, invalid binding despite valid fallback URL, unreachable DB, missing auth/limiter schema, failure then recovery, and DB loss after a successful readiness check. None may silently expose the app or substitute fixtures for a configured DB. No-secret DB mode remains an existing supported local behavior, so deploy acceptance must explicitly detect and reject that state on production.

### Binding slot and build behavior before cutover

Task 002 leaves the production `hyperdrive` array absent or empty and documents a commented `HYPERDRIVE` entry for the reviewer to activate with the real ID. Do not put a fake/dummy ID in an active production binding. A clean zero-env build and binding-less/no-secret deployment remain demo; an auth secret without a DB must fail, not force demo. Build without production secrets and read deployment settings at runtime. Build-time environment validation must neither demand Neon access nor bake credentials into output. Local-only binding configuration is separate and never used by production/preview deployment commands.

The separate preview target needs explicit config selection, not just a name override on a config that later gains production bindings. Nitro's merge behavior can retain arrays: verify the generated preview configuration contains only allowed bindings and reject unexpected env/secrets before upload. Task 002 documents first-time preview Worker initialization and verifies the immutable version URL plus `pr-NNN` alias on `tenboards-preview`. This documentation-only planning PR can reference an existing unchanged demo baseline version. Task 001 still needs an isolated demo version preview: use a reviewed, binding-free configuration targeting tenboards-preview for the interim upload, then task 002 makes that selection the permanent command. If that isolated upload is unavailable, record the missing preview gate rather than upload to production or waive implementation evidence.

## Runtime research relied on

Checked 2026-10-24 against official docs and the installed lockfile packages. Revalidate at implementation time; distinguish documented platform support from the actual built artifact.

| Source | Specific fact and consequence |
| --- | --- |
| [Cloudflare Postgres.js](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/) | Hyperdrive supports postgres.js (minimum 3.4.5; installed 3.4.9). Current guidance warns against `prepare: false`; retain prepared statements and the approved driver. No switch to `pg`. |
| [Connection lifecycle](https://developers.cloudflare.com/hyperdrive/concepts/connection-lifecycle/) | Clients belong inside request/invocation scope; global pools can retain invalid I/O. Hyperdrive owns upstream pooling and cleans up edge connections at invocation end. Do not close a request client before streamed work finishes. |
| [Node compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/), [compatibility flags](https://developers.cloudflare.com/workers/configuration/compatibility-flags/) | Current docs enable Node compatibility by default for dates from 2026-08-04; the repository uses 2026-10-23. Keep explicit `nodejs_compat` per PLAN. Text/JSON bindings, including secrets, populate `process.env` with compatibility enabled and the population flag (default since 2025-04-01). Hyperdrive is an object binding; do not expect its connection string in `process.env`. |
| [Worker bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) | Worker bindings are accessible from the handler `env` or `cloudflare:workers` imported `env`; neither grants global-scope I/O. Node entry points cannot unconditionally import the Worker-only module. |
| [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare) and installed `nitro@3.0.260903-beta` | Nitro documents binding access through `event.req.runtime.cloudflare.env`. Installed `_module-handler.mjs` attaches `runtime.cloudflare.env/context` to the Request before dispatch. Prefer this request-owned path for the shared runtime resolver; verify it reaches TanStack Start middleware/server functions. Do not use Nitro's mutable `globalThis.__env__` as a request store. |
| Installed Nitro `dist/_presets.mjs`, `writeWranglerConfig` | Reads nearest wrangler.json/jsonc/toml. Merge is `defu(overrides, cloudflare.wrangler, userConfig, defaults)`; generated entry/assets win, inline Nitro settings precede source settings, source date precedes defaults. `nodeCompat` defaults true and appends the flag. Writes `.output/server/wrangler.json` and `.wrangler/deploy/config.json`. The baseline build confirms date, flag, name and ASSETS. Inspect output; never hand-edit it. |
| [Hyperdrive local development](https://developers.cloudflare.com/hyperdrive/configuration/local-development/) | `wrangler dev` uses `localConnectionString` to connect directly to Docker Postgres. It does not reproduce hosted Hyperdrive caching/pooling. Keep local credentials in ignored configuration; cutover must independently verify remote cache-disabled operation. |
| [Better Auth rate limits](https://better-auth.com/docs/concepts/rate-limit) | Database storage requires a rate-limit model/migration; for Drizzle, use the ORM migration path. Defaults include 100/10s and stricter sign-in rules; explicit enablement covers development. Server-side `auth.api` calls bypass HTTP limiting. A trusted single proxy header is supported. Verify installed behavior, persistence across independent instances, 429/recovery and forwarded-IP spoof resistance. |
| [Wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/), [version URLs](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/) | Bindings/env values need environment-specific configuration; a version URL is not a separate data boundary. PLAN requires the separate preview Worker, regardless of platform preview conveniences. |
| [Hyperdrive Neon](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/neon/), [Hyperdrive CLI](https://developers.cloudflare.com/hyperdrive/reference/wrangler-commands/), [rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/) | Use Neon direct connectivity; CLI supports `--caching-disabled`. Worker rollback is a deployment operation, not a Neon schema/data restore. Verify version/binding/secret compatibility before rollback. |

## Security checklist

Owners 001–003 verify locally; 004 repeats hosted checks. Boxes remain unchecked until evidence exists.

- [ ] Preview build, upload and deployed Worker are demonstrably database/secret-free, including inherited bindings, local env files and provider keys. Production data cannot be reached from previews; no wildcard production trust for preview URLs.
- [ ] Runtime-only secrets/connection strings never appear in Git, browser bundles, HTML, logs, errors or published evidence. Ignore local Wrangler secret/config files; publish redacted facts, never raw environment dumps, cookies or auth storage state.
- [ ] Request-scoped DB and Better Auth instances cannot share a prior request's socket, headers, identity or session. Sequential and overlapping requests with different users pass; Node pooling and zero-config demo remain intact.
- [ ] Hyperdrive caching is disabled in the actual remote configuration. Auth cookie caching remains disabled; session revocation is effective on the next protected request. Private/no-store behavior remains intact.
- [ ] Rate-limit counters persist outside isolates in an isolated `auth_rate_limit` table, with reviewed migration/model mapping and missing-table failure checks. Test two instances sharing a DB, 429/recovery and concurrent requests; document measured limitations rather than promising strict atomic limits without proof.
- [ ] Production limiter trusts Cloudflare's overwritten client-IP header, not client-supplied forwarding chains. Local tests use controlled headers; Node development remains supported. Existing credential mutations keep their Better Auth HTTP boundary; direct API calls are not claimed to be rate-limited.
- [ ] Exact trusted origin comes from validated runtime `BETTER_AUTH_URL`; non-loopback auth cannot silently use localhost. Preserve CSRF/origin checks, safe redirect validation, HttpOnly/Secure/host-only cookies and current-user session ownership. Reject forged origins and tampered/revoked sessions.
- [ ] Auth requested with broken DB/config/schema fails closed, including after readiness memoization. Cache only successful readiness; no global pending I/O shared across requests and no sticky failure that prevents recovery.
- [ ] Fresh/incremental migrations and idempotent fixture seed preserve auth records. No default passwords or seeded auth identities. Production enables open signup and shared data knowingly; no per-user ownership claim.
- [ ] Smoke defaults are read-only. Optional account checks use unique throwaway credentials, redact them, sign out/revoke their sessions and document retained test-account cleanup without adding a public account-deletion feature.

## Definition of Done

- [ ] All configuration matrix cases pass on Node and local workerd, with request-scope/concurrency and runtime-secret proof, plus baseline data parity and the defined Worker subset.
- [ ] `tenboards-preview` serves demo-only immutable/alias previews; build/upload guards and contributor docs prevent uploads to the production Worker.
- [ ] Auth rate limiting uses migrated cross-isolate database storage, exact runtime origins and verified IP handling; the security checklist has evidence.
- [ ] `docs/deploy.md` and `npm run deploy:check -- <url>` are implemented and verified; remote migrate/seed requires explicit opt-in. README, auth/data guides and CHANGELOG v0.6 draft match delivered behavior.
- [ ] Build/check/typecheck, dev default smoke, demo and authenticated workerd acceptance, hydration regression and required four-state evidence pass. Artifacts live only on `pr-assets`/PR attachments.
- [ ] Reviewer receives the user's Neon URL, performs task 004 from approved main, verifies hosted auth/data/cache/isolation, updates acceptance/status and publishes v0.6.0. No implementer merge, production deploy, version bump/tag or release.

## Cutover runbook outline

Task 003 expands this into tested `docs/deploy.md`; **only task 004/reviewer executes production steps**.

1. Confirm tasks 001–003 merged, exact main SHA, clean checks, separate demo previews, recovery plan and last known-good deployment/version IDs. Keep production demo until prerequisites are ready.
2. User creates Neon project/database and supplies direct TLS connection URL through the agreed private handoff. Reviewer confirms target and connection without echoing credentials. Project/region choices belong to the user's provisioning step; no paid service is provisioned by this planning task.
3. Reviewer creates Hyperdrive with `wrangler hyperdrive create` and `--caching-disabled`, supplies the direct connection securely, and verifies caching is disabled. Retain only its nonsecret ID in the production `wrangler.jsonc` slot; never put the URL there.
4. Run committed migrations and fixture seed against the **direct Neon URL**, using task 003's explicit remote opt-in. Verify schema, representative data and preservation of auth tables; no schema push, destructive reset or migration through Hyperdrive.
5. Set `BETTER_AUTH_SECRET` and canonical `BETTER_AUTH_URL` with `wrangler secret put` on **tenboards only**. Stage changes in a version-safe sequence before switching traffic: secret updates can affect deployment state, so avoid leaving a secret-only/no-binding live version. Do not set production `DATABASE_URL` as a routine substitute for Hyperdrive. Leave OAuth pairs absent.
6. Reviewer commits/reviews/merges the binding ID change, builds from main, validates final configuration and deploys. Record resulting production version and expected binding names without secret values.
7. Run `npm run deploy:check -- https://tenboards.mohanadgh.workers.dev`, then opt-in throwaway signup/signin, protected navigation, signout/revocation, secure cookie/origin and non-destructive data checks. Confirm providers hidden and preview still demo. Run the limiter load/negative tests on local isolated data, not against public production users.
8. On failure, reviewer uses `wrangler rollback <known-good-version-id>` only after checking its binding/secrets/schema compatibility, then repeats smoke. A deliberate return to the prior **demo** deployment must remove incompatible auth configuration as a coherent version; never leave production DB data exposed with auth off. Rollback does not undo Neon migrations/seed; keep migrations additive and document separate data recovery.
9. Reviewer records redacted evidence, finalizes README/CHANGELOG/status, bumps/tag/releases **v0.6.0**. Later OAuth setup documents Google/GitHub key pairs and `/api/auth/callback/{google,github}` on the canonical host; it is not a launch gate.

## Stack, validation and ownership

Planning branch: `docs/v0.6/000-milestone-plan`, base main at 272ee7b; one documentation layer. Implementation merge order:

1. [001 — Workers database runtime](001-workers-database-runtime.md): runtime resolver, client/auth lifetime, readiness memo and local workerd harness.
2. [002 — Preview isolation and production hardening](002-preview-isolation-hardening.md): separate preview target, DB-backed limiter, origin/IP policy and production binding slot.
3. [003 — Ops, docs and acceptance](003-ops-docs-acceptance.md): guarded remote DB commands, runbook, deploy smoke and integrated evidence.
4. [004 — Production cutover](004-production-cutover.md): **reviewer-owned**, depends on user-supplied Neon access; never assigned to the implementer.

One approved task per branch/PR; later branches use `feat/v0.6/NNN-slug`. Declare stacks and layer compare URLs. Claude Opus 5.5 reviews every PR and alone holds merge/main-deploy/release authority; GPT-6-Astra implements 001–003 only when assigned. No implementation starts with this plan.

Every task runs `npm run build`, `npm run check`, `npm run typecheck` and error-free dev `/dashboard/default` smoke. Implementation adds the owning runtime/security/migration tests below; full `npm run auth:test` and `npm run data:parity` stay Node regressions, not substitutes for workerd. Defined local Worker subset: demo/DB/auth modes, all registered domain reads through compiled request paths (or a test-only Worker harness excluded from production), sequential/concurrent users, credential flows, route/data guards, cookie/origin/redirect rejection, revocation, DB/schema failures and recovery. Document any test excluded from workerd and why; Vite source-based RPC discovery needs adaptation. Hosted pooling/TLS/cache and true Cloudflare proxy behavior remain task 004 checks, not claims from local emulation.

Capture/inspect light/dark × desktop/mobile for affected auth/protected/demo screens before/after, with `npm run screenshots`; keep output off main. No intended visual change means a documented nonvisual exemption, never omission of console/hydration smoke. Preserve inherited warnings separately from failures. The planning PR uses fresh local smoke plus a labeled existing immutable demo baseline URL; it does not deploy through the superseded production-preview command.

## Open questions and conflicts

- **Pending access, task 004 only:** the user's direct Neon connection URL is intentionally unavailable until cutover. Record this in [open questions](../../open-questions.md); do not request it early or block 001–003. No unresolved product decision is needed to draft this plan.
- **Resolved by PLAN precedence:** AGENTS/CONTRIBUTING and the current preview command describe production-Worker version uploads. The newer v0.6 previews decision wins immediately. Task 002 updates those files; planning/task 001 must not use that stale command against `tenboards`. The planning baseline reference is explicitly historical, not a new isolated preview. Task 001 requires an interim isolated upload as specified above. This reconciliation is also logged in open questions.
- **Technical verification gates, not new product decisions:** prove Nitro request context propagation and runtime secret delivery in 001; prove generated preview isolation and distributed limiter semantics in 002; rehearse secret/deployment ordering and rollback in 003. If those fail or require a new runtime dependency, record the exact blocker and pause dependent work. Before-ID demo behavior and remote-DB opt-in are specified above and are reviewable in this planning PR.
