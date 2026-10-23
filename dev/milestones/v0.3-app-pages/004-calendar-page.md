---
id: "004"
title: Restyle Calendar and fix hydration
milestone: v0.3-app-pages
status: planned
category: ui
files: ["src/routes/(main)/dashboard/calendar/", "README.md", "dev/milestones.json"]
---

## Scope

Routes: `/dashboard/calendar`.

- Restyle date heading, navigation, calendar/view selectors, event cells, overflow/popovers and event states through existing semantic tokens and `EventCalendarViews` usage-site options. Keep Month/Week/Day, Today/previous/next, view event counts and current demo interactions.
- Inspect module-time event construction in `events-data.ts`, render-time `dateInfo`, FullCalendar SSR markup and browser/server timezone handling. Diagnose the actual HTML mismatch; these are candidate causes, not a proven diagnosis.
- Replace the author birthday in `events-data.ts` with a neutral demo identity and audit all event titles/details.
- Calendar exception for this milestone: `src/components/calendar/` may be restyled through tokens/usage sites, without rewriting behavior. **No structural edit inside that directory is preapproved.** If root-cause evidence requires one, document the exact file/change and rationale in this task and `dev/open-questions.md`, obtain reviewer approval, and pause that dependent edit. Shared `src/components/ui/` stays intact.

## Before implementation

Read root AGENTS.md, PLAN.md end to end (Decisions log wins; §7 governs), PRODUCT.md and DESIGN.md. Use Impeccable in Operate mode, run its context once per session from the repo root, inspect incumbent renders and local/Base UI wrappers, and read `reference/craft-floor.md` immediately before UI edits. Preserve existing demo behavior and all screens. Read current official TanStack documentation before any routing/framework change.

Prefactor inspection: Inspect the adapter’s existing `CalendarOptions` override spread, event/date construction and controller callbacks. Prefer a route-local date/formatting seam or supported options; do not assume a protected adapter rewrite is necessary.

## Acceptance criteria

- [ ] No React #418 hydration error in dev or Workers preview, light/dark × desktop/mobile.
- [ ] Fix the demonstrated root cause only: no suppressHydrationWarning, no SSR disabling, no frozen clocks. Verify direct navigation and refresh with real time, delayed JS and differing server/browser timezones; Today and live now indication retain correct meaning.
- [ ] Month/Week/Day, navigation, calendar selector, more-events popover and existing event interactions remain usable by keyboard/touch. Empty and crowded days, long titles and mobile grid/time axes remain readable.
- [ ] Calendar event text, meaningful event edges, selected/today/focus indicators have measured contrast and non-color labels in all presets; all author-linked event fixtures are neutral.
- [ ] Any necessary structural calendar change has explicit reviewer approval recorded before implementation; existing Calendar hydration entry is resolved with linked dev/Workers evidence only after verification.
- [ ] Capture and inspect before/after with `npm run screenshots` for every affected URL in light/dark × desktop (1440×900)/mobile (390×844); attach a four-state comparison table per route plus meaningful interaction/variant states. Store captures, reports and logs only on `pr-assets` or PR attachments, never main. For foundation/acceptance, compare their limited changes and integrated baseline explicitly; do not invent visual changes.
- [ ] `npm run build`, `npm run check` and `npm run typecheck` pass. Report inherited warnings separately from failures; baseline failures are not a passing gate.
- [ ] Dev `/dashboard/default` and every owned route smoke without console errors; repeat on the Workers version preview, including iframe contents and refresh where relevant. Existing errors on an owned page cannot be waived.
- [ ] Upload with `npm run preview:deploy -- --preview-alias pr-NNN` (actual PR number); include the version-specific preview URL and reusable alias in the PR. Never run `npm run deploy`.
- [ ] Update root README.md for verified screens/behavior/commands/status and state `README: updated (sections …)` in the PR. Tick this file and update `dev/milestones.json` only from evidence.
- [ ] Preserve keyboard access, accessible names, visible focus, reduced motion and all four presets. Check relevant changed foreground/background, status and meaningful graphic pairs for WCAG AA; record measured contrast for token/preset changes. Keep font/preferences registries, v0.1 shell and `src/components/ui/` intact. Reuse shared dashboard primitives and chart theme where applicable, without adding decorative charts.

## Execution order and delivery

After 001; execute after communications by default. Address the protected-adapter boundary and mandatory hydration diagnosis early.

One approved task per branch `feat/v0.3/NNN-slug` and PR targeting main. Prefer updated main after predecessors merge; declare any approved stack, base PR, merge order and layer compare URL. One commit per stacked layer; use Conventional Commits and `git commit -s` for DCO, ending with a blank line and `Co-Authored-By: GPT-6-Astra <noreply@openai.com>`. Claude Opus 5.5 reviews and holds delegated squash-merge/rebase authority; the implementer never merges, deploys production, or creates tags/releases.

Do not edit PLAN.md or generated route/build/Worker files. No new runtime dependencies, auth behavior changes, or structural calendar edits without escalation/reviewer approval. Record blockers in `dev/open-questions.md`, pause dependent work and finish independent work. This planned task does not authorize implementation before breakdown approval.
