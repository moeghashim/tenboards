# v0.10.1 — Control refinement (direction A)

Status: **in review**. Contract: PLAN.md Decisions log, "v0.10.1 control refinement" (2026-11-11).

Goal: text fields, buttons, selects and menus read as one calm, precise set. Today they are stock shadcn: heavy field borders next to faint button borders, outlined toolbar buttons that compete with the primary action, filters that always look set, a doubled focus ring, a pale dark-mode primary, and filter rows whose controls have different heights and arrow placement.

| Task | Depends on | Contract |
| --- | --- | --- |
| 001 — Shared control recipe and usage pass | main | [001](001-control-recipe.md) |

References:
- [direction-a.html](direction-a.html) is the approved mockup (light and dark), with option B shown only as the rejected alternative.
- [filter-row-defect.png](filter-row-defect.png) shows the defect to prevent: browser-default select arrows, 40px fields beside a 32px button, and a button centered against label+field instead of aligned with the field.

Branch: `feat/v0.10.1/001-control-recipe`, one PR to main.

Out of scope: new dependencies or fonts, new color presets, density changes, layout redesigns of individual screens, and behavior changes (except the filter clear affordance).
