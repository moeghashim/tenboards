# v0.11 — Brand colour

Status: **implemented; awaiting review**. Contract: PLAN.md Decisions log, "v0.11 brand colour" (2026-11-11).

Goal: an adopter, or their coding agent, recolours tenboards to their brand with one setting or one command. They don't have to pick a built-in theme or hand-edit tokens, and the result always meets WCAG AA in light and dark.

| Task | Depends on | Contract |
| --- | --- | --- |
| 001 — Brand colour config, generator and docs | main | [001](001-brand-colour.md) |

Branch: `feat/v0.11/001-brand-colour`, one PR to main.

Out of scope:
- An end-user colour picker or per-user/per-tenant branding at runtime.
- Logo or favicon replacement, fonts, radii, and neutral or semantic status colours.
- New runtime dependencies (a dev-only colour library needs reviewer approval; prefer a small in-repo OKLCH ↔ sRGB conversion, since `scripts/check-contrast.ts` already does luminance math).

Implementation: [PR #89](https://github.com/moeghashim/tenboards/pull/89), awaiting review (not merged).
Isolated brand-unset preview: https://pr-89-tenboards-preview.mohanadgh.workers.dev
