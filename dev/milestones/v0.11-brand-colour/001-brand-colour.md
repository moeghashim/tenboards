# 001 — Brand colour config, generator and docs

Status: merged (#89). Branch: `feat/v0.11/001-brand-colour`. Base: main.

Read first: PLAN.md Decisions row "v0.11 brand colour", DESIGN.md (Colors, presets, contrast table, Control recipe), `src/styles/styles.css` (including the dark Default override block added in v0.10.1, near the bottom), `src/styles/presets/*`, `src/scripts/generate-theme-presets.ts`, `src/lib/preferences/*`, the layout settings sheet, `scripts/check-contrast.ts`, and the `tenboards-build-ui` skill.

## 1. Setting

- Add a root `tenboards.config.ts`: `export default defineTenboardsConfig({ brand: { color: undefined } })`. It must be typed, documented inline, and importable by both scripts and the app build.
- `brand.color` accepts `#rgb`, `#rrggbb`, `rgb()` or `oklch()`. Unset means today's behaviour exactly: tenboards blue Default plus the Graphite/Pine/Iris picker.
- Optional `brand.exact: boolean` (default false), matching the `--exact` flag.

## 2. Command

- `npm run brand -- "#7c3aed"` validates the input, writes `brand.color` into `tenboards.config.ts` (a minimal, stable edit), and regenerates `src/styles/brand.css`. `npm run brand -- --reset` unsets the colour and restores the default `brand.css`. `npm run brand -- --check` regenerates in memory and fails if the committed `brand.css` is stale. Add the check to `npm run check`.
- Output is a short report:
  - the input colour;
  - the derived light/dark values, saying which were adjusted, why, and by how much;
  - the contrast ratios achieved.
- Invalid input gets a clear error with accepted formats and exits non-zero, with no files written.
- `--exact`: if any derived role would need adjusting, fail, explain the failing pair, and suggest the nearest passing value.

## 3. Derivation (OKLCH, keep the hue)

Generate these roles for light and dark: `--primary`, `--primary-foreground`, `--action-accent` (text, links and selected marks), `--ring`, `--chart-1`, and the primary hover/top values the control recipe uses. All values are written as literals in the generated file only.

- **Button fill + label:** pick white or near-black foreground, whichever needs the smaller lightness change. Reach ≥4.5:1, including the hover fill.
- **Action accent as text:** ≥4.5:1 on bg, surface and surface-raised.
- **Ring and selected edges:** ≥3:1 against bg, surface and surface-raised.
- **Light mode** starts from the given colour. **Dark mode** derives its own fill and a lighter accent from the same hue, the way v0.10.1's dark Default does (saturated fill with white text, lighter accent for text and ring).
- **Adjust lightness first**, then reduce chroma only if out of the sRGB gamut. Never change the hue by more than 2°. Report every adjustment.
- **Chart distinguishability:** chart-1 must stay distinct from chart-2/4/5, the muted, success and warning series. If the brand hue is within ~25° of the success or warning hue, keep the colour but rely on the existing dash/marker encodings, and print a note. Do not change semantic colours.
- The generated `brand.css` replaces the hard-coded Default light primary and the dark Default override block in `styles.css`, so there is one source. With brand unset, the generated file must reproduce today's values byte-for-byte in computed style. Prove it with a computed-style diff of the tokens.

## 4. Themes hidden when a brand is set

- With `brand.color` set:
  - the layout settings sheet omits the theme picker entirely, with no empty heading or gap;
  - the Defaults footer and reset logic do not mention presets;
  - the root sets no `data-theme-preset`.
- A persisted preset cookie is ignored and rewritten to default during boot, before hydration, through the existing migration/sanitizer path. There must be no hydration mismatch and no flash of the old preset.
- `/dashboard/kit` and any preset swatches render the brand.
- With brand unset, everything behaves as on main today.

## 5. Agents and docs

- AGENTS.md: one map/build-loop line ("Brand colour: set `brand.color` in tenboards.config.ts or run `npm run brand -- <color>`; never hand-edit primary tokens").
- `tenboards-build-ui` skill plus its `.claude` mirror: a short "Brand colour" section with the command, what it changes, and what it does not change.
- README "Brand colour" section with an example and a light/dark screenshot of one non-default brand. Update docs/reference.md, DESIGN.md (Colors: the brand source of truth, derivation rules, themes hidden when branded), CHANGELOG draft, `/llms.txt` and `llms-full.txt` sources, and `.impeccable/design.json` if tokens are documented there.
- `check:design` keeps banning raw colour literals in route/block code. `brand.css` is the generated exception and carries a generated header saying not to edit it.

## Acceptance criteria

- [x] Brand unset: computed token diff against main is empty in light and dark for all four presets. The picker still works and existing checks pass.
- [x] Generator matrix (unit test, `npm run brand:test` or included in an existing test script): `#facc15`, `#22c55e`, `#000000`, `#ffffff`, `#7c3aed`, `#e11d48`, `#0ea5e9`, `#1e40af`, `oklch(0.7 0.15 200)`, `rgb(255 128 0)`.
  - Each produces passing roles, with hue drift ≤2°.
  - `--exact` fails for at least `#facc15` and `#ffffff`.
  - Invalid inputs (`blue-ish`, `#12`, `oklch(2 0 0)`) error with no writes.
- [x] `npm run brand -- "#7c3aed"` then `node --experimental-strip-types scripts/check-contrast.ts` against the dev server passes in light and dark. Do the same for `#facc15` (auto-adjusted) and `#e11d48`.
- [x] Branded: the picker is hidden; a stale `graphite` cookie is rewritten with no hydration/console errors; `verify:page --all` passes with zero axe violations.
- [x] `npm run brand -- --check` is wired into `npm run check` and fails on a hand-edited `brand.css`. `--reset` restores the exact committed default.
- [x] `npm run build`, `npm run check` (no new design exceptions beyond the generated file), `npm run typecheck` pass. The committed repo state is brand-unset, so the live demo and previews look unchanged.
- [x] Screenshots of three brands (`#7c3aed`, `#e11d48`, `#facc15` adjusted) at light/dark × desktop on Users, Default dashboard and the open settings sheet, uploaded only to pr-assets. Isolated pr-NNN preview deployed with the repo default (unset).
- [x] README, AGENTS.md, skill plus mirror, DESIGN.md, docs/reference.md, CHANGELOG, llms sources and milestone status updated.
