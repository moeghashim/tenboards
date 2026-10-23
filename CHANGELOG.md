# Changelog

## v0.2 — Dashboards (2026-10-23)

- Unify all ten current dashboards and four legacy variants with shared compact cards, semantic states, responsive charts, readable legends and preserved demo workflows.
- Replace upstream-author dashboard fixtures while retaining MIT notices and provenance.
- Resolve Finance, Finance V1 and Productivity date hydration mismatches with explicit demo dates; start Patient Monitoring’s real UTC clock after hydration and retain deterministic realtime initial samples.
- Pause continuous monitoring traces for reduced motion and preserve numeric readings, units and alarm semantics.
- Improve E-commerce order menus, Academy keyboard achievements, Logistics mobile sheet focus, and Infrastructure mobile environment fields.
- Align Finance comparison-row heights and verify all 14 routes across four presets, two themes and two viewports on dev and Workers.
- Retain mock data, placeholder/disabled actions and the existing external Logistics basemap. No runtime dependency or backend/auth integration is added. Calendar, Invoice and Auth V2 hydration fixes and app-page restyles remain v0.3 work.

All 12 tasks are merged and deployed to https://tenboards.mohanadgh.workers.dev.

## v0.1 — Design system and shell (2026-10-23)

- Preserve the full upstream route catalog and MIT attribution, with a public Cloudflare demo and per-PR version previews.
- Add the tenboards identity, self-hosted Geist defaults, semantic light/dark tokens, and Default, Graphite, Pine, and Iris presets.
- Rebuild the floating sidebar, responsive header, and neutral demo account/status UI.
- Add one ⌘K/Ctrl+K palette across dashboard, standalone, legacy, auth, and error screens.
- Rebuild persistent layout settings with accessible native controls and a reset to tenboards defaults.
- Add repeatable route captures and shell keyboard, focus, reduced-motion, preference, and contrast evidence.

Known limitation (waived by user 2026-10-23): inherited upstream React hydration errors (#418) on Patient Monitoring, Calendar, Finance, Invoice, Productivity, Finance V1, and Auth V2 login/register; each is fixed when v0.2/v0.3 restyles that page. Dashboard and app-page content restyles remain v0.2/v0.3; database/auth integrations remain later milestones. The implementer does not merge or deploy production; Claude reviews and holds delegated merge authority.
