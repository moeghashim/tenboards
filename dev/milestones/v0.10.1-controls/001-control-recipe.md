# 001 — Shared control recipe and usage pass

Status: merged (#88). Branch: `feat/v0.10.1/001-control-recipe`. Base: main.

Read first: [direction-a.html](direction-a.html) (open it in a browser), [filter-row-defect.png](filter-row-defect.png), DESIGN.md, and the current `src/components/ui/{button,input,textarea,input-group,select,native-select,dropdown-menu,combobox,toggle-group}.tsx` and `src/styles/styles.css`.

This milestone may edit those primitives in place. That is a deliberate exception to "inspect wrappers, do not edit them". Keep every export, prop, variant name, size name and data-slot unchanged so existing call sites keep compiling and working.

## 1. One control recipe

Define the recipe once (CSS custom properties and/or a base-layer rule keyed on data-slot, in `styles.css`). Apply it to: Input, Textarea, InputGroup, SelectTrigger, NativeSelect, ComboBox input, `input[type=date|time|datetime-local|month]`, and Button `outline`. Use only existing semantic tokens. New CSS variables may be derived from them with `color-mix` (no raw literals in page/block code).

- **Rest:** `--surface`/card fill. A 1px inset hairline (inset box-shadow or border, but consistent everywhere) that measures ≥3:1 against bg, surface and surface-raised in all four presets, light and dark. A barely visible 1px low shadow in light mode; in dark mode a faint inset top highlight replaces it.
- **Hover:** the hairline darkens to the text-muted strength. No fill change on inputs.
- **Focus-visible:** exactly one ring, a 1px primary edge plus a ~3px primary halo (about 20% mix). Remove the doubled translucent `ring-3` + opaque `outline` combination for these controls. The halo must still give a ≥3:1 focus indication; keep an opaque indicator if needed to pass. Elements outside this recipe keep the existing global outline.
- **Invalid:** a destructive edge and soft destructive halo. Field errors render below the field as an icon plus message (Field/FieldError if present).
- **Disabled:** unchanged semantics: opacity, no pointer events, not-allowed cursor.
- **Heights:** keep the density contract: 28px desktop default, 32px mobile, `sm`/`lg` steps unchanged. Every recipe control at a given size has the same outer height, including date inputs and native selects. Today native selects and date inputs can render taller.

## 2. Buttons

- `default` (primary): a subtle vertical highlight (top a little lighter via `color-mix`, bottom = primary), an inset top highlight, a 1px darker edge and a low shadow. Hover darkens, instead of the current 80% opacity. Press keeps `translate-y-px`.
- **Dark mode primary:** a saturated blue fill with white text (`--primary-foreground` white), at AA 4.5:1. Today it is a pale periwinkle with dark text. Change only the Default preset's dark primary pair and keep Graphite, Pine and Iris passing. Charts that use `--chart-1` must stay distinguishable; check the dashboards.
- `outline` uses the control recipe. `ghost` is transparent at rest, gets a surface-raised fill on hover, and uses muted text that turns to full text on hover.
- **Usage:** in page toolbars, secondary actions (Hide, Customize, Export, Filters, Org chart and similar) switch from `outline` to `ghost`, with icons kept. The one primary action stays `default`. Do this on Users, Products, Roles, Invoice, Profile, Projects, the File views and any dashboard header toolbar.

## 3. Select, NativeSelect and menus

- **Trigger arrow:** a fixed inset slot (16px icon, 10px from the right edge), with text left padding equal to that inset. Native selects use `appearance: none` with our icon, never the browser arrow. The same applies to date inputs: a consistent calendar indicator inset, and text not crowded against the edge.
- **Popups** (SelectContent, DropdownMenuContent, ComboBox, ContextMenu, Menubar):
  - 10px radius, a 1px border-token edge, and the overlay shadow.
  - 5px padding, 30px item rows on desktop (keep the larger mobile rows), 6px item radius.
  - Selection check in a left column, aligned for every row.
  - Group labels in 12px muted text.
  - A right-aligned, muted, tabular count slot (optional prop or child).
- **Search in long Select lists:** a Select with more than 8 options in a filter context may show a search field at the top. Use the existing ComboBox, or a filter inside the popup, but do not add a dependency. Apply it to the Users Role filter at minimum.

## 4. Clearable filter triggers

- Add an optional mode to the existing Select trigger (or a small block in `src/components/blocks/`, exported and documented in `/dashboard/kit`). When the value is the "all" sentinel, it shows only the label ("Role ⌄"). When set, it shows "Role: Admin" with an accent tint (primary mixed ~7% into surface, primary-mixed edge, primary text) and a separate clear button.
- The clear button has its accessible name ("Clear Role filter"), a ≥24px target, keyboard focus, and focus returns to the trigger after clearing. Do not nest it inside the trigger button.
- Use it on the Users filters (Role, Team, Status, Workspace) and Products filters.

## 5. Filter rows: one height, one bottom edge

- Wherever a row combines labelled controls with buttons (filters, date ranges, settings forms), the row aligns items to the end (`items-end`). Every control and button in it uses the same size step, so Apply is the same height as the fields and its bottom edge lines up with theirs.
- Add a regression example to `/dashboard/kit`: a labelled row with a Select, NativeSelect, two date inputs and an Apply button, matching the shape of `filter-row-defect.png`.
- Document the rule in DESIGN.md and the `tenboards-build-ui` skill ("filter rows: one size step, align end, use NativeSelect/Select, never raw `<select>`"). Mirror the skill to `.claude/skills/`.
- Extend `check:design` to flag a raw `<select>` or `<input type="date">` in route/block code that bypasses the primitives, unless it is in the existing exception list.

## 6. Docs and evidence

- DESIGN.md: rewrite the Components control paragraph and the frontmatter `button-primary`, and add "Control recipe" and "Filter rows" sections. Record the measured contrast for the hairline and focus in the contrast table, rerunning `scripts/check-contrast.ts --presets default,graphite,pine,iris`.
- Regenerate `.impeccable/design.json` from DESIGN.md (it is stale).
- README: the status line and a short "v0.10.1 refines controls" note. Update the CHANGELOG draft section and the milestone status.

## Acceptance criteria

- [x] All recipe controls render the same height per size step on desktop and mobile. Measured with getBoundingClientRect on the kit regression row: every control's height and bottom edge are equal within 0.5px.
- [x] No browser-native select arrow anywhere in `verify:page --all` captures. Chevron inset is identical across Select and NativeSelect.
- [x] Hairline ≥3:1 and focus indicator ≥3:1 against bg/surface/surface-raised in all four presets, light and dark. Dark Default primary/primary-foreground ≥4.5:1. The contrast script passes.
- [x] Exactly one visible focus treatment on recipe controls (screenshot evidence of keyboard focus on input, select trigger, native select, date and button).
- [x] Toolbars on the listed pages show one filled primary action, with secondary actions as ghost.
- [x] Clearable filters work by mouse and keyboard and have correct names. axe is clean.
- [x] Menus: left checks, group labels, counts on the Users Role filter, search on long lists, 30px rows.
- [x] `npm run build`, `npm run check` (no new design exceptions), `npm run typecheck`, `npm run verify:page -- --all` pass, with zero axe violations and zero hydration/console errors. Assistant tests (`assistant:test`, `assistant:server`) still pass.
- [x] Before/after screenshots (light/dark × desktop/mobile) of Users, Products, Profile, Assistant composer, the kit regression row, an open Select and an open DropdownMenu, uploaded only to pr-assets. Isolated preview deployment `pr-NNN` linked in the PR.
- [x] README, CHANGELOG, DESIGN.md, the skill (plus mirror), `.impeccable/design.json` and the milestone status updated.

Verified in PR #88: 148 full-catalog mode/viewport cases passed, plus the final Assistant rerun. Kit controls each measure 28px / bottom 286.25px at 1440×1000 and 32px / bottom 425.25px at 390×844, in both modes. Evidence is on pr-assets under v0.10.1/001.
