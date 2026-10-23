# Accessibility and interaction evidence

These are scoped automated checks and visual/keyboard spot checks, not a complete accessibility certification. All final reports and exact case counts are indexed in [supplemental-manifest.json](supplemental-manifest.json).

- Shell: every preset/theme/viewport on both environments (32 cases). Sidebar accessible names and expansion; visible 2px focus; command palette arrows, Escape and return focus; settings native radio/select keyboard access, focus containment/return; preferences across refresh; reduced-motion transitions at most 1ms. See shell-* reports (dev Default uses shell-dev-default-viewport).
- App pages: Mail and Chat standalone/iframe controls and focus; Kanban board/list/table and drag/cancel; Tasks overlays; File Manager grid/list and query reload; Products dialog validation/return focus and table scrolling; Users filtering/pagination and Roles tabs; all six Profile tabs; Auth invalid/valid demo submits and linked errors. Reports retain individual interactionNotes. See interactions-*-a and interactions-*-b.
- Live and boundary states: Calendar/Invoice/Patient Monitoring delayed real-clock direct/refresh cases; Invoice print and date-picker focus return; root 404 semantics and actual root error/recovery; default smoke. See live-* and boundaries-* plus [print validation](print-validation.json).
- Heading hierarchy, wrapping, viewport containment and local table overflow were inspected on owned page renders during each layer and the integrated matrix. Small tables retain horizontal scrolling. The intentionally bare /auth/v2 layout is empty on mobile; it is still captured and covered.

## Contrast evidence

[Dev tokens](contrast-dev.json) and [Workers tokens](contrast-workers.json): 280 supported token comparisons each, 560 total; all pass their declared threshold (4.5 for normal text, 3 for meaningful graphics). The minimum ratio across the combined text/graphic set is 3.409 for a graphic pair, not a text pair. No preset/token edits occur in acceptance.

Actual-surface evidence from owning layers:

- [Calendar event/selection surfaces](../v03-004/contrast.json)
- [Kanban status/selection surfaces](../v03-005/contrast.json)
- [Tasks statuses](../v03-006/contrast.json)
- [Invoice paper surface](../v03-007/contrast.json)
- [Products stock/status](../v03-009/surface-contrast.json)
- [Users/Roles status surfaces](../v03-010/surface-contrast.json)
- [Auth V2 actual foreground/background](../v03-012/actual-surface-contrast.json)
- [Retained dashboard meaningful charts](../v02-001/chart-contrast.json)

Prior owning-layer reports remain evidence for their unchanged pairs; final token checks and the 1,216-route visual matrix cover integration. This does not claim an exhaustive screen-reader audit or every chart datapoint pair.
