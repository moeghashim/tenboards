# v0.1 — Design system and shell

Status: in progress; breakdown awaiting review. Only tasks 001 and 002 are pre-approved for implementation.

- 001: implemented; [PR #1](https://github.com/moeghashim/tenboards/pull/1) open for Claude review and user merge.
- 002: implemented and deployed; stacked on 001, awaiting PR review and user merge.
- 003–012: planned only; do not start until breakdown approval.
- Live: https://tenboards.mohanadgh.workers.dev
- Task 002 version preview: https://9913d738-tenboards.mohanadgh.workers.dev

## Definition of Done

- [ ] Entire upstream screen catalog remains available, with MIT attribution and no upstream Git history or remote.
- [ ] Demo runs without environment variables or a database and is live on Cloudflare Workers.
- [ ] Impeccable PRODUCT.md, DESIGN.md, and root AGENTS.md reflect PLAN and mode Operate.
- [ ] Accessible light/dark tokens, Geist defaults, tenboards identity, and rebuilt presets are integrated.
- [ ] Sidebar matches the locked reference; header, global command palette, and settings panel work on desktop/mobile.
- [ ] Repeatable all-route light/dark × desktop/mobile screenshot tooling exists; evidence stays off main.
- [ ] Every PR passes build, Biome check, typecheck, and /dashboard/default console-error-free smoke.
- [ ] Each task has its own PR for Claude review; only moeghashim merges. No v0.2+ feature or restyling work.

## Execution order and rationale

1. [001 — Import upstream and establish tenboards basics](001-import-upstream.md): A runnable, attributed baseline is needed by every later task.
2. [002 — Deploy the demo to Cloudflare Workers](002-workers-preview.md): The user needs a live URL before design iteration.
3. [003 — Establish Impeccable context and contributor rules](003-impeccable-context.md): Design authority and contributor rules must precede visual changes.
4. [004 — Add repeatable route screenshots](004-visual-capture.md): Moved ahead of tokens so every remaining UI PR can include the full required comparison matrix.
5. [005 — Define accessible tenboards design tokens](005-design-tokens.md): Tokens are the foundation for brand, presets, and all shell components.
6. [006 — Create the tenboards identity and assets](006-brand-assets.md): Identity uses finalized tokens and is ready for the rebuilt shell.
7. [007 — Rebuild presets on tenboards tokens](007-theme-presets.md): Stable preset contracts prevent shell work from relying on discarded colors.
8. [008 — Rebuild the sidebar to match the locked reference](008-floating-sidebar.md): Sidebar defines shell geometry and supplies palette and settings entry points.
9. [009 — Refine the responsive shell header](009-shell-header.md): Header layout follows finalized sidebar dimensions and navigation.
10. [010 — Connect a searchable command palette across all routes](010-command-palette.md): Final shell entry points are known before expanding palette behavior.
11. [011 — Redesign the layout-settings panel](011-layout-settings.md): Customizer is finalized after the shell and presets it controls.
12. [012 — Verify v0.1 shell coverage and handoff](012-shell-acceptance.md): A final integration pass catches interactions among independently reviewed shell PRs.

## Workflow

Branch feat/v0.1/NNN-slug from updated main after the predecessor merges; otherwise stack on its branch and declare it in a PR targeting main. Squash on user merge. Every commit ends with `Co-Authored-By: GPT-6-Astra <noreply@openai.com>`. Every UI edit follows Impeccable craft-floor and rendered visual verification; until 004, attach at least desktop light/dark before/after evidence. From 002 onward include a Workers version preview URL. Redeploy from main manually after each merge.

Before implementation, inspect for small behavior-preserving prefactors that make the change simpler or safer. Do not refactor speculatively. Never regenerate PLAN.md or dev/** as code output.

Escalate Decisions-log conflicts, unapproved runtime dependencies, new environment/config keys outside the plan, auth/credentials/telemetry/secrets, or milestone crossings to dev/open-questions.md and pause. The approved Wrangler/Nitro deploy configuration is within task 002. Root AGENTS.md must wait for breakdown approval and task 003.
