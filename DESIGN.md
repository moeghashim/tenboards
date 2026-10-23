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

The frontmatter records the implemented task 005 tokens. The default combines cool neutral surfaces with a deep blue action accent. Task 007 replaces the inherited presets. Shell tasks 008–011 and screen work in v0.2/v0.3 remain separate.

**Key Characteristics:** neutral-first surfaces, one action accent, crisp borders, compact data, restrained depth, and consistent control states.

## Colors

src/styles/styles.css owns normative light and dark roles. Shadcn background/card/popover map to bg/surface, their foregrounds map to text, and muted/secondary/accent hover surfaces map to surface-raised. Because shadcn uses “accent” for hover fill, action-accent names the saturated primary action color. Border is a decorative separator; border-strong is the accessible input/control edge. Ring is the action color and an opaque 2px outline supplements inherited translucent focus rings.

Supported AA text pairs: text, text-muted (including placeholders), primary, success, warning, danger, and info on each of bg/surface/surface-raised; primary-foreground on primary (including existing 80% hover fills); each semantic foreground on its matching semantic surface. All require 4.5:1, even for large text. Ring and border-strong require 3:1 against all three neutral surfaces. No claim is made for arbitrary cross-role combinations or inherited hard-coded chart/page colors. Low-contrast decorative border is never the sole control boundary.

Run `node --experimental-strip-types scripts/check-contrast.ts` against the dev server; `--presets` and `--base-url` support later preset/version checks. It resolves rendered CSS values, converts to sRGB, and checks WCAG relative luminance. Disabled controls retain native disabled semantics, pointer suppression, opacity, and cursor treatment; inactive controls are contrast-exempt, and their treatment must not be used for enabled explanatory text. Text selection and input carets use the primary pair.

Preset primitives established here are graphite, pine, and iris, each with explicit light/dark action values. They are palette resources for 007; the old preset files remain unchanged in 005.

## Typography

Geist Sans and Geist Mono are self-hosted through the approved Fontsource packages. The font registry retains every previous choice; default Geist stylesheets use local assets. Mono is loaded for code/data regardless of the chosen body face. The fixed scale is 12/13/14/16/20/24/30px; heading tracking is -0.025em. Tabular numerals are inherited globally so every metric aligns without per-widget edits.

## Layout

Existing screens use responsive grids, compact controls, and route-local components. Cards use 16px internal spacing (12px in small cards); default controls are 32px tall. Preserve page composition in v0.1; shared token changes may propagate automatically.

The app surfaces use **Operate** mode. Data density, scanability, native expectations, and consistency outrank expressive decoration. Mobile changes are structural, including the existing sidebar sheet and collapsing grids.

## Elevation & Depth

Cards preserve their inherited thin border/ring structure. Low elevation uses two subtle offset layers; overlays use wider layered shadows. Shared durations are 150ms and 200ms with standard ease-out; Tailwind transitions default to 150ms. Reduced-motion media rules reduce all animations/transitions to near-instant and disable smooth scrolling. Dashboard composition and JS chart behavior remain outside this token layer.

## Shapes

Default control radius is 8px; shadcn aliases use 4/6/8/12/16/20/24px. Cards use the 12px step. Spacing primitives are 4/8/12/16/24/32px on the existing Tailwind rhythm. The future floating sidebar intentionally uses a larger radius than dense controls.

## Components

The original tenboards identity uses a paired-board “10” silhouette and a Geist wordmark. In the app, the mark inherits currentColor and is decorative beside the wordmark or a named link; isolated SVG assets carry their own accessible name. Favicons use the tested white-on-blue primary pair. The SVG wordmark master is dark-on-light; use the inherited-color React wordmark in dark UI. Metadata assets and vector masters are documented in README.

Use local Base UI-backed shadcn wrappers after inspecting their source. Button variants include primary, outline, secondary, ghost, destructive, and link; focus uses a border plus ring. Inputs have focus, invalid, disabled, and placeholder states. Cards use semantic card foreground/background with header/content/footer slots. Chips and navigation should share the semantic palette.

The locked sidebar reference is [docs/design-refs/sidebar-reference.png](docs/design-refs/sidebar-reference.png), inspected for this document. Tasks 008–011 implement its inset floating rounded panel, workspace avatar/name and collapse control, search pill with ⌘K, regular-weight primary items with outline icons, soft gray active pills, secondary collapsible sections, pinned status card, and footer actions. Preserve icon-collapse and mobile sheet behavior. Do not implement this shell redesign in tasks 003–007.

## Do's and Don'ts

- Do use Impeccable and read its craft floor immediately before UI edits.
- Do preserve semantic shadcn compatibility, font choices, SSR, and preference behavior.
- Do verify rendered light/dark desktop/mobile states and contrast with evidence.
- Don't redesign dashboard or app-page content in v0.1.
- Don't treat documentation of a future design as proof it is implemented.
- Don't remove screens or copy third-party logos into the tenboards identity.
