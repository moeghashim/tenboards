# Changelog

## v0.1 — Design system and shell (2026-10-23)

- Preserve the full upstream route catalog and MIT attribution, with a public Cloudflare demo and per-PR version previews.
- Add the tenboards identity, self-hosted Geist defaults, semantic light/dark tokens, and Default, Graphite, Pine, and Iris presets.
- Rebuild the floating sidebar, responsive header, and neutral demo account/status UI.
- Add one ⌘K/Ctrl+K palette across dashboard, standalone, legacy, auth, and error screens.
- Rebuild persistent layout settings with accessible native controls and a reset to tenboards defaults.
- Add repeatable route captures and shell keyboard, focus, reduced-motion, preference, and contrast evidence.

Known limitation (waived by user 2026-10-23): inherited upstream React hydration errors (#418) on Patient Monitoring, Calendar, Finance, Invoice, Productivity, Finance V1, and Auth V2 login/register; each is fixed when v0.2/v0.3 restyles that page. Dashboard and app-page content restyles remain v0.2/v0.3; database/auth integrations remain later milestones. The implementer does not merge or deploy production; Claude reviews and holds delegated merge authority.
