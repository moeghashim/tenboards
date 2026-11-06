# 004 — Dashboard canvas, refresh and targeted edits

Status: approved. Branch: `feat/v0.10/004-dashboard-canvas`. Depends on 002 and 003.

## Scope

- When a reply is a dashboard, show it on a full-width canvas in the Assistant (desktop and mobile), using the dashboard grid and blocks.
- **Refresh:** re-run the dashboard's data references (and range/segment filters exposed as controls) without calling the model or changing the layout.
- **Targeted edits:** a follow-up such as “add a chart of refunds” or “make this a bar chart” changes only the affected panel; other panels keep identity and data.
- State stays in the mounted view (no persistence), consistent with v0.7. Stop, Regenerate, errors and rate-limit behavior keep their v0.7 semantics.
- Recorded mode: at least three recorded dashboard prompts plus one recorded edit and refresh flow, so the live demo shows the whole feature with no keys.
- Kit/llms: mention generative dashboards in the homepage features, README and `/llms.txt` sources once live.

## Acceptance criteria

- [ ] Recorded flows (create, refresh, edit) work on the preview Worker with no keys; mocked provider flows pass for all five providers.
- [ ] Refresh makes no model call (asserted in tests); edits change only targeted nodes (asserted).
- [ ] `verify:page -- /dashboard/assistant` and `--all` pass; keyboard and screen-reader flow for canvas, filters and refresh; reduced motion respected.
- [ ] Build, check (no new design exceptions), typecheck pass; evidence to pr-assets only.
- [ ] docs/assistant.md, homepage copy, README, CHANGELOG, llms sources and milestone status updated.
