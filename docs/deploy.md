# Deploy with your own database

Connect your fork to Neon through Cloudflare Hyperdrive, then publish a complete
Worker with email/password authentication and shared sample data. Allow about
15 minutes once your Cloudflare and Neon accounts are ready; account setup and
build time can add to that. You need Node 22+, npm and a private Bash terminal.

This repository's own live demo intentionally stays in demo mode.

The Hyperdrive→Postgres runtime path is verified **locally in workerd only**.
Hosted Neon TLS/pooling, Cloudflare proxy behavior and remote caching have not
been verified by this project; you verify them for your deployment below.

## Quick path

Replace every `<placeholder>` with your own value. The numbered details below
follow this same order and explain the safety checks.

1. Fork, clone and run `npm ci`; set `name` in `wrangler.jsonc` to `<worker-name>`.
   Log in with `npx wrangler login`. If this Worker is new, create a binding-free,
   secret-free Hello World Worker with that name in the Cloudflare dashboard first.
2. Create a Neon project; copy its **direct**, non-pooled TLS connection URL.
3. Privately run `wrangler hyperdrive create` with `--caching-disabled` (command below).
4. Put the returned nonsecret ID in the source `wrangler.jsonc` HYPERDRIVE binding.
5. Run `db:migrate` and `db:seed` against the direct Neon URL with `-- --allow-remote`.
6. Prepare your clean build and private secrets file:

   ```bash
   set +x
   umask 077
   export TENBOARDS_OPS_DIR="$(mktemp -d "${TMPDIR:-/tmp}/tenboards-deploy.XXXXXX")"
   npm run deploy:prepare -- --name '<worker-name>' \
     --url 'https://<worker-name>.<account-subdomain>.workers.dev' \
     --secrets-file "$TENBOARDS_OPS_DIR/worker-secrets.json"
   ```

7. Inspect your existing version/secret inventory, then follow the helper's printed
   commands: one `versions upload --secrets-file`, inspect/check that candidate,
   and `versions deploy <candidate>@100%` only after it passes.
8. Run `npm run deploy:check -- https://<worker-name>.<account-subdomain>.workers.dev`.
9. Optionally enable OAuth later; keep a compatible rollback version and a separate
   database recovery point.

**Never set secrets on a binding-less live version. Never run your hosted database
with auth off.** Do not use `wrangler secret put`, `secret bulk` or `npm run deploy`
as an intermediate setup step: they can change live traffic before code, binding
and secrets are ready together. Keep automatic deployment disabled during setup.

## 1. Fork and name your Worker

Fork this repository, clone your fork, and install its pinned tooling:

```bash
git clone https://github.com/<your-account>/<your-fork>.git
cd <your-fork>
npm ci
npx wrangler login
```

Change only the `name` field in source `wrangler.jsonc` to your chosen Worker name.
Keep `nodejs_compat`, `workers_dev` and `preview_urls` enabled. Find your account's
workers.dev subdomain in Cloudflare Workers & Pages; your canonical origin will be
`https://<worker-name>.<account-subdomain>.workers.dev`. Social metadata defaults to
`/og.png`; for crawlers requiring an absolute URL, set `APP_CONFIG.meta.image` in
`src/config/app-config.ts` to your origin plus `/og.png`.

The pinned Wrangler requires an existing Worker for `versions upload`. For a new
name, use Cloudflare Workers & Pages → Create application → Hello World, choose
that name and deploy the placeholder **without bindings or secrets**. This only
establishes the Worker; it does not expose database data. Do not attach Hyperdrive
or auth secrets in the dashboard. If the Worker already exists, retain its current
known-good version and inspect its bindings/secrets before changing anything.

Use a private session with `set +x` and `umask 077`. Never paste credentials into
Git, PRs, chat, shell history, screenshots or public logs. Wrangler errors may
include configuration details; inspect logs privately and share redacted facts.

## 2. Create Neon and copy its direct URL

Create your Neon project, database and role in your chosen region. In its Connect
dialog disable connection pooling and copy the direct Postgres URL, including
`sslmode=require`. Do not use the `-pooler` hostname. Before changing an existing
database, verify its migration history/schema and create a recovery point or Neon
branch; seeding upserts the template's shared sample records.

Read the URL without echoing it or putting it in shell history:

```bash
set +x
umask 077
read -r -s -p 'Neon direct TLS URL: ' TENBOARDS_DIRECT_DATABASE_URL
```

## 3. Create Hyperdrive with caching disabled

```bash
npx wrangler hyperdrive create '<worker-name>-database' \
  --connection-string "$TENBOARDS_DIRECT_DATABASE_URL" \
  --caching-disabled --sslmode require --update-config=false
npx wrangler hyperdrive get <hyperdrive-id>
```

The expanded connection argument is sensitive; run this privately and do not
publish raw command logs. Confirm the returned configuration has caching disabled:
query caching is unsafe for sessions and revocation. Local emulation ignores the
remote cache setting. See [Cloudflare's Neon setup](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/neon/)
and [Hyperdrive configuration](https://developers.cloudflare.com/hyperdrive/get-started/).

## 4. Add the binding ID to source configuration

Replace the commented slot in `wrangler.jsonc` with the real 32-hex ID:

```jsonc
"hyperdrive": [{ "binding": "HYPERDRIVE", "id": "<hyperdrive-id>" }]
```

Add the separating comma after `preview_urls`. The ID is nonsecret and may be
committed. Never commit the connection URL, secrets or `localConnectionString`.
Do not put `DATABASE_URL` in Worker secrets or DB/auth/provider values in `vars`;
the binding supplies the runtime connection. Keep OAuth pairs absent for launch.

## 5. Migrate and seed directly

```bash
DATABASE_URL="$TENBOARDS_DIRECT_DATABASE_URL" npm run db:migrate -- --allow-remote
DATABASE_URL="$TENBOARDS_DIRECT_DATABASE_URL" npm run db:seed -- --allow-remote
unset TENBOARDS_DIRECT_DATABASE_URL
```

Remote commands require explicit opt-in, a direct URL and TLS. They reject known
pooling endpoints; do not migrate through Hyperdrive. Repeating both commands is
safe: migrations track history and seeds transactionally upsert fixtures without
resetting schemas or adding default auth accounts. Existing auth identities stay
separate from sample directory users. Verify the intended database before each
run; auth grants access to shared data, not tenancy or per-user business ownership.

## 6. Prepare the build and secrets

Run the `deploy:prepare` command in the quick path from your repository root.
Move local `.env*` and `.dev.vars*` files outside the repository first (keep
`.env.example`). The helper filters inherited environment variables, rejects
local dotenv/dev-vars inputs and builds without credentials. It checks the
**generated** `.output/server/wrangler.json` against `--name`, requires
`nodejs_compat` and exactly one HYPERDRIVE binding with a nonzero 32-hex ID, and
rejects `localConnectionString` and DB/auth/provider vars. It cannot verify that
an ID exists or that remote caching is disabled; that is step 3.

`--url` is required and must be your exact public HTTPS origin. With
`--secrets-file`, the helper creates a new file outside the repository with mode
0600 containing a random `BETTER_AUTH_SECRET` and your `BETTER_AUTH_URL`. It never
prints the secret values, follows no existing destination symlink, and refuses to
overwrite a file. Its parent directory must already exist. The helper contacts
neither Cloudflare nor a database; it only builds, validates and prints next commands.

On later deployments, **omit `--secrets-file` to build/validate without generating
new secrets** and use your existing private file in the upload command. Do not
rotate your auth secret accidentally. Store it in your private secret manager;
remove the temporary file when you finish. A new secret can invalidate sessions.

Always select `.output/server/wrangler.json` for the following commands; Nitro
provides the entry, assets and module settings. Never hand-edit generated output
or use root `wrangler.jsonc` as the deployment entry. Prepare afresh after any
source change or preview build.

## 7. Upload one complete version, check it, then promote

Record your known-good version before proceeding:

```bash
export TENBOARDS_DEPLOY_CONFIG='.output/server/wrangler.json'
npx wrangler deployments list --config "$TENBOARDS_DEPLOY_CONFIG"
npx wrangler versions list --config "$TENBOARDS_DEPLOY_CONFIG"
npx wrangler secret list --config "$TENBOARDS_DEPLOY_CONFIG"
npx wrangler versions view <known-good-version-id> --config "$TENBOARDS_DEPLOY_CONFIG" --json
```

For first setup, the existing placeholder/demo must have no database binding or
secrets. Abort if inventories are unexpected. Later, preserve the existing auth
secret pair and compatible binding. Secrets omitted from an upload file are
preserved, so inspect the prior inventory rather than assuming it is empty.
[Cloudflare documents atomic code/secret upload](https://developers.cloudflare.com/workers/configuration/secrets/#upload-secrets-alongside-code).

```bash
npx wrangler versions upload --config "$TENBOARDS_DEPLOY_CONFIG" \
  --secrets-file "$TENBOARDS_OPS_DIR/worker-secrets.json"
read -r -p 'Candidate version ID: ' TENBOARDS_CANDIDATE_VERSION
read -r -p 'Candidate immutable origin: ' TENBOARDS_CANDIDATE_ORIGIN
npx wrangler versions view "$TENBOARDS_CANDIDATE_VERSION" --config "$TENBOARDS_DEPLOY_CONFIG" --json
npm run deploy:check -- "$TENBOARDS_CANDIDATE_ORIGIN"
```

Use the full version ID and immutable URL returned by Wrangler. Confirm the
candidate has ASSETS, your real HYPERDRIVE ID and exactly the two launch auth secret
names, with no OAuth or direct DB URL. The candidate uses your **canonical** origin
for auth, not its version URL; do not run signup or `--auth-roundtrip` on the
candidate origin. Version URLs share bindings and data; they are not isolated PR
previews. Stop if any check fails. After success, promote the whole version:

```bash
npx wrangler versions deploy "$TENBOARDS_CANDIDATE_VERSION@100%" \
  --config "$TENBOARDS_DEPLOY_CONFIG" --yes
```

Do not split traffic between a demo and authenticated code. Never create a hybrid
with auth/no binding (503) or binding/no auth (public data). Keep code, binding and
both auth secrets together, including later rotations or OAuth additions.

## 8. Check your live deployment

```bash
npm run deploy:check -- 'https://<worker-name>.<account-subdomain>.workers.dev'
# Optional explicit account write, on the canonical origin only:
npm run deploy:check -- 'https://<worker-name>.<account-subdomain>.workers.dev' --auth-roundtrip
```

The default check sends bounded GETs to all four auth forms, public Unauthorized
and 404 pages, the signed-out dashboard redirect and the null private/no-store
session endpoint. It rejects demo/auth-off, unsafe redirects, malformed sessions
and server errors, follows no cross-origin redirects and replays no cookies.
GETs have at most two attempts, eight seconds each; POSTs are never retried.
Requests can update rate-limit counters, but default smoke requests no account or
business-data writes. `--demo` explicitly selects demo expectations and cannot be
combined with `--auth-roundtrip`.

The optional round-trip keeps random credentials/cookies in memory, signs up,
signs out, signs in, checks identity/protected access and signs out again. It
reports a retained unique `@example.test` email, also after an ambiguous network
failure. To clean up, connect privately to your direct database, verify that exact
email and creation time, then delete **only that disposable auth_user row** in a
transaction. Foreign keys cascade its auth accounts/sessions; never delete sample
users or run wildcard cleanup. There is no public account-delete endpoint.

```sql
BEGIN;
SELECT id, email, created_at FROM auth_user WHERE email = :'smoke_email';
-- Confirm this is the one reported disposable account before deleting.
DELETE FROM auth_user WHERE email = :'smoke_email';
COMMIT;
```

Also verify signup/login/logout, current/other-session revocation, concurrent
users, protected app/data access, seeded records, exact origin, Secure/HttpOnly/Lax
cookies, hidden OAuth, cache disabled and a separate binding-free PR preview.
Inspect light/dark desktop/mobile pages for console/hydration errors. Exercise
limiter saturation and deliberate database failures only on isolated local data.
Record your version/revision and redacted results; local tests cannot establish
hosted pooling, TLS, cache or proxy behavior for you.

## 9. Optional OAuth, then rollback and recovery

Launch uses email/password with open signup. To enable providers later, register
Google/GitHub apps with callbacks
`https://<worker-name>.<account-subdomain>.workers.dev/api/auth/callback/google`
and `https://<worker-name>.<account-subdomain>.workers.dev/api/auth/callback/github`.
Add complete `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` or
`GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` pairs to your private secrets file,
retaining the existing auth secret, URL and binding. Repeat the complete version
upload/check/promotion workflow. Incomplete pairs remain hidden. Verify real
consent/denial flows on your canonical origin and both auth variants. See
[auth boundaries and limiter limitations](auth.md).

Before every promotion, retain a compatible known-good version and verify its
binding IDs, secret names and schema expectations. If smoke fails:

```bash
npx wrangler rollback <known-good-version-id> --config "$TENBOARDS_DEPLOY_CONFIG" \
  --message 'Revert failed deployment'
npm run deploy:check -- 'https://<worker-name>.<account-subdomain>.workers.dev'
```

Prefer an auth-on rollback. If returning to an older demo, first confirm it has
neither binding nor auth secret, then check with `--demo`. For an initial Hello
World placeholder, verify its original response manually; it cannot pass the
application checker. A different auth secret may invalidate sessions. Never
construct a partial auth/binding rollback.

Worker rollback does **not** reverse migrations, seed upserts or deleted external
resources. Keep needed resources; assess schema compatibility even though shipped
migrations are additive. Restore from your verified Neon recovery point/branch or
backup as a separate operation; stop dependent writes and obtain your deployment
owner's data-recovery approval before replacing live data. See [Cloudflare rollback
constraints](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

## Local rehearsal and isolated previews

You can rehearse without Cloudflare or Neon credentials. The supplied Docker
service uses Postgres 17 on port 54329. Choose a unique, test-owned database name:

```bash
docker compose up -d
docker compose exec -T postgres createdb -U tenboards tenboards_readiness_example
export DATABASE_URL='postgresql://tenboards:tenboards_local@127.0.0.1:54329/tenboards_readiness_example'
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
node --experimental-strip-types scripts/cutover-order-check.ts # local dry-run only
# Stop test servers, then drop only this test-owned database.
unset DATABASE_URL
docker compose exec -T postgres dropdb -U tenboards tenboards_readiness_example
```

The operations check includes deployment-preparation validation, remote opt-in/TLS
rejection without remote connections, repeated migrations/seeds in its own fresh
Docker database, read-only/account smoke and incomplete deployment rejection.
It drops its own database. Node auth and parity tests remain local-only.

Run `npm run dev` without DB/auth configuration and smoke `/dashboard/default`;
`npm run screenshots -- --routes /dashboard/default` captures its four states.
For local Workers, `npm run worker:dev -- --binding` selects `--env local --local`
and an ignored Docker connection; it never uses remote dev.

PR uploads use only `npm run preview:deploy -- --preview-alias pr-NNN` and its
separate demo-only `tenboards-preview` Worker, with ASSETS and no bindings/secrets.
Its guarded config deliberately bypasses your deployment bindings. Keep its remote
inventory empty of secrets and DB access; a version URL of your database Worker
is not a safe substitute. See [contributor rules](../CONTRIBUTING.md).

## Optional adopter Assistant configuration

See [Assistant setup and limits](assistant.md). The repository demo and previews must have no AI keys. The preview guard rejects all five provider keys, model overrides and `ASSISTANT_ORIGIN`, including blank caller variables; its clean build strips them and remote inventory stays ASSETS-only.

For your own existing DB/auth Worker, `deploy:prepare --secrets-file /absolute/private/path/worker-secrets.json` also accepts the documented Assistant keys/models/origin from the private caller environment. They are validated and copied into the exclusive 0600 file, never into build environment, console output or Wrangler vars. `ASSISTANT_ORIGIN`, if supplied, must match the canonical auth URL. The command still only prepares a candidate; it does not upload, provision, migrate or change production. Existing files are never overwritten. Keep provider keys in your secret manager and follow the candidate-review steps above.

Auth-off/no-DB adopters may supply server-only provider bindings to their own deployment without enabling auth or adding a DB. A hosted live configuration needs an explicit HTTPS `ASSISTANT_ORIGIN` and an adopter-owned shared ingress/provider budget if deployed across isolates. The DB/auth-specific preparation helper does not provision this separate mode or establish a global quota. Node uses private process environment. Never run paid acceptance against this repository's live or preview Workers.
