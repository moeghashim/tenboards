# Optional authentication

Zero configuration remains the first-run path: `npm install && npm run dev` needs no database or auth environment. Workers production and version previews remain demos, with only an ASSETS binding. Do not configure hosted authentication before v0.6.

## Foundation and scope

The foundation uses **better-auth 1.7.12**, its bundled `better-auth/adapters/drizzle` export, the existing lazy postgres.js client and explicit `auth_user`, `auth_session`, `auth_account`, `auth_verification` tables. Migration `0012_watery_sugar_man.sql` appends to the unchanged v0.4 journal. There is no startup migration/seed or seeded auth identity. The v0.4 directory, roles and employee Profile are sample data, not authentication or authorization records.

Layers 001–002 provide HTTP/session/configuration boundaries and real V1/V2 credential/provider entry flows. App guards and account UI are subsequent layers; do not expose auth-on intermediate layers publicly.

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

`node --experimental-strip-types scripts/auth-redirect-check.ts`, `scripts/auth-flows-check.ts` and `scripts/auth-provider-check.ts` provide adversarial redirect, real-DB browser flow and provider configuration/authorize URL tests. No provider consent or token exchange is claimed. Shared client sign-out returns to canonical `/auth/v1/login` only after server success; the shell entry arrives in 003.

Error/pending verification: `node --experimental-strip-types scripts/auth-errors-check.ts` checks duplicate registration, network failure/retry, a delayed real request with duplicate-submit prevention, and enabled limiter 429/recovery. It never replaces a server success with a mock.
