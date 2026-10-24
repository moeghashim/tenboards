# Production deployment and operations

Status: v0.6 implementation is in review. Production cutover, hosted acceptance,
version bump/tag and release are **task 004, reviewer-owned**. Implementers never
provision Hyperdrive, set production secrets, upload versions to `tenboards`, or
run `npm run deploy`. The user creates Neon and supplies its direct URL privately
only at cutover; lack of that URL does not block local implementation acceptance.

## Targets and credentials

| Target | Selected command/config | Database/auth |
| --- | --- | --- |
| Node development | `npm run dev`, optional ignored `.env` | Docker URL, optional local auth |
| Local workerd | `npm run worker:dev -- --binding`; helper selects `--env local --local` | Ignored localConnectionString to Docker, ignored local secret; never remote dev |
| PR preview | `npm run preview:deploy -- --preview-alias pr-NNN` generates `.wrangler/preview/wrangler.json` | Exact `tenboards-preview`, ASSETS only, no secrets |
| Production | Reviewer selects freshly generated `.output/server/wrangler.json` and verifies `name=tenboards` | Real HYPERDRIVE ID, auth on, canonical HTTPS origin |

Never pass the root `wrangler.jsonc` as an entry config: Nitro generates its entry,
assets and module settings. The preview CLI deliberately bypasses the production
config and redirect. Build production output afresh before production operations;
a preview build is not production output. Do not hand-edit generated files.

Use a private workstation/session, `set +x`, `umask 077`, and private files outside
the repository. Do not paste credentials into PRs, chat, shell history, command
logs or screenshots. Wrangler logs can include binding/configuration details on
failure; inspect them privately and publish only redacted metadata. Keep OAuth
pairs absent for launch. Do not put DATABASE_URL in production Worker secrets:
only the Hyperdrive binding supplies its runtime connection.

## Local rehearsal (implementer-safe)

```sh
docker compose up -d
# Create a fresh test-owned database, choose a unique name; port 54329.
docker compose exec -T postgres createdb -U tenboards tenboards_review_example
export DATABASE_URL='postgresql://tenboards:tenboards_local@127.0.0.1:54329/tenboards_review_example'
npm run db:migrate
npm run db:seed
npm run build
npm run check
npm run typecheck
npm run auth:test
npm run data:parity
npm run worker:test
npm run worker:auth
npm run worker:security
node --experimental-strip-types scripts/operations-check.ts
node --experimental-strip-types scripts/deploy-check-test.ts
node --experimental-strip-types scripts/cutover-order-check.ts # local --dry-run only
# Stop test servers before deleting only this test-owned database.
unset DATABASE_URL
docker compose exec -T postgres dropdb -U tenboards tenboards_review_example
```

The operations test applies/repeats default and `--allow-remote` commands on its
own fresh Docker database, then drops it. Remote target parsing/TLS/opt-in rejection
is tested without connecting to a remote server. Test commands and parity remain
local-only. `--allow-remote` belongs only to migration/seed, accepts direct Postgres
URLs, requires TLS for non-loopback hosts and rejects known pooling endpoints.
No command resets schemas or seeds default auth accounts.

Local workerd rehearses the relevant ordering states: old no-binding/no-secret
demo; new DB+auth version; rejection of secret-only and DB/auth-off production
expectations; return to the old demo expectation. Local emulation does not test
Cloudflare's deployment control plane, Neon TLS/pooling, real proxy headers or
Hyperdrive cache configuration. The reviewer verifies those in task 004.

## Reviewer cutover: provision and prepare without changing traffic

The following commands are **reviewer-only**, not executed by tasks 001–003.
Use a Bash session. Start from reviewed clean main after all three implementation
layers merge. Task 004's real binding commit must not trigger the routine main
deploy until the complete secret-bearing version below is ready.

```bash
set +x
umask 077
git switch main
git pull --ff-only
test -z "$(git status --porcelain)"
npm ci
export TENBOARDS_OPS_DIR="$(mktemp -d "${TMPDIR:-/tmp}/tenboards-cutover.XXXXXX")"
# User supplies Neon DIRECT URL, not its -pooler hostname; include sslmode=require.
read -r -s -p 'Neon direct TLS URL: ' TENBOARDS_DIRECT_DATABASE_URL
```

The user creates a Neon project/database/role in the chosen region. Confirm the
direct URL reaches the intended database, and establish a Neon recovery point or
branch before altering an existing database. Store credentials only in the private
operator session. For an existing database, verify its migration history/schema
and the intended shared fixture upserts before proceeding.

```bash
# Reviewer-only production Hyperdrive creation. The expanded argument is sensitive;
# run privately, with tracing off; do not publish raw command logs.
npx wrangler hyperdrive create tenboards-production \
  --connection-string "$TENBOARDS_DIRECT_DATABASE_URL" --caching-disabled --sslmode require --update-config=false
```

Record the returned **nonsecret** ID. Inspect the Hyperdrive configuration with
`npx wrangler hyperdrive get <REAL_ID>` and confirm caching is disabled. Caching is
unsafe for session revocation; localConnectionString ignores cache settings and
cannot prove this. [Cloudflare documents the cache flag and local limit](https://developers.cloudflare.com/hyperdrive/get-started/).

The reviewer activates the commented HYPERDRIVE slot in source `wrangler.jsonc`
with that real ID, using the task 004 reviewed commit and prescribed sign-off.
Never commit the direct URL, localConnectionString or secret. Merge that commit
through reviewer authority; withhold ordinary deployment until the steps below.

```bash
# Mutating database operations: direct Neon URL only, explicit remote consent.
DATABASE_URL="$TENBOARDS_DIRECT_DATABASE_URL" npm run db:migrate -- --allow-remote
DATABASE_URL="$TENBOARDS_DIRECT_DATABASE_URL" npm run db:seed -- --allow-remote
# Repeatability check on the same intended target; no destructive resets.
DATABASE_URL="$TENBOARDS_DIRECT_DATABASE_URL" npm run db:migrate -- --allow-remote
DATABASE_URL="$TENBOARDS_DIRECT_DATABASE_URL" npm run db:seed -- --allow-remote
unset TENBOARDS_DIRECT_DATABASE_URL

# Generate only the two launch secrets into a private file; values are not printed.
node --input-type=module <<'NODE'
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
writeFileSync(join(process.env.TENBOARDS_OPS_DIR, 'worker-secrets.json'), JSON.stringify({
  BETTER_AUTH_SECRET: randomBytes(48).toString('base64url'),
  BETTER_AUTH_URL: 'https://tenboards.mohanadgh.workers.dev'
}), { mode: 0o600, flag: 'wx' });
NODE

# No DB/auth/provider environment or dotenv files are needed for this build.
npm run build
export TENBOARDS_PRODUCTION_CONFIG='.output/server/wrangler.json'
node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const config = JSON.parse(readFileSync(process.env.TENBOARDS_PRODUCTION_CONFIG, 'utf8'));
assert.equal(config.name, 'tenboards');
assert.equal(config.compatibility_date, '2026-10-23');
assert.ok(config.compatibility_flags.includes('nodejs_compat'));
assert.equal(config.hyperdrive?.length, 1);
assert.equal(config.hyperdrive[0].binding, 'HYPERDRIVE');
assert.match(config.hyperdrive[0].id, /^[a-f0-9]{32}$/i);
assert.notEqual(config.hyperdrive[0].id, '0'.repeat(32));
assert.ok(!config.hyperdrive[0].localConnectionString);
assert.ok(!Object.keys(config.vars ?? {}).some(k => /DATABASE|AUTH|GOOGLE|GITHUB/.test(k)));
console.log('PASS intended production target, real binding and compatibility; values redacted.');
NODE
npx wrangler deployments list --config "$TENBOARDS_PRODUCTION_CONFIG" --json > "$TENBOARDS_OPS_DIR/deployments-before.json"
npx wrangler versions list --config "$TENBOARDS_PRODUCTION_CONFIG" --json > "$TENBOARDS_OPS_DIR/versions-before.json"
npx wrangler secret list --config "$TENBOARDS_PRODUCTION_CONFIG"
```

Record the currently deployed known-good version and inspect it with
`npx wrangler versions view <KNOWN_GOOD_ID> --config "$TENBOARDS_PRODUCTION_CONFIG" --json`.
Before initial cutover it must be the binding-less, secret-less demo. Abort on
unexpected secrets/bindings or an unexplained deployment. Keep resources needed
by rollback; document whether the rollback target is demo or auth-on.

## Atomic code/binding/secret staging, then promotion

**Do not run `wrangler secret put` or `secret bulk` first.** They can deploy a new
live version; a secret on the current binding-less code would return 503. Likewise,
do not deploy a DB binding without auth: that exposes shared data publicly.
Use one upload that contains code, the real binding and both secrets. Cloudflare
supports `--secrets-file` on versions upload; omitted secrets are preserved, which
is why the prior empty inventory must be verified. [Secret deployment behavior](https://developers.cloudflare.com/workers/configuration/secrets/#upload-secrets-alongside-code).

```bash
# Reviewer-only production VERSION upload: live demo remains unchanged.
npx wrangler versions upload --config "$TENBOARDS_PRODUCTION_CONFIG" \
  --secrets-file "$TENBOARDS_OPS_DIR/worker-secrets.json" \
  --message 'v0.6 complete DB+auth cutover candidate'
# Record the returned full version ID and immutable URL, without secret values.
read -r -p 'Candidate version ID: ' TENBOARDS_CANDIDATE_VERSION
read -r -p 'Candidate immutable origin: ' TENBOARDS_CANDIDATE_ORIGIN
npx wrangler versions view "$TENBOARDS_CANDIDATE_VERSION" --config "$TENBOARDS_PRODUCTION_CONFIG" --json
npm run deploy:check -- "$TENBOARDS_CANDIDATE_ORIGIN"
# Candidate must contain ASSETS + real HYPERDRIVE + exactly the two launch secret names.
# Candidate's configured canonical origin remains production, not its version URL.
# Run no signup there: origin checks intentionally reject a version-origin write.

# Reviewer-only traffic change: switch directly from demo to the complete auth version.
npx wrangler versions deploy "$TENBOARDS_CANDIDATE_VERSION@100%" \
  --config "$TENBOARDS_PRODUCTION_CONFIG" --yes
npm run deploy:check -- https://tenboards.mohanadgh.workers.dev
# Explicit, optional account write; requires deliberate reviewer selection.
npm run deploy:check -- https://tenboards.mohanadgh.workers.dev --auth-roundtrip
```

Do not use a percentage split between old demo and new authenticated code. After
promotion, verify email signup/login/logout, current and other-session revocation,
concurrent distinct users, all app/data guards, shared seeded records, exact origin,
Secure/HttpOnly/Lax cookies, disabled OAuth, limiter persistence/429/recovery, cache
disabled, timezone/hydration and binding-free previews. These are hosted acceptance
checks, not claims from local emulation. Record the exact main revision/version and
redacted evidence before marking task 004 complete.

For later compatible main deploys, keep the existing binding and secret pair intact;
reviewer `npm run deploy` is then valid. Secret rotations/OAuth changes must stage
compatible code/bindings/secrets together using the same versions workflow.

## Deployment checker and retained test accounts

`npm run deploy:check -- <origin>` sends bounded GET requests only: all four forms,
public Unauthorized, a public 404, signed-out dashboard redirect (inspected, not
followed) and exactly null signed-out session with private/no-store. It rejects
demo/auth-off, 500s, unsafe redirects, malformed sessions and invalid origins.
Each GET has at most two attempts, eight seconds per attempt; POSTs are never
retried. It never forwards cookies to another origin or logs response bodies.
Normal HTTP requests may update the server's rate-limit counters; “read-only” means
no account/business-data mutation is requested.

`--demo` explicitly expects dashboard access and the disabled auth 404, including
`tenboards-preview`. It cannot be combined with `--auth-roundtrip`. The latter
requires HTTPS (loopback exception for tests), keeps random credentials/cookies
only in memory, creates one unique `@example.test` account, signs out, signs back
in, verifies identity and protected access, and signs out again. It reports the
retained account email, including potentially retained accounts after a network
failure. There is intentionally no new public account-delete endpoint.

Reviewer cleanup: use the direct database connection privately, identify exactly
the reported email and its created-at timestamp, then delete **only that disposable
auth_user row** in a transaction after confirming it is the smoke account. Existing
foreign keys cascade its auth sessions/accounts. Never delete directory/sample
users or use a wildcard cleanup against production. Example for psql (credentials
supplied privately, not committed):

```sql
BEGIN;
SELECT id, email, created_at FROM auth_user WHERE email = :'smoke_email';
-- Verify the one reported throwaway identity before this exact-match DELETE.
DELETE FROM auth_user WHERE email = :'smoke_email';
COMMIT;
```

## Rollback and data recovery

Record a known-good compatible version before each promotion. On a failed smoke,
inspect the target version's binding IDs, secret names and schema expectations,
then the reviewer can run:

```bash
npx wrangler rollback <KNOWN_GOOD_VERSION_ID> --config "$TENBOARDS_PRODUCTION_CONFIG" \
  --message 'Revert failed v0.6 deployment'
# Auth-on target: default check. Pre-cutover binding-less demo target: --demo.
npm run deploy:check -- https://tenboards.mohanadgh.workers.dev
```

For the initial cutover fallback, run that final check with `--demo` only after
confirming the selected prior version has neither DB binding nor auth secret.
Never construct a hybrid version with auth secret/no binding or DB/auth-off. An
older version with a different auth secret may invalidate sessions; document that
tradeoff. Future rollback should prefer the last known-good auth-on version.

`wrangler rollback` does not reverse Neon migrations, undo seed upserts, restore
accounts or restore deleted external resources. All shipped migrations here are
additive, but assess compatibility each time. Use the previously verified Neon
recovery point/branch or backup for data recovery as a separate reviewer operation;
stop dependent writes and obtain the appropriate data-recovery approval before
replacing live data. [Cloudflare rollback resource constraints](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

Keep the private secret file available only as long as the operation requires;
store the production secret in the approved private secret store, then remove the
temporary file/directory. Never commit it. Finalize task 004/README/CHANGELOG,
bump package metadata to 0.6.0, create the signed-off release commit/tag and publish
v0.6.0 only after reviewer hosted acceptance. Tasks 001–003 do not perform release.

## Optional OAuth later

Launch is email/password-only with open signup and shared template data. There is
no tenancy or per-user business-data ownership. Later, register Google/GitHub apps
with callbacks `https://tenboards.mohanadgh.workers.dev/api/auth/callback/google`
and `/api/auth/callback/github`. Stage complete GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET
or GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET pairs with the existing auth secret/base
URL and binding; incomplete pairs remain hidden. Verify real consent/denial flows
on the canonical origin and both auth variants before considering them enabled.
Keep preview inventories empty. See [auth boundaries and limiter limitations](auth.md).
