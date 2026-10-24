# v0.6 task 004 — Template deployment readiness

PR: https://github.com/moeghashim/tenboards/pull/61
Implementation: `3fe465c`; later task-acceptance changes are documentation only.
Immutable preview: https://ed61566f-tenboards-preview.mohanadgh.workers.dev
Alias: https://pr-61-tenboards-preview.mohanadgh.workers.dev
Version: `ed61566f-a094-4406-a408-9477676cbcae`. Remote inventory verified ASSETS-only, no secrets or database bindings. No production operation performed.

## Passing verification

| Command | Result | Log |
| --- | --- | --- |
| npm run build | Pass on final implementation | [build](logs/build-stable.log) |
| npm run check | Pass; inherited 1 warning/10 infos | [check](logs/check-final.log) |
| npm run typecheck | Pass | [types](logs/typecheck-final.log) |
| npm run db:migrate / db:seed | Fresh Docker targets | [migrate](logs/migrate-worker.log), [seed](logs/seed-worker.log) |
| npm run auth:test | 12 suites, 486 scenarios | [Node auth](logs/auth-test.log) |
| npm run data:parity | 22 reads, 130 scenarios | [parity](logs/data-parity.log) |
| npm run worker:test | Runtime/recovery/concurrency plus 22 reads/130 scenarios | [stable retry](logs/worker-test-retry.log) |
| npm run worker:auth | Protection 283, account 15, security 12: 310 total | [Worker auth](logs/worker-auth.log) |
| npm run worker:security | Distributed limits, 3/12 race admission, spoof resistance, recovery | [security](logs/worker-security.log) |
| node --experimental-strip-types scripts/operations-check.ts | Preparation, remote guards, repeat migration/seed, read-only/account smoke, incomplete states | [operations](logs/operations-check.log) |
| node --experimental-strip-types scripts/deploy-check-test.ts | All checker cases pass | [checker](logs/deploy-check-test.log) |
| node --experimental-strip-types scripts/cutover-order-check.ts | Local atomic-upload dry-run only | [dry-run](logs/cutover-order-check.log) |
| node --experimental-strip-types scripts/preview-policy-check.ts | Existing preview isolation preserved after shared prefactor | [policy](logs/preview-policy-check.log) |
| npm run deploy:prepare (temporary copied fork) | Real Nitro build validates fixture name/binding, creates 0600 external file, excludes inherited secret markers | [integration](logs/prepare-integration.log) |
| npm run deploy:check -- <immutable-or-alias> --demo | Both pass; no account writes | [immutable](logs/preview-smoke.log), [alias](logs/preview-alias-smoke.log) |

The preparation validator covers 27 invalid configs, missing/invalid flags, environment allowlisting/dotenv rejection, realpath containment, symlinks, exclusive creation, random secrets and shell-safe command ordering. Its fixture ID is syntactic only; no remote resource is contacted. The temporary copied fork and secret file were removed.

Node/data tests used the first fresh Docker database; Worker/operations tests used a second fresh database after the startup retry. Both were dropped; [verification](database-cleanup-verification.json) confirms zero remaining. The shared Postgres service stays running. Operations also creates/drops its own inner test database.

## Captures

Nonvisual operations/docs/metadata change: no app layout, tokens, presets or component changes. `npm run screenshots -- --base-url <origin> --routes /dashboard/default --reference 2026-10-24T12:00:00.000Z --output <directory>` captured light/dark × desktop/mobile before, after and on the immutable preview. All 12 final cases have zero app console, request or hydration errors. Every submitted image was inspected; all four dev before/after PNGs are byte-identical ([comparison](visual-comparison.json)). Development screenshots include the existing devtools badge; production-preview screenshots do not.

| State | Before | After | Preview |
| --- | --- | --- | --- |
| light/desktop | [before](before/_dashboard_default-light-desktop.png) | [after](after/_dashboard_default-light-desktop.png) | [preview](preview/_dashboard_default-light-desktop.png) |
| light/mobile | [before](before/_dashboard_default-light-mobile.png) | [after](after/_dashboard_default-light-mobile.png) | [preview](preview/_dashboard_default-light-mobile.png) |
| dark/desktop | [before](before/_dashboard_default-dark-desktop.png) | [after](after/_dashboard_default-dark-desktop.png) | [preview](preview/_dashboard_default-dark-desktop.png) |
| dark/mobile | [before](before/_dashboard_default-dark-mobile.png) | [after](after/_dashboard_default-dark-mobile.png) | [preview](preview/_dashboard_default-dark-mobile.png) |

## Original failures and inherited diagnostics

- Initial screenshots targeted `127.0.0.1` while Vite listened on `localhost`: `net::ERR_CONNECTION_REFUSED`. [Original report](before-failed-ipv4/report.json) and [log](logs/screenshots-before.log) are retained; all localhost retry cases pass.
- Initial Worker test failed with `Error: Local Worker failed to start (details redacted).` at worker-test-support.ts:97 during a concurrent preview rebuild ([original log](logs/worker-test.log)). It had passed the first three modes. A fresh build/database and no overlapping builds passed the complete suite; no runtime code workaround was made. [Initial results](test-results.json), [stable retry results](worker-test-results.json).
- Inherited Biome warning: array-index React key at src/lib/highlighter.tsx:96, plus ten existing infos. Commit hook reports the existing fs.Stats deprecation. Dev tooling can emit its existing TanStack CSRF-middleware advisory; this task changes no auth behavior and all security suites pass.
- T3's collaborative browser logged Electron sandbox/preload startup errors before page load. These are host diagnostics; the repository's required Playwright capture script independently reports zero app errors. Historical navigation aborted some optional Google-font fetches in that browser; completed capture reports are clean.

Social metadata was inspected on the immutable preview: `/og.png` resolves to that preview's own origin. Adopters who need an absolute crawler URL are told where to set it.

Hosted Neon TLS/pooling, remote Hyperdrive cache and actual Cloudflare proxy-header behavior remain unverified. This evidence covers local workerd/Postgres and the isolated demo preview only. No project-owned database/Hyperdrive/secrets or production Worker was provisioned or changed.
