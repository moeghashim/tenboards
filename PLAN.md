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
| **v0.6** | Production Cloudflare setup: Hyperdrive → Neon, secrets, custom domain (base Workers deploy already exists from v0.1) |
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
| Local checkout | `/Users/moeghashim/tenboards`, remote `origin` = moeghashim/tenboards | Locked by user |
| Deferred | RBAC/multi-tenant, i18n/RTL, real CRUD, tests+CI — not before v0.6, each needs planning | Locked |
| Defaults 1–10 | As listed in §9 | Locked by user ("lock all") |

## 11. Open questions

_None._
