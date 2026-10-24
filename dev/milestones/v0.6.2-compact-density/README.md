# v0.6.2 — Compact density

Task: 001 — Compact density. Approved contract: PLAN.md Decisions log, “v0.6.2 compact density” (2026-10-24), from main `54c8d70`. Branch: `feat/v0.6.2/001-compact-density`; base main; one layer. Status: implementation and verification in progress.

Make the whole template about 8–12% more compact through shared tokens/primitives in Impeccable Operate mode. Compact becomes the single default; no density preference. Preserve screen composition, behavior, font/preferences registries, protected UI/calendar implementations and production isolation.

## Acceptance

- [x] Inspect incumbent renders and computed type/control/card/table/sidebar/header/gutter sizes before editing.
- [x] Apply compact type, controls, card/table padding, sidebar/header and gaps through shared tokens/primitives; preserve the rem root and third-party geometry.
- [ ] Verify body/table text ≥13px, metadata ≥12px, interactive targets ≥24px with WCAG 2.5.8 spacing, AA contrast, visible focus and reduced motion.
- [ ] Verify fonts, all theme presets/modes and sidebar styles without overflow/truncation regressions; retain usable mobile controls.
- [x] Update DESIGN.md, README, CHANGELOG draft and milestone tracking.
- [ ] Pass build, check, typecheck, dev dashboard smoke and hydration checks; report inherited warnings separately.
- [ ] Capture before/after Default, CRM, Finance, Tasks, Mail, Kanban, Profile and Auth V2 login in light/dark × desktop/mobile, with expanded/collapsed navigation where applicable; upload only to pr-assets.
- [ ] Record Impeccable after-state critique and before→after scale table in PR.
- [ ] Publish only an isolated tenboards-preview version and open the signed-off PR to main for Claude review; implementer never merges.

## Decisions

The existing Tailwind spacing token and Card `--card-spacing` seam avoid broad per-screen edits or changes inside protected wrappers. No structural prefactor was needed. One shared header-height token keeps header and viewport-height app layouts synchronized. The screenshot harness gains optional computed measurements and a font selector.

Desktop spacing changes from 4px to 3.5px; mobile retains 4px. Typography changes globally; mobile inputs stay 16px to avoid Safari focus zoom. Small cards retain 12px. Button targets have a 24px minimum. The rem root, sidebar widths, breakpoints, chart and calendar coordinate contexts remain stable. No dependencies, auth behavior, palette or registry changes.
