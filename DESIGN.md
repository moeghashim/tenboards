---
name: tenboards
description: Refined product UI for a complete admin dashboard starter
colors:
  primary: "#1e40af"
  primary-dark: "#a9c2ff"
  bg: "#f8f9fb"
  surface: "#ffffff"
  surface-raised: "#f0f2f5"
  text: "#181c25"
  text-muted: "#515b6b"
  border: "#dbe0e8"
  border-strong: "#788397"
  bg-dark: "#111318"
  surface-dark: "#191d25"
  surface-raised-dark: "#252b36"
  text-dark: "#f3f5f9"
  text-muted-dark: "#b0bacb"
  success: "#166534"
  warning: "#854d0e"
  danger: "#a81928"
  info: "#1e40af"
typography:
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "14px"
  mono:
    fontFamily: "Geist Mono Variable, monospace"
  title:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    letterSpacing: "-0.025em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  compact: "12px"
  card: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    height: "32px"
---

# Design System: tenboards

## Overview

**Creative North Star: "Refined product UI"** — the approved Linear/Vercel register in PLAN §7. Precision, scanability, and restraint serve dense administrative work. PLAN and its Decisions log win every conflict.

The frontmatter records the implemented task 005 tokens. The default combines cool neutral surfaces with a deep blue action accent. Task 007 supplies token-only Graphite, Pine, and Iris alternatives. The v0.1 shell and v0.2 dashboard usages apply these tokens at usage sites; app-page content remains assigned to v0.3.

**Key Characteristics:** neutral-first surfaces, one action accent, crisp borders, compact data, restrained depth, and consistent control states.

## Colors

src/styles/styles.css owns normative light and dark roles. Shadcn background/card/popover map to bg/surface, their foregrounds map to text, and muted/secondary/accent hover surfaces map to surface-raised. Because shadcn uses “accent” for hover fill, action-accent names the saturated primary action color. Border is a decorative separator; border-strong is the accessible input/control edge. Ring is the action color and an opaque 2px outline supplements inherited translucent focus rings.

Supported AA text pairs: text, text-muted (including placeholders), primary, success, warning, danger, and info on each of bg/surface/surface-raised; primary-foreground on primary (including existing 80% hover fills); each semantic foreground on its matching semantic surface. All require 4.5:1, even for large text. Ring and border-strong require 3:1 against all three neutral surfaces. No claim is made for arbitrary cross-role combinations or inherited hard-coded chart/page colors. Low-contrast decorative border is never the sole control boundary.

Run `node --experimental-strip-types scripts/check-contrast.ts` against the dev server; `--presets` and `--base-url` support later preset/version checks. It resolves rendered CSS values, converts to sRGB, and checks WCAG relative luminance. Disabled controls retain native disabled semantics, pointer suppression, opacity, and cursor treatment; inactive controls are contrast-exempt, and their treatment must not be used for enabled explanatory text. Text selection and input carets use the primary pair.

Presets use only task 005 palette primitives. Default retains blue; Graphite uses charcoal/silver, Pine uses deep teal/mint, and Iris uses violet/lavender. Each changes only primary; all semantic colors, foreground pairings, focus, type, spacing, radii, and shadows inherit the shared contract. The generator resolves each swatch from its referenced root primitive and rejects unresolvable values. No literal palette values live in preset files.

Persisted Tangerine, Brutalist/Neo Brutalism, and Soft Pop selections migrate to Default during boot, before hydration, and their cookie is rewritten. The parser and preference store retain their existing allowed-value fallback; the provider reads the sanitized DOM. Valid new selections and the font registry remain intact. Verify all presets with `node --experimental-strip-types scripts/check-contrast.ts --presets default,graphite,pine,iris`.

Verified contrast floor (35 supported checks per mode, 2026-10-23; full results in PR evidence):

| Preset | Light text / hover | Dark text / hover | Light control / focus | Dark control / focus |
| --- | --- | --- | --- | --- |
| Default | 5.30:1 | 7.05:1 | 3.41:1 | 3.70:1 |
| Graphite | 6.11:1 | 7.26:1 | 3.41:1 | 3.70:1 |
| Pine | 4.67:1 | 7.26:1 | 3.41:1 | 3.70:1 |
| Iris | 5.63:1 | 6.79:1 | 3.41:1 | 3.70:1 |


## Typography

Geist Sans and Geist Mono are self-hosted through the approved Fontsource packages. The font registry retains every previous choice; default Geist stylesheets use local assets. Mono is loaded for code/data regardless of the chosen body face. The fixed scale is 12/13/14/16/20/24/30px; heading tracking is -0.025em. Tabular numerals are inherited globally so every metric aligns without per-widget edits.

## Layout

Existing screens use responsive grids, compact controls, and route-local components. Cards use 16px internal spacing (12px in small cards); default controls are 32px tall. Preserve page composition in v0.1; shared token changes may propagate automatically.

The app surfaces use **Operate** mode. Data density, scanability, native expectations, and consistency outrank expressive decoration. Mobile changes are structural, including the existing sidebar sheet and collapsing grids.

## Elevation & Depth

Cards preserve their inherited thin border/ring structure. Low elevation uses two subtle offset layers; overlays use wider layered shadows. Shared durations are 150ms and 200ms with standard ease-out; Tailwind transitions default to 150ms. Reduced-motion media rules reduce all animations/transitions to near-instant and disable smooth scrolling. Dashboard composition and JS chart behavior are handled by the shared presentation layer and route-local motion subscriptions.

## Shapes

Default control radius is 8px; shadcn aliases use 4/6/8/12/16/20/24px. Cards use the 12px step. Spacing primitives are 4/8/12/16/24/32px on the existing Tailwind rhythm. The floating sidebar uses the 24px radius step, larger than dense controls.

## Components

The original tenboards identity uses a paired-board “10” silhouette and a Geist wordmark. In the app, the mark inherits currentColor and is decorative beside the wordmark or a named link; isolated SVG assets carry their own accessible name. Favicons use the tested white-on-blue primary pair. The SVG wordmark master is dark-on-light; use the inherited-color React wordmark in dark UI. Metadata assets and vector masters are documented in README.

Use local Base UI-backed shadcn wrappers after inspecting their source. Button variants include primary, outline, secondary, ghost, destructive, and link; focus uses a border plus ring. Inputs have focus, invalid, disabled, and placeholder states. Cards use semantic card foreground/background with header/content/footer slots. Chips and navigation should share the semantic palette.

The locked sidebar reference is [docs/design-refs/sidebar-reference.png](docs/design-refs/sidebar-reference.png), inspected for this document. The implemented shell uses its inset floating rounded panel, workspace avatar/name and collapse control, search pill with ⌘K, regular-weight primary items with outline icons, soft gray active pills, secondary collapsible sections, pinned status card, and footer actions. Expanded navigation is 18rem wide; icon-collapse is 4.5rem. The panel sits 12px from desktop viewport edges; on mobile the sheet panel itself is inset 8px from the viewport, with 40px rows, 18px icons, 12px active pills, and a sticky viewport-height wrapper. Six primary items (Home, File Manager, Email, Chat, Calendar, Tasks) precede Dashboards, Pages, Legacy, and Misc sections. The demo card counts visited enabled `/dashboard/*` sidebar pages (25 total) since the sidebar mounted; footer actions are Settings, Help, Documentation, and Feedback.

The header is 56px tall, with a truncating current-page label, theme/settings/account controls, and a link to the tenboards repository. The Workspace prefix and repository link are hidden below 640px. The sidebar trigger appears on mobile and when desktop navigation is collapsed. Desktop search lives in the sidebar; below 768px the header gets a compact search trigger. The account menu uses clearly labeled demo identities with initials avatars.

The root command palette uses the existing cmdk and dialog wrappers and the shared retained-route catalog. Search rows are at least 40px tall; the result list scrolls within a bounded viewport. The dialog has a title, description, explicit search label, empty state, and a touch close button. ⌘K/Ctrl+K toggles the palette, including inside text fields. Alt/Shift, key repeat, IME composition, already-handled events, and another visible dialog/menu/listbox suppress the shortcut (the mobile navigation sheet excepted). The search input group uses one opaque 2px focus outline with 2px offset and 8px corners; the inner input outline is suppressed. Keyboard selection, Escape, and focus return are part of the component contract.

Layout settings is a right-hand sheet capped at 28rem on desktop and full width on mobile. Appearance and Layout sections group native labeled selects and fieldset radio choices. Controls are at least 40px tall; the body scrolls independently of its heading and reset footer. Selected choices use a neutral fill and 1px primary border; keyboard focus adds an opaque 2px outline with 2px offset. The Defaults footer derives all seven labels from the registry. Existing seven-day preference cookies and the separate sidebar-state cookie remain the only persistence contract; Reset also re-expands the sidebar. The visible variant/mobile explanations describe the supported sidebar adaptations.

## Do's and Don'ts

- Do use Impeccable and read its craft floor immediately before UI edits.
- Do preserve semantic shadcn compatibility, font choices, SSR, and preference behavior.
- Do verify rendered light/dark desktop/mobile states and contrast with evidence.
- Don't redesign dashboard or app-page content in v0.1.
- Don't treat documentation of a future design as proof it is implemented.
- Don't remove screens or copy third-party logos into the tenboards identity.


## Dashboard presentation foundation

The shared dashboard ancestor owns `DashboardCard`, `SectionHeader`, and `StatCard`. Compact/standard density maps to the existing 12/16px card spacing; headings are semantic h2/h3, labels wrap and metric values use tabular numerals. Optional help, trend and action slots retain route-owned data and behavior. The completed v0.2 implementation reuses these primitives across all 14 current/legacy dashboard routes; domain values and interactions stay local.

`src/lib/charts/theme.tsx` composes protected chart exports. Use `DashboardChart` for bounded responsive height and visible keyboard focus, `chartAxis` for 12px muted ticks, `chartGrid` for decorative dashed separators, `chartCursor`, `DashboardTooltip`, and wrapping `DashboardLegend`. `seriesConfig` deliberately selects chart-1/2/4/5 (primary, text-muted, success, warning) rather than duplicate Default chart-3. Every line also needs a distinct dash/marker or labeled form; multi-series charts use solid/dashed/dotted series with matching line samples, direct labels or accessible data tables. Marks use opaque token strokes, with area fills only as supplementary cues. Numeric formatters use explicit en-US locale; route code owns time ranges and units.

Pass `useChartMotion()` to every animated series and tooltip. Its server snapshot and initial hydration disable animation, then a guarded media-query subscription observes changes and permits 200ms animation only when reduced motion is off. No global tokens, font/preset registry or protected wrappers change.


The integrated dashboard layout uses equal-height cards within a common comparison row; stacked auxiliary columns align their outer bounds where they share that row. Independent work streams such as Productivity's main work and calendar/notes sidebar keep their content-driven heights. Tables scroll locally or reflow to labelled mobile fields; no data is hidden to fit.

Patient Monitoring retains local simulation and signal identity: labelled ECG/success, Pleth/info, Resp/warning and ART/danger traces. Continuous subscriptions pause under reduced motion, while numeric readings and a post-hydration live UTC clock remain available. Static date-based dashboards explicitly identify their deterministic demo reporting dates; no hydration warning suppression or page SSR removal is used.
