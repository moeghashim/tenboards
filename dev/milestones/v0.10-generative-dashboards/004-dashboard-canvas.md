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

## Spike clarifications (accepted by reviewer and user 2026-11-06)

- Keep validated panel definitions/IDs separate from snapshots in mounted state. Render keyed panel boundaries rather than keying the whole canvas by serialized response text.
- Refresh calls 003's guarded resolver with refs only; replace snapshots atomically after revision/generation checks, retain visibly stale data on failure and clear it on session loss. Only capability-catalog filters are exposed; no polling or generated form/action language.
- Edits produce a validated single-panel subtree; application constructs a version-1 replace/add patch with baseRevision and targetId. Preserve replacement ID; assign additions locally and append. Validate the resulting whole dashboard before atomic commit. No arbitrary paths, raw mergeStatements patches, removal or reordering. Ambiguous natural-language targets require panel selection.
- Preserve unchanged panel objects and data; execute tools only for new references. No client-provided snapshot is trusted as a tool result. Stop/stale revision/error discards the pending edit.

Additional acceptance:

- [ ] Tests assert stable unchanged panel identity/data, stale-patch rejection, whole-tree validation, model-free refresh and zero provider egress for three recorded creates plus recorded edit/refresh. Existing conversation lifecycle and history byte caps remain intact.
