# Changelog

## v0.4 — Optional local data layer (in review, unreleased)

- Route all data-bearing app pages and 14 dashboards through 22 typed GET reads with zero-config demo or actual local Docker Postgres 17.
- Add normalized domain tables, ordered relationships, typed aggregate metrics, a linear Drizzle migration journal and repeatable transactional seeds.
- Preserve separate fixture identities, numeric precision, civil dates, request-relative Calendar/Invoice/Mail definitions, local actions and existing SSR/hydration fixes.
- Keep Patient Monitoring waveform/trend/tick simulation client-side while loading patient records, baselines, alarms and settings normally.
- Fail configured DB errors visibly without silent fallback or credential leakage; support explicit forced demo and lazy server-only DB access.
- Add exact read parity, source-fault/negative controls, runtime-boundary audit and full demo/DB/Workers capture coverage with explicit request references.
- Document optional database onboarding, migrations, reseeding and adding domains. Production remains demo-only; authentication and hosted Neon/Hyperdrive are future milestones.

All eight implementation tasks remain in review. No version bump, tag, release,
merge or production deployment is performed by the implementer.

## v0.3 — App pages (2026-10-23)

- Restyle Mail, Chat, Calendar, Kanban, Tasks, Invoice, File Manager, Products, Users/Roles, Profile, Auth V1/V2 and system states with compact typography, neutral surfaces, semantic states and responsive content.
- Preserve all 38 routes, standalone/iframe Mail and Chat, query views, six Profile tabs, directory tabs, forms, local demo actions and zero-config setup.
- Resolve Calendar, Invoice and both Auth V2 hydration findings through serialized request data; verify real clocks, delayed JavaScript, refresh and differing timezones.
- Replace remaining upstream-author fixtures with coherent neutral demo identities while preserving MIT attribution.
- Improve keyboard menus, focus return, field feedback and local table scrolling; preserve shell preferences and reduced-motion support.
- Verify 1,216 route/preset/theme/viewport cases on dev and Workers, plus iframe, query/tab/overlay/print, auth and real root-boundary recovery scenarios.
- Preserve root/dashboard redirects, root 404 semantics, generic production errors and UI-only authentication. Add no runtime dependencies, backend integration or public error trigger.

All 14 tasks are merged and deployed to https://tenboards.mohanadgh.workers.dev. Release: [v0.3.0](https://github.com/moeghashim/tenboards/releases/tag/v0.3.0).

## v0.2 — Dashboards (2026-10-23)

- Unify all ten current dashboards and four legacy variants with shared compact cards, semantic states, responsive charts, readable legends and preserved demo workflows.
- Replace upstream-author dashboard fixtures while retaining MIT notices and provenance.
- Resolve Finance, Finance V1 and Productivity date hydration mismatches with explicit demo dates; start Patient Monitoring’s real UTC clock after hydration and retain deterministic realtime initial samples.
- Pause continuous monitoring traces for reduced motion and preserve numeric readings, units and alarm semantics.
- Improve E-commerce order menus, Academy keyboard achievements, Logistics mobile sheet focus, and Infrastructure mobile environment fields.
- Align Finance comparison-row heights and verify all 14 routes across four presets, two themes and two viewports on dev and Workers.
- Retain mock data, placeholder/disabled actions and the existing external Logistics basemap. No runtime dependency or backend/auth integration is added. Calendar, Invoice and Auth V2 hydration fixes and app-page restyles remain v0.3 work.

All 12 tasks are merged and deployed. Release: [v0.2.0](https://github.com/moeghashim/tenboards/releases/tag/v0.2.0).

## v0.1 — Design system and shell (2026-10-23)

- Preserve the full upstream route catalog and MIT attribution, with a public Cloudflare demo and per-PR version previews.
- Add the tenboards identity, self-hosted Geist defaults, semantic light/dark tokens, and Default, Graphite, Pine, and Iris presets.
- Rebuild the floating sidebar, responsive header, and neutral demo account/status UI.
- Add one ⌘K/Ctrl+K palette across dashboard, standalone, legacy, auth, and error screens.
- Rebuild persistent layout settings with accessible native controls and a reset to tenboards defaults.
- Add repeatable route captures and shell keyboard, focus, reduced-motion, preference, and contrast evidence.

Known limitation (waived by user 2026-10-23): inherited upstream React hydration errors (#418) on Patient Monitoring, Calendar, Finance, Invoice, Productivity, Finance V1, and Auth V2 login/register; each is fixed when v0.2/v0.3 restyles that page. Dashboard and app-page content restyles remain v0.2/v0.3; database/auth integrations remain later milestones. The implementer does not merge or deploy production; Claude reviews and holds delegated merge authority.
