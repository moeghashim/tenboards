# tenboards

An MIT-licensed dashboard template built with TanStack Start, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui on Base UI.

The full upstream screen catalog and mock data are retained. **v0.1 is merged, deployed and closed**: the design system and shell follow [PLAN.md](PLAN.md). **v0.2 implementation is underway** following [the approved dashboard task breakdown](dev/milestones/v0.2-dashboards/README.md). Current milestone/task status is tracked in [dev/milestones.json](dev/milestones.json). Current screens are demonstrations; database and authentication integrations are later milestones.

## Run locally

Use Node 22+ and npm. No environment variables or database are required.

```sh
git clone https://github.com/moeghashim/tenboards.git
cd tenboards
npm install
npm run dev
```

Open [the default dashboard](http://localhost:3000/dashboard/default).

## Commands

- `npm run dev` — development server on port 3000.
- `npm run build` — production client and server build.
- `npm run preview` — preview the compiled Worker locally with Wrangler.
- `npm run check` / `npm run check:fix` — Biome lint, imports, and formatting.
- `npm run typecheck` — TypeScript (`tsc --noEmit`).
- `npm run generate-routes` — regenerate file-based routes.
- `npm run generate:presets` — regenerate the preset registry.
- `npm run deploy` — build and deploy to the live Workers URL.
- `npm run preview:deploy -- --preview-alias pr-NNN` — build and upload a version preview without changing live traffic.

## Included screens

The 14 dashboard routes are Default, CRM, Finance, Analytics, Productivity, E-commerce, Academy, Logistics, Infrastructure, Patient Monitoring, Default V1, CRM V1, Finance V1 and Analytics V1. Their shared foundation and route-by-route restyles are tracked in [dev/milestones.json](dev/milestones.json) for v0.2.

File manager, products, profile, mail, chat, calendar, kanban, tasks, invoice, users, roles, authentication layouts, coming-soon and error pages are retained for v0.3 restyling. Route-specific components remain colocated under `src/routes/`.

## Provenance and license

Imported from [arhamkhnz/tanstack-shadcn-admin-dashboard](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard) (Studio Admin), revision [`81e5ef1391b68c176154faba0c9ac7b0023ecbaf`](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard/commit/81e5ef1391b68c176154faba0c9ac7b0023ecbaf). Copyright © 2026 Mohammed Arham Khan. The original MIT notice is preserved in [LICENSE](LICENSE), alongside the tenboards copyright. No upstream history or remote is retained.

The upstream contributor guidance is archived at [docs/upstream-AGENTS.md](docs/upstream-AGENTS.md). PLAN.md and its Decisions log govern tenboards. Root [AGENTS.md](AGENTS.md) defines the current contributor workflow and required checks.

## Import validation notes

The unmodified import passed Biome with one existing `noArrayIndexKey` warning in `src/lib/highlighter.tsx`. Its initial TypeScript run found four errors: two unused bindings, a missing package version, and an `unknown` error accessed without narrowing. Task 001 applies narrowly scoped fixes without changing screen designs.

`npm install` reported seven high-severity dependency advisories in the inherited dependency tree. No forced dependency upgrades were applied during the import; details are included in the task PR evidence. These advisories are separate from the build, Biome, and TypeScript checks.

## Cloudflare demo and PR previews

**Live demo:** [tenboards.mohanadgh.workers.dev](https://tenboards.mohanadgh.workers.dev/dashboard/default).

**Integrated shell preview:** [pr-012](https://pr-012-tenboards.mohanadgh.workers.dev/dashboard/default). The version-specific URL is recorded in the task 012 PR; this alias follows subsequent review uploads.

The Worker serves the existing mock-data demo. It has no database, authentication service, or secret bindings. Its only generated binding is `ASSETS` for static files. Production is redeployed from `main` by the reviewer after approved merges. Preview uploads do not change live traffic.

The build uses Nitro's `cloudflare-module` preset. `wrangler.jsonc` owns the Worker name, compatibility date, and public live/preview URL settings. Nitro generates `.output/server/wrangler.json` and `.wrangler/deploy/config.json`, including the server entry, assets binding, module rules, and Node compatibility flag. Do not hand-edit or commit generated output, or pass the root config explicitly to deploy (Wrangler follows Nitro's generated config redirect).

`npm run dev` retains upstream's Node development runtime. Nitro's direct development emulator expects Miniflare 4, while current Wrangler supplies Miniflare 5; forcing that combination fails validation. `npm run build && npm run preview` exercises the compiled Cloudflare Worker with current Wrangler instead. The production preset is therefore selected only for Vite builds. Wrangler is pinned at 4.152.0 for reproducibility.

Run manual deployments using an already authenticated Wrangler session:

```sh
# Reviewer only: after an approved squash merge, from a clean checkout:
git switch main
git pull --ff-only
npm ci
npm run check
npm run typecheck
npm run deploy
```

For each PR, from its branch:

```sh
npm run preview:deploy -- --preview-alias pr-NNN
```

Copy the returned version-specific URL into the PR body. The optional alias gives a reusable URL for that PR; uploading a version does not replace the live deployment. Preview URLs are public demo URLs. No GitHub Actions secrets or automated deployments are configured.

Deployment references: [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare) and [Cloudflare version URLs](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/).

## Visual QA

Install the approved browser tooling once with `npx playwright install chromium`, then run a dev server (`npm run dev`) in another terminal:

```sh
npm run screenshots
npm run screenshots -- --routes /dashboard/default,/auth/v1/login --output screenshots/before
npm run screenshots -- --base-url https://pr-012-tenboards.mohanadgh.workers.dev --output screenshots/after
npm run screenshots -- --list
```

The default captures every retained route in light/dark at desktop 1440×900 and mobile 390×844. `src/navigation/route-catalog.ts` is the shared 38-route inventory, re-exported by `scripts/screenshot-routes.ts` and checked against generated route metadata; missing/stale routes and unknown subsets fail before launch. The dashboard splat uses `/dashboard/capture-not-found` to exercise its not-found state; there are no entity-ID routes needing demo records. Redirect entries are captured at their destination. `--preset` selects a valid preset for the same four-state matrix.

Captures wait for React hydration, fonts, network idle, images, JS chart settling, and stable content. Reduced motion is emulated and screenshot animations are disabled. Console errors, page errors, failed requests, unexpected HTTP status, and capture failures are recorded in `report.json` and cause a nonzero exit. The hydration check uses React's DOM binding marker; revisit it if React's renderer changes. Date-dependent demo data is not frozen, so capture before/after close together and note changing data in reviews.

`screenshots/` is gitignored. Keep all PNGs and reports off main: create a separate worktree from `origin/pr-assets`, copy each task's `before/` and `after/` directories there, commit with the required co-author trailer, and push only that branch. Link images using `https://raw.githubusercontent.com/moeghashim/tenboards/pr-assets/NNN/before/<file>.png` and the corresponding `after/` URL in the PR table. Never add screenshots to an implementation branch. Inspect every submitted capture for blank, incomplete, or mislabeled output.


## Brand assets

The original tenboards mark pairs a solid upright with an open board, reading as “10” at small sizes. `src/components/brand/brand.tsx` supplies the inherited-color mark and wordmark; adjacent visible text or the enclosing link supplies its accessible name. The sidebar uses an explicit home label in collapsed mode. Auth changes replace brand symbols only; form behavior is unchanged.

`public/brand/mark.svg` and `wordmark.svg` are vector masters (the wordmark outlines the bundled SIL-OFL Geist face). `favicon.svg`, ICO/16/32px PNGs, the 180px touch icon, and 192/512px app icons share the same original silhouette. `public/brand/og.svg` is the 1200×630 social-image source for `public/og.png`. PNG/ICO derivatives were rendered locally from these authored vectors, with no stock or third-party logo. Preserve the font package license when redistributing its font files.

Social metadata uses the canonical production `/og.png` URL; the asset becomes live when the reviewer deploys this merged layer. For PR review, inspect `/og.png` on that PR's version URL. Favicons and the manifest use origin-relative URLs and work on version previews.

## Shell usage and acceptance

The floating sidebar keeps a viewport-height panel while long pages scroll. Primary links, collapsible route sections, icon-only collapse, and the mobile sheet share the same navigation. The demo status card counts distinct enabled `/dashboard/*` sidebar pages (25 total) visited since the sidebar mounted; the count resets on reload or when the mobile sheet remounts; it does not represent a subscription, saved progress, or server data.

Open search from the sidebar, the mobile header, or **⌘K / Ctrl+K** on any retained route. Arrow keys choose results; Enter opens a page; Escape closes and restores focus. The shared catalog exposes 34 searchable screens; the remaining four catalog entries cover redirects and the auth layout route. Pressing the shortcut again closes search. Other visible dialogs, alert dialogs, menus, and listboxes retain the shortcut (the mobile navigation sheet excepted); text-field focus alone does not suppress it. The bare `/auth/v2` path is an inherited layout-only screen; its login/register children are the searchable destinations.

Settings in the sidebar or header controls theme (including System), Default/Graphite/Pine/Iris presets, the existing font registry, content width, header behavior, sidebar style, and collapse behavior. Changes persist in the existing seven-day browser cookies, one per preference key, plus the separate sidebar-state cookie. Reset restores Light, Default, Geist, Centered, Sticky, Panel, Show icons, and expanded navigation. Inset also frames the content; every desktop style preserves the reference sidebar. Mobile navigation always uses a sheet.

Shell accessibility checks cover keyboard navigation, named controls, visible focus, palette selection and focus return, settings radio/select operation and focus trapping, mobile sheets, and reduced-motion CSS across all four presets in both modes. Run the supported token-pair contrast audit with:

```sh
node --experimental-strip-types scripts/check-contrast.ts --presets default,graphite,pine,iris --base-url http://localhost:3000
```

Axe is not part of the existing tooling; the acceptance evidence identifies the semantic/keyboard checks actually run. [Task 012 evidence](https://github.com/moeghashim/tenboards/tree/pr-assets/012) holds the complete route matrix, logs, and smoke scripts. [Sidebar/reference comparison](https://github.com/moeghashim/tenboards/blob/pr-assets/008/sidebar-reference-comparison.png) records the locked reference comparison. Captures may contain inherited TanStack development-tool chrome.

Known upstream limitations remain separate from shell acceptance: Patient Monitoring reads a fresh clock during SSR/client rendering and can produce a hydration mismatch on direct navigation. Calendar, Finance, Invoice, Productivity, Finance V1, and Auth V2 login/register also reproduce Workers hydration mismatches on the existing production deployment. The locked decision in [open questions](dev/open-questions.md) waived these inherited failures for v0.1 and requires error-free dev/Workers hydration in the owning restyle task: Finance, Finance V1, Productivity and Patient Monitoring in v0.2; Calendar, Invoice and Auth V2 in v0.3. Auth screens and account switching are demonstrations; there is no session/auth backend. Charts, tables, app layouts, and legacy content await v0.2/v0.3; changing global tokens does not constitute a content restyle. Full-route capture failures are recorded rather than omitted or suppressed. The retained optional font registry loads external Google font assets and may encounter network timeouts; the default Geist faces are self-hosted.


## Dashboard foundation (v0.2 / 001)

`src/lib/charts/theme.tsx` composes the existing chart wrappers with responsive sizing, token-based axes/grid/cursor/tooltips/legends, explicit en-US numeric formatters, and `useChartMotion`. The hook starts without animation on both SSR and initial hydration, then observes reduced-motion changes; pass its props to every animated Recharts series. `seriesConfig` selects chart-1, chart-2, chart-4 and chart-5, avoiding Default's duplicate chart-3 color. Pair series with labels and dash patterns from their keyed `seriesConfig` entries; color alone is insufficient.

`dashboard/-components/dashboard/cards.tsx` provides `DashboardCard` (12px compact / 16px standard), `SectionHeader`, and `StatCard`. These presentation APIs accept domain values, help, trends and actions without owning data or state. Default's metrics and customer-activity chart are the first consumers; the full dashboard restyle follows in task 002. Other dashboards and the protected UI wrappers remain intact.

## Default dashboards (v0.2 / 002)

Default and Default V1 use neutral KPI cards, semantic signed trends, and shared token-based charts with distinct legend line samples. Customer and proposal tables retain filtering, selection, pagination and detail actions; their full columns scroll inside the table on narrow screens. Legacy visitor range selection retains its 7-day mobile default and 3-month desktop default. Existing demo controls and distinct datasets remain intact; no backend behavior was added.

## CRM dashboards (v0.2 / 003)

CRM and CRM V1 use shared compact cards and motion-aware charts, semantic signed trends and explicit opportunity health labels. Narrow tables scroll locally; the opportunity toolbar wraps, and the legacy funnel and source breakdown label segments directly with names and counts. Existing periods, records, table state and demo actions remain local. The upstream-author lead fixture is now Jordan Lee at Northwind Studio.

## Finance dashboards (v0.2 / 004)

Finance and Finance V1 use neutral shared KPI cards, semantic signed amounts, directly labelled allocation charts and compact source/spending breakdowns. Existing account/transaction placeholders, disabled legacy tabs, masked accounts and demo actions remain. The payment card uses Jordan Lee. Both screens render a dated October 23, 2026 demo statement with explicit UTC fixture dates, avoiding Worker module-start clocks and server/browser date differences; no financial backend is connected.

For direct-load and refresh hydration checks with the real clock, `npm run screenshots -- --routes /dashboard/finance,/dashboard/finance-v1 --timezone Pacific/Kiritimati --reload` adds a fresh-load/refresh pair in every theme and viewport. `--timezone` defaults to America/Chicago; `--reload` is optional. Use `--base-url` for the Workers version.

### Analytics dashboards (v0.2 / 005)

Analytics uses compact metrics, labelled actual/baseline trends, full-contrast visitor bars and country codes, wrapping tabs, and a locally scrollable page table. Traffic source labels sit beside bars so short series stay readable. Analytics V1 retains its forecast, triage, manager queue and sortable risk ledger; solid closed-won bars, dotted pipeline and dashed target share one percentage axis. Charts respect reduced motion while retaining all data and keyboard tooltips. Existing period, range, view/filter and placeholder actions remain local demo interactions. The legacy range starts at a deterministic September 24–October 23, 2026 demo interval; range changes retain the local chart calculation. The greeting uses Jordan.
