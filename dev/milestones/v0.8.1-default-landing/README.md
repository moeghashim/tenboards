# v0.8.1 — Default dashboard landing

Status: **in-review**.

Task: 001 — Default dashboard landing. Approved contract: PLAN.md Decisions log, “v0.8.1 landing page” (2026-10-26). Branch: `feat/v0.8.1/001-default-landing`; base main; one layer.

Make `/dashboard/default` the app's landing page again. Reverses only the entry-point part of “v0.8 landing page”; Home and the Projects workspace remain unchanged.

## Scope

- `/`, `/dashboard` and `/dashboard/` keep their existing 307/replace redirect mechanism but lead to `/dashboard/default`.
- `DEFAULT_AUTH_DESTINATION` (post-sign-in, OAuth and unsafe-return fallback) becomes `/dashboard/default`. Validated return destinations still win; validation logic is unchanged.
- The sidebar brand link and global recovery links (root not-found, root error, Unauthorized, dashboard splat) open `/dashboard/default`. Prefer one shared landing constant over repeated literals where that clearly reduces risk.
- Unchanged: Home at `/dashboard/home`, its sidebar/palette position, Projects pages and their contextual links to Home, legacy Kanban/Tasks/Calendar/File Manager redirects, v1 alias redirects (their unsafe-return fallback follows the new default).
- Update check scripts (`scripts/*`) and screenshot tooling that assert the old landing; keep Home-specific checks pointed at Home.

## Acceptance criteria

- [ ] `/`, `/dashboard`, `/dashboard/` return 307 to `/dashboard/default` in dev and local workerd, demo and auth modes.
- [ ] Sign-in with no/unsafe `redirect` lands on `/dashboard/default`; safe `redirect` values still win; auth return/redirect/error checks pass.
- [ ] Brand link and global recovery links open `/dashboard/default`; keyboard access and accessible names preserved.
- [ ] Home, Projects, palette and legacy redirects behave as before (project redirect, workspace UI and access checks pass).
- [ ] Build, check, typecheck, dev `/` → `/dashboard/default` smoke without console errors; inherited warnings reported separately.
- [ ] Before/after evidence of the landing flow (light/dark × desktop/mobile) uploaded only to pr-assets.
- [ ] README (quick start link, live demo link, routing/landing sections), CHANGELOG draft and milestone status updated; PR links an isolated tenboards-preview version and alias.

## Decisions

No new dependency, auth-policy change, migration or design change. Claude Opus 5.5 reviews and holds merge authority; the implementer never merges or deploys production.
