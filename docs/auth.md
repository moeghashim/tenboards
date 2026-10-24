# Optional authentication

Zero configuration remains the first-run path: `npm install && npm run dev` needs no database or auth environment. Workers production and version previews remain demos, with only an ASSETS binding. Do not configure hosted authentication before v0.6.

## Foundation and scope

The foundation uses **better-auth 1.7.12**, its bundled `better-auth/adapters/drizzle` export, the existing lazy postgres.js client and explicit `auth_user`, `auth_session`, `auth_account`, `auth_verification` tables. Migration `0012_watery_sugar_man.sql` appends to the unchanged v0.4 journal. There is no startup migration/seed or seeded auth identity. The v0.4 directory, roles and employee Profile are sample data, not authentication or authorization records.

Layers 001–004 provide HTTP/session/configuration boundaries, real V1/V2 entry flows, protected application routes, signed-in shell identity and account/security controls. Hosted auth remains deferred to v0.6.

## Local setup

1. Start `docker compose up -d` (Postgres 17).
2. Copy `.env.example` to private `.env`; run `npm run db:migrate` then `npm run db:seed`.
3. Generate `openssl rand -base64 32` locally and set `BETTER_AUTH_SECRET` in `.env`. Never publish it, use `VITE_*`, or put a real secret in a screenshot.
4. Set `BETTER_AUTH_URL=http://localhost:3000`, or your exact development origin. When omitted, the development fallback is explicitly `http://localhost:3000`.
5. Restart `npm run dev`. Run migration commands yourself after pulling schema changes.

HTTP is accepted only for localhost/127.0.0.1/IPv6 loopback; otherwise use HTTPS. Credentials, query strings, fragments and paths other than `/` are rejected in the base URL. Only this exact origin is trusted; incoming Host/forwarded headers do not select it. A secret must have at least 32 characters, no surrounding whitespace, and at least 120 estimated bits under the installed library's uniqueness estimate; generate randomness rather than constructing one manually.

## Configuration matrix

| Source / configuration | Secret absent or empty | Nonempty secret |
| --- | --- | --- |
| No DB URL | Open demo, no auth or DB initialization | Configuration error |
| Valid migrated DB URL | Open DB-backed demo, visual auth forms | Auth enabled |
| `DATA_SOURCE=demo`, any DB URL | Forced demo, no DB connections | Configuration error |
| DB URL empty/malformed | Existing visible data failure | Configuration error |
| DB unreachable/unmigrated | Existing visible data failure | Auth service fails closed |
| Unsupported source (`db`, empty, other) | Configuration error | Configuration error |
| Invalid base URL/secret | Optional auth settings ignored | Configuration error |

Nonempty invalid values never fall back to anonymous/demo success. Build and request middleware check configuration. Auth HTTP/session operations additionally check storage readiness; errors discard driver details. `DATA_SOURCE=db` is never supported. Source selection remains the v0.4 rule.

## Providers and callbacks

Email/password is always enabled in auth mode, with an 8–128 character password policy. Optional provider pairs:

| Complete pair | Enabled provider |
| --- | --- |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Google |
| `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` | GitHub |
| Both pairs | Both |
| Neither or a missing/blank half | Only complete providers, otherwise email/password alone |

Register `${BETTER_AUTH_URL}/api/auth/callback/google` and `${BETTER_AUTH_URL}/api/auth/callback/github` with their respective providers (omit a trailing slash on the configured origin). Google uses the library's default OpenID/profile/email scopes; GitHub requests `read:user` and `user:email`. Credentials stay server-side; only enabled booleans are projected to the UI. No live credentials are available for automated verification: dummy pairs test authorize URL/state/callback generation, not a provider consent round-trip. Real-provider round-trip validation requires the operator's own app registration and credentials.

For the default local origin, the exact callbacks are `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/github`. A different port/origin requires matching provider registrations.

## Session and security boundary

`/api/auth/$` forwards GET/POST to Better Auth; disabled mode returns 404 without initializing the auth instance or DB. Library responses preserve Set-Cookie. Server APIs use `tanstackStartCookies` last in the plugin list. Safe bootstrap exposes only mode/provider flags and user ID/name/email; it does not return tokens, hashes or account credentials. Service errors are distinct from a signed-out session.

Cookie cache is explicitly disabled, so session authority is checked against Postgres. The installed library defaults to seven-day sessions, a one-day update interval and one-day fresh-session window. Persistent signup/OAuth and remember-me cookies have Max-Age; `rememberMe:false` creates a session-only token cookie. Browser session restore can retain session cookies. Cookies are HttpOnly, host-only, Path `/`, SameSite=Lax, and Secure for HTTPS (loopback HTTP is the development exception).

CSRF/origin checks are intact. Account linking is disabled; email verification is not enabled, so an unverified address is not proof of ownership. Authentication grants shared template-data access, not RBAC or per-user business-data ownership. Password hashing/verification remains entirely library-owned.

Rate limiting is explicitly enabled in development too: memory storage, 100 requests per 10 seconds plus the library's stricter sensitive-endpoint rules (email sign-in: 3/10 seconds). Without a trusted IP it uses a shared per-path bucket. Local tests do not disable limits; distributed storage and deployment proxy trust belong to v0.6. `auth.api` server calls do not traverse the HTTP limiter; credential mutations should stay on the HTTP client path.

The generic cookie RPC is now limited to validated preference names/values, with fixed seven-day Lax `/` options. Its only non-preference getter is validated `mail_panel_layout`; malformed client layout falls back to the existing default. Unknown/auth cookie names and caller-supplied cookie options are rejected.

## Verification and troubleshooting

`node --experimental-strip-types scripts/auth-config-check.ts` checks configuration/provider decisions, real DB signup/session/signout/cookie semantics, reseed preservation and a forced-demo TCP sentinel. `node --experimental-strip-types scripts/auth-cookie-check.ts` calls the actual HTTP RPCs with hostile cookie names/options and valid UI preferences. Both use the installed Playwright tooling, generated throwaway credentials, and no committed storage state. `DATABASE_URL` may select another explicit local test DB; otherwise the compose URL is used.

Run `npm run data:parity` with the local URL: all 22 v0.4 reads and 130 scenarios remain unchanged. Run `npm run db:generate` to check drift; apply/repeat migrations explicitly. If configuration fails, check the source, private secret and exact origin. If auth storage fails, check Docker availability and migrations. Never fix a DB error by silently selecting demo while a secret is set.

Official references checked against installed APIs: [TanStack integration](https://www.better-auth.com/docs/integrations/tanstack), [Drizzle adapter](https://www.better-auth.com/docs/adapters/drizzle), [cookies](https://www.better-auth.com/docs/concepts/cookies), [sessions](https://www.better-auth.com/docs/concepts/session-management), [rate limits](https://www.better-auth.com/docs/concepts/rate-limit), [Start server routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes) and [middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware). The adapter docs show a separate package; the installed bundled export supports this approved dependency boundary.

## Sign in and return destinations

Both V1 and V2 share the credential forms. Auth-on registration asks for a trimmed name (1–100 characters), email, password (8–128 characters) and matching confirmation. Demo retains the original field set and gives a safe Demo only acknowledgement; it never echoes passwords, submits to auth endpoints or creates a session. Google and GitHub remain decorative in demo; in auth mode only complete configured pairs appear, with no empty provider divider.

Login's initially unchecked **Remember me** explicitly selects a session-only cookie. Checked login, signup and OAuth use the library's persistent seven-day policy described above. Failed submissions retain non-secret input, show safe inline feedback and permit retry; pending actions prevent duplicate submissions. Credential success replaces the document to clear router/user state and revalidate the destination. OAuth follows the library-owned authorize redirect. Provider denial returns to the same supported form variant with safe retry feedback.

A single pure validator accepts only normalized relative application destinations with one leading slash. It rejects absolute/protocol-relative URLs, backslashes, controls, encoded path separators/double encoding, path normalization tricks, and auth/API loops. It preserves legitimate query/hash values, including nested query URLs that are data rather than the navigation target. Invalid/missing values fall back to `/dashboard/default`; unknown app paths go to the public 404. Login/register cross-links and already-signed-in visits use the same validation. Better Auth's supported before hook validates callback/new-user/error destinations again before OAuth state is created; provider state/cookie validation remains library-owned. Credential forms own their one post-success navigation and omit the library's automatic email callback redirect.

`node --experimental-strip-types scripts/auth-redirect-check.ts`, `scripts/auth-flows-check.ts` and `scripts/auth-provider-check.ts` provide adversarial redirect, real-DB browser flow and provider configuration/authorize URL tests. No provider consent or token exchange is claimed. Shared client sign-out returns to canonical `/auth/v1/login` only after server success; the signed-in shell exposes Sign out and Profile.

Error/pending verification: `node --experimental-strip-types scripts/auth-errors-check.ts` checks duplicate registration, network failure/retry, a delayed real request with duplicate-submit prevention, and enabled limiter 429/recovery. It never replaces a server success with a mock.

## Application protection matrix

| Boundary | Rule |
| --- | --- |
| `/`, `/dashboard`, `/dashboard/` | Aliases normalize into the guarded dashboard flow |
| All 14 current/legacy dashboards and all app pages, including Coming Soon | Dashboard ancestor checks the actual request session before loading |
| `/dashboard/mail`, `/dashboard/chat` | Dashboard guard protects each wrapper |
| `/mail`, `/chat` | Each standalone document independently checks its session; same-origin iframe requests share cookies |
| Four auth forms and bare `/auth/v2` | Public; signed-in form visits return to a validated application destination |
| `/unauthorized`, root error/404, dashboard splat | Public; the exact splat renders without the protected shell/account loader |
| `/api/auth/$` | Public dispatcher, with Better Auth's own endpoint/origin/session checks |
| Safe mode/session bootstrap and four preference/layout functions | Public, minimal projection and strict cookie allowlists |
| Account details / session revoke | Current-session projection / strict same-origin owned-ID mutation (see Account & security) |
| All 26 application-data functions across 22 v0.4 domains | Independent `requireSession` before importing/invoking a domain read, including shell accounts and legacy variants |

Auth-on identity is the current session's name/email/initials; demo switching stays demo-only. The menu links directly to Profile’s Account & security tab. A fresh document after sign-out drops router caches; each navigation checks authority again and refocus checks server state. Storage failures surface as failures, never anonymous/demo success. Identity/data responses use `Cache-Control: private, no-store`.

An expired embedded Mail/Chat document moves its same-origin parent to canonical login with the validated wrapper return path. Direct standalone navigation remains protected. The browser-retained fragment is added to the validated return destination after hydration. No auth token is stored in client application state.

`scripts/auth-protection-check.ts` audits every generated visual/HTTP route and callable server function, then exercises anonymous/valid SSR, refresh and client navigation, all direct RPCs with no/valid/tampered/expired/revoked sessions, public system pages, shell sign-out and iframe expiration. Authentication grants access to shared template data; it does not confer directory roles or ownership of sample business records.

## Account & security

`/dashboard/profile?tab=account` is auth-only; demo maps that query to Overview without loading account data. The six sample employee tabs remain separate from **Your sign-in account**. Known Profile tab values are validated; unknown values fall back to Overview. Only the current session supplies identity. Name changes trim to 1–100 characters; email is read-only. The HTTP update-user hook permits only the name field and rejects supplied IDs/email/other fields.

Name/password mutations use Better Auth's HTTP client, retaining library origin checks and HTTP rate limiting. Password changes verify the current password and enforce `revokeOtherSessions:true` server-side, even for a direct request. In 1.7.12 this revokes all old sessions, creates a new current session, and sets its cookie; the UI clears password fields and refreshes sessions. Old credentials fail immediately. The server projects credential capability from account provider metadata; no hash or provider token reaches the account UI. Provider-only accounts have no password/reset controls.

The safe session projection contains ID, bounded plain user-agent description (or an unavailable fallback), creation/expiry and a current-session marker. It contains no bearer token or IP. Better Auth's session-list API requires a session created within the default one-day fresh window. The UI handles `SESSION_NOT_FRESH` with a sign-out then canonical re-login to the account tab, avoiding an already-signed-in redirect loop. Password validation itself uses the library's authoritative-session/current-password boundary.

The custom POST revoke function validates a strict ID-only input, requires an exact configured Origin, checks the actual request session, and resolves the ID within that user's active session list before passing its internal token to Better Auth. Foreign, forged and stale IDs return an unavailable result without a write. Current-session revocation uses library sign-out and the final `tanstackStartCookies` plugin propagates cookie clearing; the client replaces the document. A different browser's next protected route/RPC fails immediately. These custom wrappers do not claim the Better Auth HTTP limiter; they perform their own origin/ownership checks. Identity/session responses are private and no-store.

`scripts/auth-account-check.ts` uses two real users and independent browser contexts for name persistence, ownership/origin rejection, other/current revocation, password rotation, stale/fresh sessions, retry and four-state account/confirmation/error captures. Its provider-only capability fixture uses Better Auth's supported adapter operations on a test-owned identity after credential signup; it does not represent a completed OAuth login. Cleanup deletes only those test-owned users.

## Callable function inventory

The acceptance inventory fails on unclassified route or function additions. The
following application reads each assert the request session before invoking a
domain read; direct CLI parity remains independent of HTTP sessions.

| Route owner | Callable read | Domain |
| --- | --- | --- |
| `/chat` | `loadData` | `chat` |
| `/dashboard/analytics-v1` | `loadData` | `analytics` |
| `/dashboard/crm-v1` | `loadData` | `crm` |
| `/dashboard/default-v1` | `loadData` | `default` |
| `/dashboard/finance-v1` | `loadData` | `finance` |
| `/dashboard/academy` | `loadData` | `academy` |
| `/dashboard/analytics` | `loadData` | `analytics` |
| `/dashboard/calendar` | `loadData` | `calendar` |
| `/dashboard/crm` | `loadData` | `crm` |
| `/dashboard/default` | `loadData` | `default` |
| `/dashboard/ecommerce` | `loadEcommerce` | `ecommerce` |
| `/dashboard/file-manager` | `loadData` | `files` |
| `/dashboard/finance` | `loadData` | `finance` |
| `/dashboard/infrastructure` | `loadData` | `infrastructure` |
| `/dashboard/invoice` | `loadInvoice` | `invoices` |
| `/dashboard/kanban` | `loadData` | `kanban` |
| `/dashboard/logistics` | `loadData` | `logistics` |
| `/dashboard/patient-monitoring` | `loadData` | `patients` |
| `/dashboard/productivity` | `loadData` | `productivity` |
| `/dashboard/products` | `loadCatalog` | `products` |
| `/dashboard/profile` | `loadProfile` | `profile` |
| `/dashboard/roles` | `loadRoles` | `roles` |
| `/dashboard` | `getAccounts` | `accounts` |
| `/dashboard/tasks` | `loadData` | `tasks` |
| `/dashboard/users` | `loadUsers` | `users` |
| `/mail` | `loadData` | `mail` |

`getAccountDetails` adds a 27th protected read with safe account/session projection.
`revokeAccountSession` is the separate POST-only owned-session mutation. Both
independently check server session authority. Five public functions are explicitly
classified: `getAuthState` (minimal bootstrap), `getValueFromCookieServer` (validated
Mail layout), `setValueToCookieServer` (preference allowlist), `getPreferenceServer`
and `getDashboardLayoutServer` (non-sensitive UI preferences). No caller-supplied
identity controls an app read or account mutation.

## Repeatable acceptance

Start the compose Postgres 17 service and run migrations/seed before:

```sh
npm run auth:test
npm run data:parity
node --experimental-strip-types scripts/auth-migration-check.ts
node --experimental-strip-types scripts/auth-bundle-check.ts
npm run check
npm run typecheck
npm run build
```

`auth:test` runs the focused Playwright/HTTP suites sequentially with generated
throwaway credentials and isolated browser contexts. It uses the compose URL by
default, or an explicit local `DATABASE_URL`. Stop another Vite server in the same
checkout before running it; use a separate checkout for concurrent capture servers.
The suite creates an explicitly test-owned empty database for the missing-schema
case; the local test role needs CREATE DATABASE, as the compose role has. It never
resets a shared database. Tests delete only their exact test-owned auth users.

The migration check compares v0.4.0 migration files byte-for-byte, creates fresh and
upgrade test databases, applies/repeats migrations and seed, and runs all 22 reads /
130 scenarios in each. Those test databases remain available for inspection. Fetch
the `v0.4.0` tag in a shallow checkout before running this check. The bundle check
builds with private random sentinels, scans browser/server artifacts without
printing their values, then always restores a zero-env build. It does not deploy.

Auth captures default to `screenshots/v05-005/auth` under the suite; override
`AUTH_EVIDENCE_ROOT` for a private local evidence directory. Never publish storage
state, credentials or logs containing raw auth responses. Original failures and
explicit retries belong alongside final reports; screenshots/logs remain off main.

Manual real-provider validation requires your own provider registration and a
private complete credential pair. Register the exact callback URLs above, initiate
from either form variant, complete consent, and verify the callback returns to the
intended relative app destination with a real session. Repeat denial and sign-out.
Automated dummy-pair tests deliberately stop at the provider authorize redirect.


## Verified security evidence (v0.5 review)

The final `npm run auth:test` report has **486/486 scenarios across 12 suites**:
config 31, cookie allowlist 23, service 5, redirect policy 28, browser return-path 4,
credential flows 30, provider matrix 42, error/rate-limit 5, protection 283,
account 15, demo Profile 8 and security 12. The return-path cases cover V1/V2
pathname, query and fragment through login/register switching and real signup.
The V1 switch link now consumes the same hydrated destination as its form.

| Security requirement | Verified evidence and limits |
| --- | --- |
| Actual cookie attributes | Signup, remember-me, refresh, sign-out and current-session revoke inspect real headers/browser cookies and DB authority. HTTPS canonical configuration emits Secure/HttpOnly/host-only/Path `/`/SameSite Lax cookies; the automated Secure-header test uses loopback HTTP transport and does not claim a TLS deployment test. Cookie caching stays disabled. |
| Exact origins and redirects | Forged-origin credential/account/session writes reject; the custom revoke wrapper rejects missing/foreign origins and supplied identity. Adversarial redirect policy and real provider initiation enforce the canonical callback and library state handling. |
| Rate limiting | Enabled local Better Auth HTTP limiting returns 429 and recovers after its window. General 100/10 seconds and sensitive email sign-in/signup 3/10 seconds are in-memory per process. Custom server API wrappers are not covered by that HTTP limiter; production distribution/proxy policy remains v0.6. |
| Authority and revocation | All 31 protected route cases cover signed-out/valid/expired/revoked SSR, refresh and client navigation. All 27 protected reads cover absent/valid/tampered/expired/revoked direct calls; the separate session mutation checks ownership and exact origin. Password changes cannot opt out of revoking other sessions. |
| Safe output | Minimal identity/session DTOs and SSR responses omit passwords, hashes, tokens and connection strings; private/no-store is asserted. Builds with generated private sentinels are scanned, then restored to zero-env output. Published evidence is scanned separately. |
| UI cookies | 23 allowlist cases reject arbitrary/auth cookie names, invalid values/options and forged direct calls; legitimate preferences remain available. |
| Password and identity policy | Better Auth owns hashing/current-password verification. Email verification and automatic account linking remain disabled; sample employee/directory users are never auth identities. |

Evidence is on [pr-assets/v05-005](https://github.com/moeghashim/tenboards/tree/pr-assets/v05-005),
including original failed runs and explicit retries. No real-provider consent or
hosted database deployment was performed. Workers previews and production remain
demo-only; final review, ordered merges and release belong to Claude Opus 5.5.

Demo regression reconciles 1,824 baseline cases (608 per environment) and 588
supplemental cases across no-env local, DB/auth-off local and Workers. The latter
includes 384 delayed hydration cases on all eight historical routes, both timezones,
and direct/refresh. [Baseline coverage](https://github.com/moeghashim/tenboards/blob/pr-assets/v05-005/coverage.json)
and [supplemental coverage](https://github.com/moeghashim/tenboards/blob/pr-assets/v05-005/supplemental-coverage.json)
retain original failures and explicit passing retries. Authenticated four-state
forms, shell/account states and twelve print PDFs were inspected separately.
