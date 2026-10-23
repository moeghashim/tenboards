# tenboards

An MIT-licensed dashboard template built with TanStack Start, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui on Base UI.

The full upstream screen catalog and demo-data relationships are retained, with neutral demo identities. **v0.1 is merged, deployed and closed**: the design system and shell follow [PLAN.md](PLAN.md). **v0.2 (all 14 dashboards restyled) is merged, deployed and closed** per [the dashboard task breakdown](dev/milestones/v0.2-dashboards/README.md). **v0.3 (all app pages restyled) is merged, deployed and released as [v0.3.0](https://github.com/moeghashim/tenboards/releases/tag/v0.3.0)** — [14 app-page tasks](dev/milestones/v0.3-app-pages/README.md) deliver a small shared header foundation, standalone/embedded Mail and Chat, Calendar, Kanban, Tasks, Invoice, File Manager, Products, Users/Roles, Profile, Auth V1/V2, system states, and full-route acceptance. Current milestone/task status is tracked in [dev/milestones.json](dev/milestones.json). Current screens are demonstrations. **v0.4 is in progress** — [8 data-layer tasks](dev/milestones/v0.4-data-layer/README.md) connect app pages and dashboards to Drizzle + optional local Docker Postgres 17. The implementation stack is in review; production stays in demo mode. Better Auth follows in v0.5 and production Neon/Hyperdrive setup in v0.6.

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
- `npm run db:generate` — generate the next reviewed Drizzle migration; no DB required.
- `npm run db:migrate` — apply committed migrations to an explicit local Postgres URL.
- `npm run db:seed` — transactionally upsert canonical local demo records.
- `npm run data:parity` — compare every demo/DB read against seeded local Postgres.
- `npm run screenshots` — capture route/preset/theme/viewport evidence (optional `--reference` for identical request dates).
- `npm run generate-routes` — regenerate file-based routes.
- `npm run generate:presets` — regenerate the preset registry.
- `npm run deploy` — reviewer-only build and production deployment after approved merges.
- `npm run preview:deploy -- --preview-alias pr-NNN` — build and upload a version preview without changing live traffic.

## Included screens

The 14 dashboard routes are Default, CRM, Finance, Analytics, Productivity, E-commerce, Academy, Logistics, Infrastructure, Patient Monitoring, Default V1, CRM V1, Finance V1 and Analytics V1. All 14 share the v0.2 dashboard/chart presentation contract; legacy variants retain their distinct data and interactions. Review state is tracked in [dev/milestones.json](dev/milestones.json).

| Current screen | Route | Legacy variant |
| --- | --- | --- |
| Default | `/dashboard/default` | `/dashboard/default-v1` |
| CRM | `/dashboard/crm` | `/dashboard/crm-v1` |
| Finance | `/dashboard/finance` | `/dashboard/finance-v1` |
| Analytics | `/dashboard/analytics` | `/dashboard/analytics-v1` |
| Productivity | `/dashboard/productivity` | — |
| E-commerce | `/dashboard/ecommerce` | — |
| Academy | `/dashboard/academy` | — |
| Logistics | `/dashboard/logistics` | — |
| Infrastructure | `/dashboard/infrastructure` | — |
| Patient Monitoring | `/dashboard/patient-monitoring` | — |

File Manager, Products, Users, Roles, Profile, Mail, Chat, Calendar, Kanban, Tasks, Invoice, Auth V1/V2, Coming Soon and error/permission states now follow the v0.3 app-page design. Standalone `/mail` and `/chat` retain `/dashboard/mail` and `/dashboard/chat` iframe aliases. All four auth forms and the bare `/auth/v2` layout remain distinct; all screens remain demos. Route-specific components stay colocated under `src/routes/`. All 14 v0.3 tasks are merged and deployed.

## Provenance and license

Imported from [arhamkhnz/tanstack-shadcn-admin-dashboard](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard) (Studio Admin), revision [`81e5ef1391b68c176154faba0c9ac7b0023ecbaf`](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard/commit/81e5ef1391b68c176154faba0c9ac7b0023ecbaf). Copyright © 2026 Mohammed Arham Khan. The original MIT notice is preserved in [LICENSE](LICENSE), alongside the tenboards copyright. No upstream history or remote is retained.

The upstream contributor guidance is archived at [docs/upstream-AGENTS.md](docs/upstream-AGENTS.md). PLAN.md and its Decisions log govern tenboards. Root [AGENTS.md](AGENTS.md) defines the current contributor workflow and required checks.

## Import validation notes

The unmodified import passed Biome with one existing `noArrayIndexKey` warning in `src/lib/highlighter.tsx`. Its initial TypeScript run found four errors: two unused bindings, a missing package version, and an `unknown` error accessed without narrowing. Task 001 applies narrowly scoped fixes without changing screen designs.

`npm install` reported seven high-severity dependency advisories in the inherited dependency tree. No forced dependency upgrades were applied during the import; details are included in the task PR evidence. These advisories are separate from the build, Biome, and TypeScript checks.

## Cloudflare demo and PR previews


**Live demo:** [tenboards.mohanadgh.workers.dev](https://tenboards.mohanadgh.workers.dev/dashboard/default) — redeployed from `main` after each merge.

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

Captures wait for React hydration, fonts, network idle, images, JS chart settling, and stable content. Reduced motion is emulated and screenshot animations are disabled. Console errors, page errors, failed requests, unexpected HTTP status, and capture failures are recorded in `report.json` and cause a nonzero exit. The hydration check uses React's DOM binding marker; revisit it if React's renderer changes. Application clocks are never frozen. For v0.4 comparisons, pass the same `--reference` ISO timestamp to serialize identical date inputs; the real monitoring clock can be narrowly masked with `--mask-live-clocks`.

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

Current hydration status: all eight inherited findings are resolved and verified on dev and Workers. Finance, Finance V1, Productivity and Patient Monitoring shipped in v0.2; Calendar and Invoice shipped in v0.3 batch A; Auth V2 login/register shipped in v0.3 batch B. Calendar, Invoice and Auth use serialized request data; Patient Monitoring starts its real clock after hydration. Delayed JavaScript, refresh and differing timezone checks use real clocks. The final 1,216-case matrix covers all 38 routes across four presets, both themes and both viewports. Historical failures and linked resolutions remain in [dev/open-questions.md](dev/open-questions.md).


## Dashboard foundation (v0.2 / 001)

`src/lib/charts/theme.tsx` composes the existing chart wrappers with responsive sizing, token-based axes/grid/cursor/tooltips/legends, explicit en-US numeric formatters, and `useChartMotion`. The hook starts without animation on both SSR and initial hydration, then observes reduced-motion changes; pass its props to every animated Recharts series. `seriesConfig` selects chart-1, chart-2, chart-4 and chart-5, avoiding Default's duplicate chart-3 color. Pair series with labels and dash patterns from their keyed `seriesConfig` entries; color alone is insufficient.

`dashboard/-components/dashboard/cards.tsx` provides `DashboardCard` (12px compact / 16px standard), `SectionHeader`, and `StatCard`. These presentation APIs accept domain values, help, trends and actions without owning data or state. The primitives are reused throughout the 14 dashboard routes. Domain data and interactions remain route-local; protected UI wrappers remain intact.

## Default dashboards (v0.2 / 002)

Default and Default V1 use neutral KPI cards, semantic signed trends, and shared token-based charts with distinct legend line samples. Customer and proposal tables retain filtering, selection, pagination and detail actions; their full columns scroll inside the table on narrow screens. Legacy visitor range selection retains its 7-day mobile default and 3-month desktop default. Existing demo controls and distinct datasets remain intact; no backend behavior was added.

## CRM dashboards (v0.2 / 003)

CRM and CRM V1 use shared compact cards and motion-aware charts, semantic signed trends and explicit opportunity health labels. Narrow tables scroll locally; the opportunity toolbar wraps, and the legacy funnel and source breakdown label segments directly with names and counts. Existing periods, records, table state and demo actions remain local. The upstream-author lead fixture is now Jordan Lee at Northwind Studio.

## Finance dashboards (v0.2 / 004)

Finance and Finance V1 use neutral shared KPI cards, semantic signed amounts, directly labelled allocation charts and compact source/spending breakdowns. Existing account/transaction placeholders, disabled legacy tabs, masked accounts and demo actions remain. The payment card uses Jordan Lee. Both screens render a dated October 23, 2026 demo statement with explicit UTC fixture dates, avoiding Worker module-start clocks and server/browser date differences; no financial backend is connected.

For direct-load and refresh hydration checks with the real clock, `npm run screenshots -- --routes /dashboard/finance,/dashboard/finance-v1 --timezone Pacific/Kiritimati --reload` adds a fresh-load/refresh pair in every theme and viewport. `--timezone` defaults to America/Chicago; `--reload` is optional. Use `--base-url` for the Workers version.

### Analytics dashboards (v0.2 / 005)

Analytics uses compact metrics, labelled actual/baseline trends, full-contrast visitor bars and country codes, wrapping tabs, and a locally scrollable page table. Traffic source labels sit beside bars so short series stay readable. Analytics V1 retains its forecast, triage, manager queue and sortable risk ledger; solid closed-won bars, dotted pipeline and dashed target share one percentage axis. Charts respect reduced motion while retaining all data and keyboard tooltips. Existing period, range, view/filter and placeholder actions remain local demo interactions. The legacy range starts at a deterministic September 24–October 23, 2026 demo interval; range changes retain the local chart calculation. The greeting uses Jordan.

### Productivity dashboard (v0.2 / 006)

Productivity uses compact summary cards, readable task rows, labelled project/weekly progress, and a secondary calendar/focus/notes column that follows the main work on mobile. Jordan replaces the upstream greeting. The calendar visibly identifies its October 23, 2026 demo day; project due dates and recent-note labels derive from the same deterministic fixture. Explicit calendar `today`, selected date and initial month remove server/client clock differences while preserving month navigation and selection. A local day-button adapter attaches keyboard focus for arrow navigation without changing the shared calendar wrapper. Task checkboxes retain local state and show completion with a strike-through. Existing period/project selectors and placeholder creation/focus actions remain available; this does not add a timer or persistent task storage.

For repeatable interaction evidence, run `npm run screenshots -- --routes /dashboard/analytics,/dashboard/analytics-v1,/dashboard/productivity --interactions`. This opt-in mode checks controls and keyboard task/calendar behavior, saves `-interactive.png` captures, and records observations in `report.json`; ordinary captures are unchanged.

### E-commerce dashboard (v0.2 / 007)

E-commerce uses shared compact KPIs, a labelled USD revenue/profit chart, readable traffic-source shares, semantic inventory/payment states and wrapping order controls. The demo reporting interval is explicitly October 23, 2026 UTC; sales buckets and traffic timestamps no longer depend on server startup or browser clocks. Existing period/channel selections, filters, selection, date sorting and pagination remain local. Order action menus now open correctly with Base UI group labels; review/settings/export actions retain their existing demo behavior. `npm run screenshots -- --routes /dashboard/ecommerce --reload --interactions` verifies the order workflow and direct/refresh rendering.

### Academy dashboard (v0.2 / 008)

Academy shares compact metrics and semantic schedule/assignment states. Full course names wrap; submission counts are available in a labelled table alongside the motion-aware chart. Performance windows retain their weekly positions and scores, with named student achievement tooltips outside the marks for mobile and keyboard access. Schedule and upcoming events use an explicit October 23, 2026 demo day, retaining their event offsets and times across server/browser timezones. Announcement, Gradebook and assignment controls retain their existing demo behavior. The Academy `--interactions` screenshot scenario checks keyboard achievement details and responsive layout.

### Logistics dashboard (v0.2 / 009)

Logistics keeps its shipment list/map/detail split and mobile detail sheet. Shipment selection supports Enter; Escape closes the mobile sheet and restores focus to the selected row. Shared local status styles, country codes, explicit endpoint labels and different origin/destination marks clarify the route in every preset. Detail tabs, named controls and locally scrolling panes fit narrow screens. Search/filter, copy/contact and unimplemented detail-tab actions retain their existing demo behavior. The Logistics `--interactions` capture verifies selection, placeholder tabs and sheet focus return. The geographic basemap still loads the existing public world-atlas asset.

### Infrastructure dashboard (v0.2 / 010)

Infrastructure retains project grouping, collapsible sections, every environment, resource thresholds and the empty project. Desktop tables scroll locally; mobile rows reflow into labelled fields so health, uptime, CPU/RAM/disk and server details remain available. Project/environment menus and refresh/settings/search controls have accessible names. Status and resource marks use semantic tokens, with values and labels alongside color. The snapshot is explicitly demo data; search/filter and operational actions remain placeholders. Author-linked upstream fixture domains are replaced by `workspace.example.com`. The Infrastructure `--interactions` capture checks keyboard collapse and both action-menu types.

### Patient Monitoring dashboard (v0.2 / 011)

Patient Monitoring retains all simulated readings, units, patient selection, alarms and event/trend views. Compact cards, wrapping names/controls and labelled semantic waveforms remain readable across presets and narrow layouts. The live UTC clock starts after hydration from an identical server/client placeholder; realtime stores expose the same initial sample during SSR and hydration. Reduced motion pauses continuous traces and trends while keeping numeric readings and the real clock available; normal motion resumes the local simulation. Footer actions retain their existing demo behavior.

`npm run screenshots -- --routes /dashboard/patient-monitoring --reload --interactions --hydration-delay-ms 1800` delays JavaScript delivery across a real second boundary, checks direct/refresh hydration, verifies the clock advances, and compares reduced/normal-motion waveform paths. It does not replace or freeze the runtime clock. Add `--base-url` for Workers and `--timezone Pacific/Kiritimati` for timezone coverage.

### Integrated dashboard acceptance (v0.2 / 012)

The full 14-route matrix is verified on dev and Workers in Default, Graphite, Pine and Iris, each in light/dark at desktop/mobile. Finance's Spending Overview and Account Allocation now share a row height; its wallet, bills and shortcut column also finish together. The other 13 routes were checked for the same row-gap regression. Supported-token contrast measurements and keyboard/tooltip/reduced-motion spot checks are retained with the PR evidence; these are scoped checks, not a claim of a complete accessibility audit.

All screens remain mock-data demos, including existing disabled and placeholder actions. No runtime dependencies, protected UI/calendar wrappers, shell preferences or v0.3 page designs change. All v0.2 tasks are merged, deployed and released as v0.2.0; production deployment remains the reviewer's responsibility.


### App pages (v0.3)

The [app-page breakdown](dev/milestones/v0.3-app-pages/README.md) assigns all 38 current route-catalog entries plus root not-found/error states to page owners or final regression coverage. Mail and Chat each retain standalone and dashboard iframe routes; Auth includes four forms and the bare V2 layout. The external `/` remains a redirect to `/dashboard/default`, with no landing UI to restyle. Implementation progress is documented per task below.

Calendar, Invoice and both Auth V2 forms have passed their separate hydration gates. Page owners replaced the remaining upstream-author demo identities; the final whole-source scan has no matches, while legal attribution remains intact. Final acceptance checks every route across all four presets and reconciles hydration history. All v0.3 tasks are merged, deployed and released; their evidence remains separate from the v0.4 implementation review.


### App-page foundation (v0.3 / 001)

`dashboard/-components/app-pages/page-header.tsx` provides a presentation-only `PageHeader` with a required string `title`, optional string `description`, wrapping React `actions`, and optional layout `className`. It renders one semantic h1 at 24px, with wrapping titles and action groups. File Manager and Products use it while retaining query-driven file views and the product drawer; their grids and tables remain assigned to tasks 008/009. The upstream-author File Manager owner fixture is now Jordan Lee. Tasks and Invoice are intended later consumers. Existing dashboard cards, card-level headings and chart theme remain the shared APIs for their respective roles.


### Mail pages (v0.3 / 002)

Standalone Mail and its dashboard iframe use neutral panes, compact message rows, explicit unread labels and a selected pressed state. Long sender/recipient fields and attachments wrap; the reply composer has named controls. Jordan Lee and Northwind Studio replace author-linked accounts and recipient fixtures. Desktop panel resizing retains its layout cookie; mobile selection opens the existing message drawer and Escape restores row focus. Search, navigation/filter, send and other unimplemented actions retain their existing demo behavior. The iframe retains its title, full-screen new-tab link and cookie-based theme/preset initialization. `npm run screenshots -- --routes /mail,/dashboard/mail --interactions` covers the inner frame, keyboard selection, attachments, composer, resize cookie and mobile drawer.


### Chat pages (v0.3 / 003)

Standalone tenboards Chat and its dashboard iframe use neutral conversation/thread/contact panes, labelled unread/pinned/online states, and visible sender names beside message times. Jordan Lee replaces the current-user author fixture, and contact emails use the neutral workspace.example.com domain. Pane transitions use 200ms and respect reduced motion. Contact details use the existing sheet below 1280px so the embedded thread keeps room to read. Hidden list, thread and contact panes are inert; mobile selection/back and profile Escape restore focus to the relevant control. Existing conversation selection, composer tabs, messages and placeholder search/send/filter behavior remain local. The account menu label now sits in the required Base UI group. The Chat `--interactions` scenario checks iframe appearance, composer tabs, profile Escape and off-screen focus protection.


### Calendar page (v0.3 / 004)

Calendar retains Month/Week/Day, Today/previous/next, demo calendar selection and more-events popovers. The card surface, named controls, full-contrast today marker and wrapping event titles use existing tokens. Month/week grids scroll horizontally within the calendar on small screens; Day fills the available width. Two additional demo meetings provide a crowded-day example, and the birthday fixture is Jordan Lee.

A route-loader request timestamp is shared by SSR and hydration with an explicit initial UTC timezone; after hydration, the calendar adopts browser-local time and its real live clock. Civil-date demo events derive from that shared month instead of a module-startup clock. This fixes the demonstrated server/browser disagreement about today's cell without disabling SSR, suppressing warnings or freezing time. Calendar adapters remain intact. Add event and calendar filtering retain their existing placeholder behavior.

`npm run screenshots -- --routes /dashboard/calendar --reload --interactions --timezone Pacific/Kiritimati --hydration-delay-ms 1800` verifies local Today, real now-marker positioning, views/navigation and crowded-day popovers. Interaction runs also save Week/Day/Month variant captures. Use `--base-url` to repeat on Workers.


### Kanban page (v0.3 / 005)

Kanban keeps query-addressable Board, List and Table views, local task/column/table ordering, cancellation rollback and table status edits. The compact toolbar, wrapping task content, textual priority badges and neutral team/owner treatments use semantic tokens; Jordan Lee replaces the author owner in every view and drag overlay. Board/table scrolling remains local on mobile, and empty columns show “No tasks.” Search/filter/sort/create controls retain their existing placeholder behavior.

`npm run screenshots -- --routes /dashboard/kanban --search view=list --reload` captures a query-selected view (use `view=board` or `view=table` as needed). `--interactions` exercises keyboard moves/cancellation, desktop pointer movement, column/list/table ordering, status edits and empty-column states; it saves each view and the drag overlay. Active-drag captures preserve animation and viewport size so taking evidence does not end the gesture. Failed captures now also attempt a diagnostic PNG.


### Tasks page (v0.3 / 006)

Tasks uses the shared page heading and a compact table with wrapping titles, textual semantic status/priority badges, named selection/search controls and a visible mobile column menu. Search and combined filters retain local state; empty results explain how to recover, Reset is neutral, and selected-count feedback remains live. The inherited Base UI sorting/clear-filter callbacks and column-menu label grouping are corrected at their usage sites. Row actions remain demo placeholders; no task records or dependencies change.

`npm run screenshots -- --routes /dashboard/tasks --interactions` checks the known search/status/priority result, row and page selection, empty/reset states, Asc/Desc ordering, column visibility, page sizes, pagination and both filter clear actions. It also captures selected and empty variants.


### Invoice page (v0.3 / 007)

Invoice uses the shared page heading, named date/client/adjustment controls, labelled responsive line items and a live balance beside the preview. Descriptions accept multiple lines; long addresses and references wrap on the white paper. Northwind Studio / Jordan Lee and reserved example domains replace upstream-author billing fixtures. Existing calculations, item ordering, add/remove/edit actions and placeholder Save/Send/Download actions remain local.

The route loader creates fresh UTC civil-date defaults for each request and shares them with SSR and hydration. This replaces independent module clocks that disagreed across timezones; both dates remain editable. No warning suppression, SSR disabling or frozen clock is used. The existing print portal is hidden on screen and isolated for Letter printing, preventing a duplicate invoice from widening the mobile page. Preview height follows the actual paper content, and the footer flows after the totals.

`npm run screenshots -- --routes /dashboard/invoice --reload --interactions --timezone Pacific/Kiritimati --hydration-delay-ms 1800` checks delayed direct/refresh hydration, both date edits, client selection, multiline items, quantity/price, add/remove/reorder/cancel, tax/discount calculations and preview/print agreement. The print variant exports a PDF beside its screenshot for page-fit verification. Repeat with `--base-url` on Workers and `--timezone America/Chicago`; captures and PDFs belong only on pr-assets or PR attachments.


### File Manager (v0.3 / 008)

File Manager retains query-selected Grid/List views and compact folders. Filenames wrap; cards expose owner, date and sharing metadata, and mobile tables scroll locally with every column intact. Star buttons are always visible and expose pressed state; the menu uses the Base UI click callback. Neutral demo owners and matching initials appear in both views. Stars retain their view-local state and reset when remounting, as before. Search/filter, folder navigation, upload, download/share/trash remain demo placeholders. `npm run screenshots -- --base-url http://localhost:3000 --routes /dashboard/file-manager --reload --interactions` verifies query refresh, button/menu stars and mobile metadata.


### Products (v0.3 / 009)

Products uses semantic stock/status labels, wrapping names and SKUs, aligned tabular prices and a locally scrolling catalog. Search, category/status filters, selection and pagination remain local. Duplicate creates a draft; editing preserves IDs and validates unique SKUs. The Add drawer remains validation-only, with optional image previews and no catalog insertion or upload service. Compact form groups retain scrolling and reachable actions; closing the editor returns focus to its product. `npm run screenshots -- --routes /dashboard/products --interactions --base-url http://localhost:3000` covers filters, empty/selection states, duplication, edit validation, zero/upper numeric boundaries, images and keyboard dismissal.


### Users and Roles (v0.3 / 010)

Users and Roles use compact tables, semantic statuses, named search/filter controls and wrapping pagination. Users exposes full workspace names and a live selection count; its workspace selector supplies the array value required by TanStack Table v9 membership filtering. Roles retains its grouping, disabled system-role actions and Permission Sets/Access Reviews placeholder tabs. Directory actions and permission information remain demo-only. No invitations, RBAC or backend mutations are implemented. The `--interactions` screenshot scenarios verify combined filters against exact fixtures, selection, page size/pagination, keyboard menus and all Roles tabs.


### Profile (v0.3 / 011)

Profile retains Overview, Personal, Employment, Compensation, Time off and Documents. Jordan Lee, matching JL initials, reserved example-domain emails, neutral manager/contact and updater attribution replace the upstream identity and remote author avatar. A route-local detail field keeps labels and long values consistent; the document table scrolls locally, and tab navigation remains horizontally scrollable. Restricted compensation copy explicitly identifies the demo state; header/document actions retain their existing behavior. The Profile `--interactions` capture checks all six tabs, identity fields, keyboard menu focus return and document controls.


### Authentication demos (v0.3 / 012)

Auth V1 and V2 retain separate login/register routes, validation, masked password fields, autofill attributes and local submission toasts. They remain UI-only demos; Google and remember-me do not connect an authentication service (Better Auth remains v0.5). V2 copyright derives from the real request UTC year, serialized through its parent loader; no module clock or browser timezone difference enters hydration. Bare `/auth/v2` stays layout-only. A shared V2 form frame keeps navigation and footer in document flow, including short screens. Validation messages are associated with their inputs, and demo toasts use valid paragraph-compatible markup. `npm run screenshots -- --interactions` supports all five auth URLs; `--reload --hydration-delay-ms 1800 --timezone Pacific/Kiritimati` exercises real delayed hydration.


### System states (v0.3 / 013)

Coming Soon describes planned content; the dashboard splat explains an unknown dashboard page. Root not-found, demo Unauthorized and RootError share a compact hierarchy with wrapping copy and keyboard recovery links. Production errors retain generic text; development can show the error message. `/`, `/dashboard` and `/dashboard/` still return 307 redirects to `/dashboard/default`; unknown root URLs return 404 and the explicit dashboard splat remains HTTP 200. `npm run screenshots -- --routes /dashboard/default --boundaries` adds four-state root not-found and real root-error/reset evidence. The CLI temporarily replaces a loaded browser route component, restores it and presses Try again; no error trigger or route is shipped. Expected injected exceptions and the exact unknown-document 404 diagnostic are recorded separately in report.json.


### Complete app-page acceptance (v0.3 / 014)

The integrated v0.3 stack passes all 38 catalog entries on dev and Workers with Default, Graphite, Pine and Iris × light/dark × desktop/mobile: 608 cases per environment, 1,216 total. The coverage manifest checks generated routes, duplicates, missing/unexpected cases and every error; original failures and explicit reruns remain in pr-assets/v03-014. Supplemental scenarios cover Mail/Chat iframe contents, File Manager grid/list, Kanban board/list/table and overlays, Roles and all six Profile tabs, product/directory/task filters and forms, four auth forms, Invoice print, live Calendar/Patient Monitoring behavior, root 404/error/reset, and shell focus/preferences/reduced motion. All eight historical hydration findings are resolved; the whole-src author scan returns no matches. Supported-token audits pass 280 comparisons per environment; scoped actual-surface evidence is linked, not represented as a complete accessibility certification. The app source is unchanged by this acceptance layer. All 14 v0.3 tasks are merged and deployed, and v0.3.0 is released. This paragraph records the historical v0.3 acceptance run; current v0.4 evidence is described below.

Run `npm run screenshots -- --base-url <url> --preset <default|graphite|pine|iris> --output <root>/<dev|workers>/<preset>` for each environment/preset. `node --experimental-strip-types scripts/report-route-coverage.ts --root <root> --retries <manifest.json>` verifies complete coverage and retains original errors alongside explicitly mapped reruns. `--interactions` on `/dashboard/default` verifies shell focus, preference persistence and reduced motion; dialog evidence uses the existing viewport so screenshot resizing cannot disturb focus.


## Optional data layer (v0.4, in review)

All data-bearing app pages and all 14 dashboards now use 22 typed reads. Demo is the
zero-config default; local Postgres is optional. The [data-layer guide](docs/data-layer.md)
covers source selection, schemas, dates, seeding, migrations, domain ownership and
adding a read. The eight implementation layers remain in review; production stays
demo-only and the package remains v0.3.0 until the reviewer owns a release.

### Foundation (v0.4 / 001, in review)

Users and Roles now load through typed GET server functions. With `DATABASE_URL` unset, install, development, builds and Workers previews use demo records without opening a database connection. `DATA_SOURCE=demo` explicitly forces demo; any other configured value is rejected. A configured empty, malformed, unreachable or unmigrated database produces a visible load error, never silent demo fallback. Actions remain local demonstrations, with no auth or writes.

For optional real reads, run Docker Compose with Postgres 17:

```sh
docker compose up -d
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run data:parity
npm run dev
```

The example uses local-only port `54329`, database/user `tenboards`, password `tenboards_local`, and a named `tenboards_postgres` volume. These are local development credentials, never production secrets. Keep `.env` uncommitted; scripts read it with Node's built-in env-file support. Docker is optional for demo. Only explicit DB commands migrate or seed; startup never does. DB scripts require an explicit localhost target and redact driver errors. Stop containers with `docker compose stop`; no destructive reset helper is provided.

`npm run db:generate` creates reviewed Drizzle SQL under `src/server/db/migrations/`. Migrations are cumulative. The transactional seed upserts stable directory email/role keys, replaces only those fixtures' ordered children, and preserves unrelated parent records. Directory role labels and the informational Roles list remain distinct. Aggregate chart series have a typed decimal metric-points contract; entity lists use normalized tables.

`npm run data:parity` compares actual demo and Postgres implementations with exact ordering and types. Layer 001 covered Users/Roles (two reads, six all/existing/missing scenarios); omitted registration and controlled mismatch tests fail nonzero. `node --env-file=.env --experimental-strip-types scripts/data-source-check.ts` verifies source selection and negative parity tests; its missing-schema case requires a separate local `tenboards_missing_schema` database with no migrations. Database/UI fault evidence is separate from clean smoke. Production remains demo-only until v0.6.


### Profile and shell accounts (v0.4 / 002, in review)

The dashboard parent loads demo accounts alongside the existing cookie preferences. Account selection remains local and resets on refresh; it does not establish a session. The former unused `rootUser` export is removed, and `src/data/users.ts` now contains only the account type. Shell accounts, directory members, informational roles and Jordan Lee's profile remain distinct datasets.

All six Profile tabs load normalized identity, contact, employment, time-off and ordered document records, including manager/updater attribution and the previously inline completion, verification and record-status fields. Restricted-compensation and action behavior remain demonstration-only. Cumulative parity covers four reads and twelve scenarios, including missing-account empty arrays and missing-profile null. Apply the new cumulative migrations and rerun `db:seed` when upgrading an existing local database.

`node --experimental-strip-types scripts/check-accounts.ts <base-url> <evidence-folder>` checks account-menu keyboard selection, Escape focus, refresh reset and cookie preferences across light/dark desktop/mobile. The existing Profile interaction captures cover all six tabs and document controls. Evidence belongs on `pr-assets`, never application branches.


### Commerce reads (v0.4 / 003, in review)

Products, Invoice and the entire E-commerce dashboard now use typed server reads. Product categories/status options load with the catalog; local duplication/editing and validation-only Add remain unchanged. Invoice keeps pure arithmetic/paper helpers in its UI module and receives clients/taxes through a route-local context. Draft date offsets are stored as definitions and resolved from one request timestamp in UTC, including a +14-day due date. Reloading discards local product and invoice edits.

Store orders/customers, review records, traffic-source metadata, category/product summaries and report metadata use normalized tables. Chart series, KPIs, traffic and inventory buckets use typed metric points with decimal values and explicit currency/units. Presentation icons/colors remain local. The store's illustrative totals, short order list and separate catalog are intentionally not reconciled or joined by similar names. Order customer identities are scoped to their source order because the fixture supplies names, not shared customer IDs.

Cumulative parity covers seven reads and 26 scenarios, including product filters/missing records, order filtering, Invoice year/leap-day rollover and later requests after seeding. Upgrade with `db:migrate` and `db:seed`; no new dependency or write endpoint is added. `node --experimental-strip-types scripts/check-commerce-local.ts <base-url>...` verifies local edits reset after reload. Invoice's existing delayed-timezone/print interaction checks remain available through `npm run screenshots`.

### Workspace reads (v0.4/004, in review)

Kanban, Tasks, Calendar and File Manager now load through the optional data source.
Their local drag, filter, selection and star controls remain session-only. Kanban
and the Tasks ledger retain separate records. Calendar stores typed relative event
definitions, resolves one request timestamp for SSR, then adopts browser-local civil
time after hydration; Today and the now marker continue using the live clock.
Migration `0005_abandoned_red_ghost.sql` extends the cumulative journal. Parity covers
all workspace reads, empty/missing selections and month/year/leap-day timezone cases.

### Communication reads (v0.4/005, in review)

Mail and Chat use normalized read data for their standalone views and dashboard
iframes, including accounts, counts, recipients, attachments, contacts and messages.
Mail dates resolve stored minute offsets against one serialized request reference,
so reseeding is not required to keep relative demo dates current. Attachment IDs map
to icons in the UI. Selection stores belong to each mounted view, safely handle
empty/removed records, and never represent authentication or persist messages.
Migration `0006_useful_quentin_quire.sql` extends the journal; cumulative parity also
checks later request dates against an unchanged seed.

### Core dashboard reads (v0.4/006, in review)

Default, CRM, Finance and Analytics, including their distinct V1 routes, now load
through four typed GET reads. Customer/proposal/opportunity/lead, financial
account/card/payment and analytics page/source/campaign/risk records use normalized
tables. KPI and chart measures use ordered typed metric points with display metadata;
chart colors, geometry and placeholder controls remain local. No action writes to the DB.

Default visitor ranges and legacy Analytics date-range revenue use loaded records
and model parameters. CRM month labels share the serialized request reference;
Finance statement dates retain explicit UTC semantics. Migrations
`0007_even_the_santerians.sql`, `0008_cultured_praxagora.sql` and
`0009_large_katie_power.sql` extend the journal.
Cumulative parity covers 17 reads / 107 scenarios, including current/V1, missing IDs,
non-default ranges, leap days and year boundaries. Apply migrations and reseed when upgrading.

### Operational dashboard reads (v0.4/007, in review)

Productivity, Academy, Logistics, Infrastructure and Patient Monitoring now load
normalized records through five typed GET reads. Projects/tasks/notes/goals/focus,
class/room schedules and achievements, customer/shipment/cargo/tracking/coordinates,
project/environment resources, and patient/bed/vital/alarm records retain their
original values and ordering. Header totals and aggregate KPIs are typed metric
points; illustrative totals remain independent of short visible lists. Civil-date
labels use explicit UTC formatting. Local actions remain local and reset on reload.

Patient Monitoring's `waveform-data.ts`, `realtime-utils.ts`,
`use-patient-vital-series.ts` and `use-realtime-tick.ts` remain client simulation.
Only waveform/trend geometry, tick progression and live clocks are exempt from
server reads; identities, diagnoses, baseline vitals, signal parameters, alarm
labels/durations, thresholds and monitor settings load normally. This is demo data,
not a medical feed. Real clocks advance and reduced motion pauses traces.
Logistics retains its remote world-atlas presentation asset and exact coordinates.
Removed selections fall back safely, and empty loaded lists do not crash.

Migration `0010_plain_thunderball.sql` extends the cumulative journal. Parity covers
22 reads / 130 scenarios. `scripts/check-operational-data.ts <incumbent-data.json>`
compares both sources with the prior layer's evidence snapshot; the fixture snapshot
belongs on `pr-assets`. `scripts/check-operational-state.ts` verifies loaded selection
changes and empty states on the local dev server. Screenshot `--mask-live-clocks`
masks only Patient Monitoring's explicitly marked live clock, never patient data;
normal reduced-motion snapshots preserve deterministic signal geometry.

### Whole-application acceptance (v0.4/008, in review)

The final source audit checks every canonical fixture owner and traverses runtime
imports to reject client fixture dependencies. Chat's remaining tab counts and
thread date now belong to the Chat read; migration `0011_blushing_siren.sql` follows
the operational migration. The cumulative registry has 22 reads / 130 scenarios.
Fresh Postgres 17 and an upgrade beginning with the actual layer 001 schema/seed
both pass, including repeated seeds and deliberate parity failures.

The screenshot catalog remains 38 routes × four presets × two themes × two
viewports: 608 cases per source. Run each source/preset with the same `--reference`
ISO timestamp and `--mask-live-clocks`; neither option freezes the runtime clock.
The reference becomes a validated, read-only request header for date-relative
loaders. Without it, requests use real time. Invalid headers are ignored. Masks
cover only the marked Patient Monitoring live clock; business values remain visible.

```sh
npm run screenshots -- --base-url <url> --preset <preset> --reference 2026-10-23T12:00:00.000Z --mask-live-clocks --output <evidence>/<dev|db|workers>/<preset>
node --experimental-strip-types scripts/report-route-coverage.ts --root <evidence> --environments dev,db,workers --retries <retry-manifest.json>
node --experimental-strip-types scripts/audit-data-layer.ts
```

The coverage validator reconciles the generated route inventory, all display cases,
errors and explicit retries. Supplemental interaction, iframe, query/tab, print,
root-boundary, delayed hydration and live-clock evidence accompanies the catalog.
Store all logs/reports/images on `pr-assets` or PR attachments, never main.
