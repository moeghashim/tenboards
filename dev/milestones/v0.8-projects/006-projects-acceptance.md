---
id: "006"
title: Integrated Projects acceptance and documentation
milestone: v0.8-projects
status: todo
category: acceptance
files: ["scripts/", "README.md", "CHANGELOG.md", "DESIGN.md", "docs/data.md", "docs/auth.md", "dev/milestones/v0.8-projects/", "dev/milestones.json", "dev/open-questions.md"]
---

## Goal and scope

Verify the complete milestone, reconcile delivered documentation and hand release readiness to Claude. Fix only narrow in-scope acceptance failures; any expanded auth/dependency/product work must be logged and paused.

Follow the [milestone contract](README.md), PLAN Decisions and AGENTS. All acceptance below is pending implementation.

## Files and ownership

- `scripts/`
- `README.md`
- `CHANGELOG.md`
- `DESIGN.md`
- `docs/data.md`
- `docs/auth.md`
- `dev/milestones/v0.8-projects/`
- `dev/milestones.json`
- `dev/open-questions.md`

Changes stay within the named task. Shared route metadata is generated only by the existing tool; protected UI/calendar wrappers and PLAN stay intact. README/status changes belong to the same PR.

## Before implementation

Inspect task evidence, final route/read registries and latest density/Assistant merges before adding checks. Reuse focused existing capture/parity/auth harnesses; avoid a new test framework or tests that merely mirror implementation.

## Acceptance criteria

- [ ] All previous acceptance criteria have evidence; no TODO view, dead link, mutation-looking placeholder, duplicated task domain or unlicensed-reference material remains. Every default/second/empty project view is usable.
- [ ] Full data parity plus fresh/populated/repeat migration-seed checks pass with preserved auth/adopter/unrelated data; report actual new read/scenario counts. Home/Overview/Board/List/Timeline share verified totals and identity.
- [ ] Node and compiled local workerd verify demo/DB/auth modes, guarded new route/RPC access, malformed/cross-project/missing IDs, revocation, DB/schema/config failure and recovery. No hosted DB or tenancy claim; previews remain ASSETS-only.
- [ ] Legacy HTTP/client redirects, query/hash/trailing slash rules, login returns and unchanged root/default/auth fallback destinations pass. Route catalog/generated metadata agree; static inventory has concrete project samples and dedicated redirect coverage.
- [ ] Full retained-route matrix plus new project cases passes light/dark × desktop/mobile across Default/Graphite/Pine/Iris. Inspect captures; sidebar variants/rail/off-canvas/mobile sheet, nested persistence and palette/header active labels agree. Preserve v0.7 Assistant/Chat if merged.
- [ ] Timeline chart/table/calendar data equality, keyboard/assistive-tech semantics, mobile table fallback, range clipping/unscheduled items, reduced motion and DST/leap/rollover cases pass. Delayed direct/refresh real-clock hydration shows no console errors.
- [ ] Read-only boundaries hold: no task mutation/DnD, favorite toggles, file upload/download service or membership/permission claims. Any generated data is clearly synthetic and counts reflect actual reads or explicitly labeled fixture summaries.
- [ ] README, CHANGELOG release draft, data/auth/capture documentation and DESIGN usage descriptions reflect delivered compact UI, new routes, redirects, additive migrations and storage behavior. Do not bump package versions, tag, release or edit PLAN.
- [ ] Milestone/task status and checked boxes reflect verified evidence only; record inherited warnings separately from failures and unresolved blockers in open questions. Publish pr-assets evidence plus immutable and alias demo preview URLs for review.
- [ ] Claude reviews, merges/rebases and owns production deployment/release; implementer reports readiness without performing those actions.

## Tests

Run npm run build/check/typecheck, default dev smoke, full npm run screenshots matrix with project-specific interactions and concrete IDs, npm run data:parity and relevant auth/migration/local workerd checks. Repeat only failed or materially changed cases. Required artifacts include consolidated pass/fail report, route/read counts, redirect table, migration preservation, keyboard/focus and timeline data-equivalence evidence. Upload artifacts only to pr-assets or attachments; no credentials, auth storage or reference-site assets.

Every task passes `npm run build`, `npm run check`, `npm run typecheck` and dev `/dashboard/default` smoke without console errors. Attach a demo-only immutable preview and alias; use only `npm run preview:deploy -- --preview-alias pr-NNN`. Evidence stays on pr-assets/PR attachments. Report inherited warnings separately.

## Dependencies and handoff

Depends on merged 005 and v0.6.2; v0.7 can release independently. Rebase on the actual integrated tree and rerun affected checks if the reviewer merges concurrent shell/catalog changes. No implementer merge/deploy/release. Any true blocker remains explicit rather than marking the milestone done.

One approved task per branch/PR; declare any stack and layer compare URL. Conventional commit with DCO sign-off and final `Co-Authored-By: GPT-6-Astra <noreply@openai.com>` trailer. Claude reviews and alone merges.
