# Task 006 verification

Final version: https://c2ec54fc-tenboards.mohanadgh.workers.dev/dashboard/productivity
Alias: https://v02-006-tenboards.mohanadgh.workers.dev/dashboard/productivity

## Root causes and reproduction

The incumbent route read the runtime clock for calendar today/month and module-time project/note dates. With a Pacific/Kiritimati dev server and America/Chicago browser, the SSR due date was Nov 2 while the client rendered Nov 1. `before-timezone` retains the four failed cases and complete React diagnostics. `before-workers` retains four React #418 failures. A separate incumbent Workers SSR inspection on October 23, 2026 showed project dues Jan 10/22/19 and a January note title, while the client calendar displayed October: module-start dates were not a valid demo fixture.

The route now creates explicit October 23, 2026 local calendar fields at noon. Projects and notes derive their dates from this fixture. Calendar today, selected day and initial month are all explicit. The demo day is visible. No runtime clock was frozen, no SSR was disabled and no hydration warning was suppressed. Actual timezone differences are retained in verification.

The keyboard scenario exposed another incumbent issue: CalendarDayButton created a focus ref but never attached it. The local ProductivityDayButton adapter forwards an attached ref through the existing wrapper and focuses only when DayPicker requests focus. Protected shared calendar/UI files remain unchanged. `interactive-focus.log` records the old ArrowRight focus staying on November 4; final scenarios assert focus on November 5 before Enter selects it.

## Evidence map

- `before` and `after`: required initial render light/dark × 1440×900 and 390×844, captured with npm run screenshots and visually inspected.
- `presets/{default,graphite,pine,iris}`: all 16 content states inspected. The subsequent focus adapter does not alter initial visual styling.
- `after-timezone`: Kiritimati dev server (port 3001) vs Chicago browser, direct + refresh, eight cases. No clock substitution.
- `default-smoke`: dev Default route, four states.
- `workers`: final version, Default and Productivity, Chicago direct + refresh, 16 cases.
- `workers-kiritimati`: final version, Productivity Kiritimati direct + refresh, eight cases.
- `interactive` and `workers-interactive`: Space completes first task; Tomorrow and Planning selections asserted; Enter changes month, ArrowRight focus and Enter selection asserted on November 5; Start retains the inherited 90:00 placeholder. Open Task period menu captured separately in `-controls.png` because full-page resizing can dismiss anchored menus.
- `contrast.json`: 280 passing supported token-pair checks across four presets and two modes. No token or new chart/status pairing introduced. Labels accompany all progress values; outline status badges use existing text pairs.
- `identity-audit.txt`: scoped upstream-author identity search has no matches.
- `deploy.log`, `check.log`, `typecheck.log`: final build/upload, Biome and TypeScript output. Existing highlighter noArrayIndexKey warning and six Analytics informational lints are inherited from the base. Build third-party directive/chunk warnings are inherited.

## Failures retained and resolved

Before-fix hydration errors are in `before-timezone.log` and `before-workers.log`. Interaction development failures retain exact output: stale selected-day accessible name (`interactive-initial-failure.log`), arrow focus (`interactive-focus.log` / `interactive-wait.log`), and synchronous state assertions (`interactive-assertion-failure.log`). Assertions now wait for committed selected text and focus. `typecheck-initial-failure.log` records TS2322 for the wrapper's omitted ref type; typed forwarded props fix it without casts or any. `after-network-failure.log` / report retain external fonts.gstatic.com ERR_TIMED_OUT errors; `workers-kiritimati-initial-failure.log` / JSON retain a network-idle timeout. These are retried without filtering console/request errors.

The T3 collaborative snapshot endpoint repeatedly failed with `Preview snapshot failed: Preview automation snapshot failed on client preview-3b0bf85c654e3ddda362a235782eaa1f.` / PreviewAutomationExecutionError. The existing required repository screenshot runner supplies complete visual and interaction evidence. No production deploy or merge was performed.

## Deliberate retained behavior

New task/project/note and Start focus actions remain demo placeholders. Summary Focus says 2 hours while the focus card retains its inherited 90-minute fixture; no timer semantics were added. Focus and This Week each occur in both summary and detail headings. Progress uses the existing 4px track with explicit names and percentages. Notes now show explicit dates instead of relative Today/Yesterday labels.

## Outstanding GitHub merge check

DCO reports ACTION_REQUIRED because the six author sign-offs are missing. This is separate from the passing implementation gates above. Exact DCO output: [dco.txt](../v02-batch-001-006/dco.txt). PRs #14–#19 identify this blocker; author certification and reviewer-owned stack remediation remain. Final006 commit: 174d980 (documentation-only amendment after verified runtime build).
