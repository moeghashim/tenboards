# tenboards — PLAN.md

> Canonical contract. When anything downstream conflicts with this file, the **Decisions log** wins.
> Do not overwrite or regenerate this file; edit in place and call out the diff.

## 1. Brief

**tenboards** is an upgraded, MIT-licensed admin dashboard template built on TanStack Start + shadcn/ui. It forks the full [arhamkhnz/tanstack-shadcn-admin-dashboard](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard) ("Studio Admin") and makes it a better template: first a complete **design upgrade** (new design system, refined product-UI aesthetic, rebuilt theme presets, redesigned shell, every screen restyled), then a real backend (Postgres + Drizzle, Better Auth) that still falls back to a zero-config **demo mode**, deployed on Cloudflare. Audience: developers who clone it as a starter for SaaS/admin products.

## 2. References

| From Studio Admin (upstream) | tenboards treatment |
|---|---|
| Full source tree (TanStack Start, React 19, Vite 8, Tailwind v4, shadcn on Base UI, Zustand, RHF, Zod, TanStack Table, Recharts, Biome, Husky) | Imported wholesale in one commit (v0.1 task 1), then modified |
| Colocation route architecture (`src/routes/(main)/…/-components`) | Kept as-is |
| All screens (10 dashboards, legacy v1 variants, mail, chat, calendar, kanban, invoice, file manager, products, users, roles, profile, auth ×4) | **All kept**, all restyled |
| Preferences system (theme mode, presets, font registry, sidebar variant/collapsible, content width) | Kept; presets rebuilt on new tokens |
| Presets Tangerine / Neo Brutalism / Soft Pop | Replaced by new presets designed on tenboards tokens |
| "Studio Admin" branding | Replaced by tenboards brand everywhere |
| Mock data | Kept as the demo-mode data source (v0.4) |

**License**: upstream is MIT (© 2026 Mohammed Arham Khan). Keep the original LICENSE notice, add a tenboards copyright line, credit upstream in README. **No upstream remote**; clean break after import.

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | TanStack Start + React 19 + TypeScript (as upstream) | Already latest; fork everything |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI primitives) | Upstream; tokens redefined in v0.1 |
| Fonts | Geist Sans + Geist Mono default; existing font registry kept | Refined product-UI feel |
| Icons | lucide-react | Upstream |
| Charts | Recharts + shared chart-theme module (v0.2) | Consistent chart styling across boards |
| State / forms / tables | Zustand, React Hook Form + Zod, TanStack Table | Upstream |
| Lint / format | Biome, Husky + lint-staged | Upstream |
| Package manager / runtime | npm, Node 22+ | Zero dependency churn on import |
| Visual QA | Playwright screenshot script (v0.1) | Before/after evidence per PR |
| Database (v0.4) | Postgres via Drizzle ORM, hosted on Neon | Locked by user |
| Auth (v0.5) | Better Auth (Drizzle adapter) | Locked by user |
| Deploy (v0.6) | Cloudflare Workers via Nitro preset; Neon through Hyperdrive | Locked by user |

## 4. Repo layout

Upstream layout is kept. Additions:

```
tenboards/
├── PLAN.md                 # this contract — never overwritten by agents
├── AGENTS.md               # dev-process rules (upstream AGENTS.md merged in)
├── dev/
│   └── milestones/
│       └── v0.1-design-system-shell/   # one .md per task
├── scripts/
│   └── screenshots.ts      # Playwright visual capture (v0.1)
├── src/
│   ├── styles/
│   │   ├── styles.css      # tenboards tokens (color/type/space/radius/shadow/motion)
│   │   └── presets/        # rebuilt presets
│   ├── components/brand/   # logo mark + wordmark
│   ├── lib/charts/         # shared chart theme (v0.2)
│   ├── server/db/          # Drizzle schema, client, seed (v0.4)
│   └── lib/auth/           # Better Auth (v0.5)
└── … upstream tree unchanged otherwise
```

## 4a. Local checkout

Local working copy: `/Users/moeghashim/tenboards` (git `main`, remote `origin` → github.com/moeghashim/tenboards). All implementation happens here or in worktrees of it.

## 5. Commands surface

Upstream scripts kept (`dev`, `build`, `preview`, `check`, `check:fix`, `generate-routes`, `generate:presets`). Added:
- `npm run screenshots` — capture every route in light/dark × desktop/mobile to `screenshots/` (gitignored).
- `npm run typecheck` — `tsc --noEmit`.
- v0.4+: `db:generate`, `db:migrate`, `db:seed`.

## 6. Onboarding flow

1. `git clone` → `npm install` → `npm run dev` → app runs at :3000 in **demo mode** with no env vars.
2. (v0.4+) set `DATABASE_URL` → `npm run db:migrate && npm run db:seed` → real data.
3. (v0.5+) set `BETTER_AUTH_SECRET` (+ OAuth keys optional) → real login.

## 7. Design upgrade spec (v0.1–v0.3)

**Direction: Refined product UI** (Linear / Vercel register). Distinct from stock shadcn neutral but professional.

- **Type**: Geist Sans/Mono; defined type scale (e.g. 12/13/14/16/20/24/30) with tight tracking on headings, tabular numerals for all metrics.
- **Color**: neutral-first palette with one accent; semantic tokens (bg, surface, surface-raised, border, border-strong, text, text-muted, accent, success, warning, danger, info) in light + dark. Every pair WCAG AA.
- **Depth**: crisp 1px borders, subtle layered shadows, restrained radius scale.
- **Density**: tighter, data-dense cards and tables; consistent KPI card component.
- **Motion**: short, purposeful transitions (150–200ms) via tokens; respect `prefers-reduced-motion`.
- **Shell**: redesigned sidebar (grouped IA, active states, collapsible/icon), header, ⌘K command palette across all routes, redesigned layout-settings panel.
- **Sidebar style (locked reference: `docs/design-refs/sidebar-reference.png`)**: floating rounded sidebar panel (large radius, soft shadow, 1px hairline border) inset from the page edge on a slightly off-white canvas. Top: workspace avatar tile + name, collapse toggle at right. Below: full-width search pill with `⌘K` kbd chip (opens the command palette). Flat list of primary items (outline lucide icons ~18px, regular-weight labels, generous ~40px row height, no group headings for primary items); active/hover = soft gray filled pill with large radius, no accent bar. Expandable items use a trailing chevron. Secondary collapsible sections ("Pinned", "Recent" style) with muted small label + chevron toggle, items may carry a colored icon. Bottom pinned: a promo/status card (bordered, with progress bar) and a footer row with Settings + small icon-only actions (help/docs/feedback). Map upstream nav into this: Dashboards and Pages become collapsible sections. Collapsed-icon mode and mobile sheet must keep the same visual language. Dark mode equivalent derived from tokens.
- **Design tooling**: implementing agent uses the **Impeccable** skill (installed globally for Claude + Codex) — run `impeccable context`, `/impeccable init` (PRODUCT.md) and `/impeccable document` (DESIGN.md) in v0.1, then follow its craft floor on every UI edit. Mode = **Operate**. `PRODUCT.md` and `DESIGN.md` live at repo root; on conflict, this PLAN wins.
- **Presets**: customizer kept; old presets replaced with new ones built only from tokens.
- **Brand**: SVG mark + "tenboards" wordmark; favicon + OG image; remove all "Studio Admin".
- **Coverage**: every existing screen restyled; none removed.

## 8. Phased roadmap

| Version | Scope |
|---|---|
| **v0.1** | Import upstream + rebrand; **live preview URL on Cloudflare Workers (demo mode, task 2)**; Impeccable PRODUCT.md/DESIGN.md; design system/tokens; rebuilt presets; app shell (sidebar per reference, header, ⌘K, settings panel); screenshot script |
| **v0.2** | Restyle all dashboards (Default, CRM, Finance, Analytics, Productivity, E-commerce, Academy, Logistics, Infrastructure, Patient Monitoring, legacy v1) + shared chart theme |
| **v0.3** | Restyle app pages: mail, chat, calendar, kanban, invoice, file manager, products, users, roles, profile, auth, error/404/unauthorized |
| **v0.4** | Drizzle + Neon data layer with demo-mode fallback |
| **v0.5** | Better Auth |
| **v0.6** | Production-ready template: Workers runtime for Hyperdrive → Neon, adopter deploy runbook, rate limiting, isolated demo previews; the live demo stays demo (see Decisions log) |
| **v0.7** | AI Assistant page: OpenUI generative UI with a provider picker (Anthropic, OpenAI, xAI, Meta, Google) and recorded zero-config replies |
| **v0.8** | Projects workspace: workspace Home, Projects with nested Board/List/Timeline/Files views in the sidebar; Kanban/Tasks/Calendar/File Manager fold into projects |
| Later | RBAC + multi-tenant, i18n/RTL, real CRUD, tests + CI — each requires its own planning round |

## 9. Confirmed defaults (locked)

1. **Import**: single `chore: import` commit with attribution; no upstream history, no upstream remote.
2. **License**: keep MIT notice, add tenboards copyright line, credit upstream in README.
3. **Package manager / runtime**: npm, Node 22+.
4. **Fonts**: Geist Sans + Geist Mono default; registry kept.
5. **Icons/charts**: lucide-react, Recharts; shared chart-theme module in v0.2.
6. **Brand**: SVG mark + wordmark replaces all "Studio Admin".
7. **Accessibility**: all token pairs WCAG AA in light & dark; `prefers-reduced-motion` respected.
8. **Visual QA**: Playwright screenshot script in v0.1; every PR includes before/after screenshots (light/dark × desktop/mobile).
9. **Workflow**: protected `main`, one PR per task, Conventional Commits, Claude review on every PR; Claude squash-merges after approval (delegated by user 2026-10-23).
10. **Implementer**: GPT-6-Astra via Codex (reasoning: high). Planner/reviewer: Claude Opus 5.5.

## 10. Decisions log

| Decision | Value | Source |
|---|---|---|
| Project direction | Better template (not a product, not a pure rebrand) | Locked by user |
| Starting point | Fork everything from upstream | Locked by user |
| Upstream relationship | Clean break; no upstream remote | Locked by user |
| First focus | Design upgrades before backend work | Locked by user |
| Visual direction | Refined product UI (Linear/Vercel style) | Recommended, accepted |
| Design scope | Everything: tokens, shell, dashboards, app pages (split v0.1–v0.3) | Locked by user |
| Screen catalog | Keep all screens, restyle every one | Locked by user |
| Theming | Keep customizer; rebuild presets on new tokens | Recommended, accepted |
| Data | Postgres + Drizzle (v0.4) | Recommended, accepted |
| No-DB mode | Demo-mode fallback on mock data when `DATABASE_URL` unset | Recommended, accepted |
| Auth | Better Auth (v0.5) | Recommended, accepted |
| Deploy | Cloudflare Workers + Neon via Hyperdrive (v0.6) | Locked by user |
| Sidebar style | Floating rounded panel per `docs/design-refs/sidebar-reference.png` (see §7) | Locked by user |
| Design skill | Impeccable (global install) used for all UI work; mode Operate; PRODUCT.md + DESIGN.md at root | Locked by user |
| Live preview | From v0.1: demo mode deployed to Cloudflare Workers (`tenboards.<account>.workers.dev`) via Nitro `cloudflare-module` preset + `wrangler deploy`; redeployed from `main` after each merge; per-PR preview via `wrangler versions upload` preview URL | Locked by user |
| Merge authority | Delegated by user to Claude (reviewer) on 2026-10-23: Claude squash-merges approved PRs and rebases stacks; implementer still never merges | Locked by user |
| Inherited hydration errors | Waived for v0.1; fixing React #418 on Calendar, Finance, Finance V1, Invoice, Patient Monitoring, Productivity, Auth V2 login/register is a required acceptance item in the v0.2/v0.3 task restyling each route | Locked by user |
| README upkeep | Every PR that changes user-visible behavior, commands, routes, screens, setup, deploy, or status updates README.md in the same PR; reviewer blocks PRs that leave README stale | Locked by user |
| Releases | On each milestone close the reviewer bumps package.json to vX.Y.0, tags it, and publishes a GitHub Release with notes from that CHANGELOG section (v0.1.0, v0.2.0 published 2026-10-23) | Locked by user |
| Local checkout | `/Users/moeghashim/tenboards`, remote `origin` = moeghashim/tenboards | Locked by user |
| v0.4 data scope | Everything: every app page **and** every dashboard (incl. legacy v1) reads through the data layer; read-only (real CRUD stays deferred) | Locked by user 2026-10-23 |
| v0.4 database host | Build and verify against local Postgres (Docker Compose, Postgres 17); Neon `DATABASE_URL` added by the user later, at the latest in v0.6. Production stays in demo mode until v0.6 | Locked by user 2026-10-23 |
| v0.4 driver | `drizzle-orm` + `postgres` (postgres.js) — one driver for local Postgres, Neon direct and Hyperdrive (v0.6); `drizzle-kit` for SQL migrations committed under `src/server/db/migrations/` | Reviewer decision |
| v0.4 data-source rule | `DATABASE_URL` unset → demo source (existing fixtures), zero config. Set → database source. Optional `DATA_SOURCE=demo` forces demo. A configured but unreachable/unmigrated database is a visible error, never a silent fallback to demo | Reviewer decision |
| v0.4 access pattern | Components stop importing fixtures directly. Each domain exposes typed read functions in `src/server/data/<domain>.ts` with a demo and a db implementation behind one interface; routes load through TanStack Start server functions in route loaders. Fixtures remain the single seed source, so `db:seed` reproduces demo output exactly; a parity script proves demo ≡ db per read function | Reviewer decision |
| v0.4 modelling | Normalized entity tables for lists/tables/boards (users, roles, products, invoices, orders, events, files, mail, chat, tasks…); aggregate chart series without a natural entity go in a typed metric-points table. No whole-fixture JSON blobs. Purely simulated client signals (e.g. live waveforms) stay computed client-side | Reviewer decision |
| v0.5 sign-in methods | Email + password always available when auth is on; Google and GitHub OAuth each enabled only when their `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` or `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` pair is set, and their buttons are hidden otherwise. In demo mode the auth screens stay visual-only as today (Google and GitHub buttons decorative) | Locked by user 2026-10-24 |
| v0.5 auth-mode rule | Auth is on only when `BETTER_AUTH_SECRET` is set **and** the data source is db (v0.4 rule). No secret → demo mode, everything open, zero config. Secret set without a db source → explicit startup/config error, never a silent open app. `BETTER_AUTH_URL` sets the base URL; secrets never reach the browser | Reviewer decision |
| v0.5 protection | When auth is on, every app route (all dashboards, app pages, standalone `/mail` and `/chat`) requires a session and redirects signed-out users to login with a validated same-origin `redirect` path; auth screens, `/unauthorized` and error/404 pages stay public. Server functions that return app data enforce the session too, so the guard is not cosmetic | Locked by user 2026-10-24 (scope); enforcement detail reviewer decision |
| v0.5 account flows | Sign up, sign in (with remember me), sign out, profile edits (name, change password for credential accounts) and an active-sessions list with revoke. Out of scope: forgot/reset password, email verification, 2FA, RBAC, orgs, admin user management | Locked by user 2026-10-24 |
| v0.5 auth screens | Auth V1 and V2 login/register both submit to Better Auth through the shared form components; the shell header shows the signed-in user and a working sign-out in place of demo accounts | Locked by user 2026-10-24 |
| v0.5 implementation | `better-auth` with its Drizzle adapter on the existing postgres.js client; auth tables in committed migrations, named so they never collide with the v0.4 demo `users`/directory tables, which stay unchanged. Auth state is read through Better Auth server APIs and TanStack Start server functions. Production stays in demo mode with no auth secret until v0.6 | Reviewer decision |
| v0.6 production host | Production stays on the Cloudflare Workers URL `tenboards.mohanadgh.workers.dev`; no custom domain in v0.6. `tenboards.pages.dev` was considered and dropped because Cloudflare now routes new Pages projects to Workers, and getting a pages.dev URL means forcing the legacy Pages product | Locked by user 2026-10-24 |
| v0.6 database provisioning | Superseded 2026-10-24 by the template-readiness row below. Originally: the user supplies a Neon direct URL at cutover and the reviewer provisions production | Superseded |
| v0.6 production mode | Superseded 2026-10-24 by the template-readiness row below. Originally: the live Worker runs db+auth with open sign-up | Superseded |
| v0.6 template readiness | tenboards is a template, so no project-owned Neon database is provisioned. The live Worker stays a zero-config demo. v0.6 is done when an adopter can follow `docs/deploy.md` to connect their own Neon project through Hyperdrive (caching disabled), migrate and seed it, set the auth secrets, and promote a complete db+auth version in one step, using generic placeholders rather than this repo's Worker URL. Task 004 changes from a reviewer cutover to adopter-facing readiness: generalized docs, a helper script that prepares and validates the deployment, and README guidance. The hosted Hyperdrive→Neon path is verified locally in workerd only; this is stated plainly in the docs | Locked by user 2026-10-24 ("This is a template. Prepare it to the point to use a real database") |
| v0.6 OAuth | Production is email + password only. Google and GitHub stay hidden until their key pairs are added as Worker secrets later; docs explain how | Locked by user 2026-10-24 |
| v0.6 runtime | postgres.js runs in workerd with `nodejs_compat`. A `HYPERDRIVE` binding's connection string wins over `DATABASE_URL`. Database clients are scoped per request on Workers, because Workers cannot reuse I/O across requests, while Node dev keeps its pooled client. Hyperdrive query caching is disabled so session and auth reads are never stale. The per-request auth-storage check is memoized per isolate once it succeeds | Reviewer decision |
| v0.6 previews | PR previews must never reach production data or secrets. Implementer previews deploy to a separate demo-only Worker, `tenboards-preview`, with no Hyperdrive binding and no auth secret, replacing `wrangler versions upload` on the production Worker, whose versions share production bindings and secrets | Reviewer decision |
| v0.6.1 legacy removal | Remove the sidebar "Legacy" group and its four V1 dashboards (Default V1, CRM V1, Finance V1, Analytics V1) and the Auth V1 login/register screens; Auth V2 becomes the only sign-in UI, and all auth redirects, guards and links target `/auth/v2/*`. Old `/dashboard/*-v1` and `/auth/v1/*` URLs permanently redirect to their current equivalents (preserving a validated `redirect` query). Read functions, fixtures, seeds and parity scenarios used only by the removed screens are deleted. Tables used only by them are dropped in a new additive migration, never by editing shipped migrations. Supersedes the "All kept" screen row for these screens. Runs before v0.7 implementation | Locked by user 2026-10-24 (scope); redirects and migration reviewer decision |
| v0.6.2 compact density | The whole template gets about 8–12% more compact. Type, control heights, card and table padding, the sidebar, the header and gaps shrink through shared tokens and primitives (Impeccable, Operate mode), not per-screen overrides. Floors: body/table text ≥ 13px, metadata ≥ 12px, interactive targets ≥ 24px (WCAG 2.2 AA 2.5.8), WCAG AA contrast, and visible focus. Compact becomes the single default; no new density preference. DESIGN.md is updated to match. This supersedes the 12/13/14/16/20/24/30 scale where the new scale differs | Locked by user 2026-10-24 ("slightly smaller or more compact"); exact values reviewer-approved in the PR |
| v0.7 assistant page | New AI Assistant app page, added to the sidebar next to Chat. The existing person-to-person Chat demo stays unchanged. Replies stream as generative UI through OpenUI (`@openuidev/react-lang`, MIT), rendered only from a registry of tenboards' own shadcn/Base UI components, so output matches DESIGN.md. OpenUI's pre-1.0 `react-ui` chat kit is not used | Locked by user 2026-10-24 (page); component approach reviewer decision |
| v0.7 providers | The user picks from Anthropic (Claude), OpenAI, xAI (Grok), Meta (Muse Spark, through Meta's OpenAI-compatible Model API) and Google (Gemini). Each provider is enabled only when its server-side API key is set, and only enabled providers appear in the picker. Default model per provider is configurable by env. Keys never reach the browser | Locked by user 2026-10-24 (provider set); env/picker detail reviewer decision |
| v0.7 zero-config and safety | With no provider key, the Assistant runs on recorded sample replies so the demo works with no setup, the same as other pages. The streaming endpoint runs on Workers, requires a session when auth is on, is rate-limited, caps prompt and output size, and treats model output as untrusted: it renders only registry components with validated props, no raw HTML, scripts or arbitrary URLs. This repo's live demo stays on recorded replies (template-not-provisioned rule). The SDK and provider packages are approved new runtime dependencies, with versions chosen in planning | Reviewer decision |
| v0.8 projects workspace | Full Projects workspace, inspired by the interaction patterns of Gr8r Studio (gr8r-taskmanagement.vercel.app). That repo has no license, so its code, assets, copy and data are never copied: tenboards reimplements the patterns with its own components, tokens and Operate-mode design. Scope: a workspace Home (greeting, KPI row, my tasks, upcoming deadlines, project progress, recent activity); a Projects index; and per-project pages with Overview, Board, List, Timeline and Files views. The sidebar gets a Projects section where each project expands to nested view links (an indented child list with an active state), using the same nested pattern for other expandable groups where it fits. Sample data only through the v0.4 data layer (demo ≡ db parity); read-only, with real CRUD still deferred | Locked by user 2026-10-24 (scope "full Projects workspace") |
| v0.8 page consolidation | The standalone Kanban, Tasks, Calendar and File Manager pages fold into project views (Board, List, Timeline/calendar and Files respectively). Their old URLs permanently redirect to the matching view of the default sample project. Their existing components and data are reused and re-scoped per project, not rewritten from scratch. Mail, Chat, Invoice, Products, Users, Roles and Profile stay as they are | Locked by user 2026-10-24 ("follow the recommendation") |
| v0.7/v0.8 sequencing | Both milestones proceed in parallel: v0.7 (Assistant) and v0.8 (Projects) are planned, implemented and reviewed concurrently on separate branches and worktrees, and each is released when ready. Shared-file conflicts (sidebar items, route catalog, README/CHANGELOG/milestones.json) are resolved at merge time by the reviewer. v0.6.2 compact density merges first, and both rebase onto it | Locked by user 2026-10-24 ("both") |
| v0.8 landing page | Workspace Home (`/dashboard/home`) becomes the app's landing page. `/`, `/dashboard` and `/dashboard/` redirect to Home, and the post-sign-in fallback (used when no validated return destination exists) lands on Home. Validated return destinations still win. `/dashboard/default` stays as the revenue dashboard under Dashboards; existing bookmarks to it keep working. This supersedes the v0.8 milestone README's entry-point proposal. Superseded 2026-10-26 by the "v0.8.1 landing page" row | Superseded |
| v0.8.1 landing page | The Default revenue dashboard (`/dashboard/default`) becomes the app's landing page again, superseding the "v0.8 landing page" row. `/`, `/dashboard` and `/dashboard/` redirect to `/dashboard/default`; the post-sign-in fallback (no validated return destination) and unsafe-return fallback land there; the sidebar brand link and global recovery links (root not-found, root error, Unauthorized, dashboard splat) open it. Validated return destinations still win. Workspace Home stays at `/dashboard/home` with its existing navigation position; Projects pages keep their contextual links to Home. No other navigation changes | Locked by user 2026-10-26 ("I want the homepage to be the default dashboard") |
| v0.9 agent-ready template | Make tenboards easy for coding agents to build on without producing off-system look-alikes. Five tasks, in order: (1) public blocks + kit page, (2) page generators, (3) design guardrails + `verify:page`, (4) adopter agent guide + Agent Skills, (5) shadcn registry + `llms.txt`. The principle: the on-system path is the shortest path, and the off-system path fails a check | Locked by user 2026-10-26 ("add 1-5 of this suggestion to 0.9") |
| v0.9 blocks | Promote the dashboard presentation primitives (`DashboardCard`, `SectionHeader`, `StatCard`, `PageHeader`, chart helpers from `src/lib/charts/theme.tsx`, and a shared data table) into `src/components/blocks/` with stable, typed, documented props. Route code imports blocks; existing screens migrate with no visual change (before/after screenshots identical within tolerance). `src/components/ui/` stays the protected primitive layer. A `/dashboard/kit` page shows every block with live examples and copyable source, listed under a "Developer" sidebar group | Reviewer decision |
| v0.9 generators | `npm run new:dashboard <slug>` and `npm run new:page <slug>` scaffold a route, sidebar item, route-catalog entry and a skeleton composed only of blocks, plus a typed demo read through the v0.4 data layer pattern. Generators are idempotent-safe (refuse to overwrite), validate slugs, and their output passes build/check/typecheck/guardrails unmodified. No new runtime dependency | Reviewer decision |
| v0.9 guardrails | `npm run check:design` (also part of `npm run check`) fails route/block code on: raw color literals (hex, rgb, hsl, oklch), arbitrary Tailwind values for color/size/spacing/typography, direct `recharts` imports outside `src/lib/charts`, and imports that bypass blocks where a block exists (documented allowlist for justified exceptions). `npm run verify:page <route>` screenshots light/dark × desktop/mobile, runs axe accessibility checks and reports console/hydration errors with a nonzero exit on failure. `@axe-core/playwright` is an approved dev dependency (exact pin chosen in the task) | Reviewer decision |
| v0.9 adopter guide and skills | Root `AGENTS.md` becomes adopter-facing: how to build with tenboards (generators, blocks, data layer, guardrails, `verify:page`). Maintainer workflow rules move to `dev/MAINTAINERS.md`, linked from AGENTS.md and CONTRIBUTING.md; upstream implementers must read it. A root `CLAUDE.md` imports `@AGENTS.md`. Skills follow the Agent Skills specification (agentskills.io): canonical copies in `.agents/skills/<name>/SKILL.md` (cross-client convention), mirrored into `.claude/skills/<name>` as committed relative symlinks. Required frontmatter `name` (matches directory, lowercase/hyphen, ≤64) and `description` (what + when, ≤1024); optional `license: MIT`; body < 500 lines with detail in `references/` loaded on demand. Initial skills: `tenboards-build-ui` (dashboards, app pages, KPIs, charts, tables via generators and blocks, with a gotchas section and a verify loop) and `tenboards-connect-data` (typed reads, demo ≡ db parity, migrations/seeds). `npm run check:skills` validates spec conformance and mirror integrity with no new dependency | Reviewer decision |
| v0.9 accessibility follow-up | Task 006 clears the inherited route-specific axe findings that 003's catalog audit logged (V09-003-A screen-specific, B, C, E, F), so `verify:page --all` can serve as a regression gate. 003 itself fixes only shell-level findings, so a new page inside the shell passes `verify:page` | Reviewer decision 2026-10-26 (PR #78 review) |
| v0.9 registry and llms.txt | Publish blocks as a shadcn registry built with the existing `shadcn` package (`registry.json` → static JSON served from the Worker's assets, e.g. `/r/stat-card.json`), so other projects can `npx shadcn add <url>/r/<block>.json`. Ship `/llms.txt` (and `/llms-full.txt`) summarizing the template, blocks, generators, skills and links. Both are static assets on the demo-only Worker; no secrets or bindings | Reviewer decision |
| Deferred | RBAC/multi-tenant, i18n/RTL, real CRUD, tests+CI — not before v0.6, each needs planning | Locked |
| Defaults 1–10 | As listed in §9 | Locked by user ("lock all") |

## 11. Open questions

_None._
