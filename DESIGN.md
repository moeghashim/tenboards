---
name: tenboards
description: Refined product UI for a complete admin dashboard starter
colors:
  primary: "oklch(0.205 0 0)"
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
typography:
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "14px"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "16px"
    fontWeight: 500
rounded:
  lg: "10px"
  xl: "14px"
spacing:
  compact: "12px"
  card: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.lg}"
    height: "32px"
---

# Design System: tenboards

## Overview

**Creative North Star: "Refined product UI"** — the approved Linear/Vercel register in PLAN §7. Precision, scanability, and restraint serve dense administrative work. PLAN and its Decisions log win every conflict.

This initial document distinguishes observed implementation from the approved target. The frontmatter records the current default light theme, not a claim that the token upgrade is complete. Task 005 replaces these tokens; task 007 replaces the inherited presets. Shell tasks 008–011 and screen work in v0.2/v0.3 remain separate.

**Key Characteristics:** neutral-first surfaces, one action accent, crisp borders, compact data, restrained depth, and consistent control states.

## Colors

The incumbent default is achromatic, with semantic shadcn variables in src/styles/styles.css and independent dark values under .dark. Presets currently override those variables. Do not claim inherited pairs are already verified accessible.

The approved target adds bg, surface, surface-raised, border, border-strong, text, text-muted, accent, success, warning, danger, and info roles in light/dark. Document supported text pairs and interactive focus contrast when implemented. Use one accent for actions and state, not decoration.

## Typography

Geist Sans is already the preference default, loaded through the preserved font registry. Geist Mono is the approved monospace default for task 005. Establish the fixed 12/13/14/16/20/24/30 scale, tight heading tracking, and tabular metric numerals in that task. Font customization remains available.

## Layout

Existing screens use responsive grids, compact controls, and route-local components. Cards use 16px internal spacing (12px in small cards); default controls are 32px tall. Preserve page composition in v0.1; shared token changes may propagate automatically.

The app surfaces use **Operate** mode. Data density, scanability, native expectations, and consistency outrank expressive decoration. Mobile changes are structural, including the existing sidebar sheet and collapsing grids.

## Elevation & Depth

Current cards use a thin foreground ring; some overlays and controls use inherited Tailwind shadows. The approved target is crisp 1px borders and subtle layered shadows. Task 005 establishes shared depth and 150–200ms motion tokens with reduced-motion support.

## Shapes

Current default radius is 10px, with proportional shadcn radius aliases. Move to a restrained scale in task 005 while preserving the aliases. The future floating sidebar intentionally uses a larger radius than dense controls.

## Components

Use local Base UI-backed shadcn wrappers after inspecting their source. Button variants include primary, outline, secondary, ghost, destructive, and link; focus uses a border plus ring. Inputs have focus, invalid, disabled, and placeholder states. Cards use semantic card foreground/background with header/content/footer slots. Chips and navigation should share the semantic palette.

The locked sidebar reference is [docs/design-refs/sidebar-reference.png](docs/design-refs/sidebar-reference.png), inspected for this document. Tasks 008–011 implement its inset floating rounded panel, workspace avatar/name and collapse control, search pill with ⌘K, regular-weight primary items with outline icons, soft gray active pills, secondary collapsible sections, pinned status card, and footer actions. Preserve icon-collapse and mobile sheet behavior. Do not implement this shell redesign in tasks 003–007.

## Do's and Don'ts

- Do use Impeccable and read its craft floor immediately before UI edits.
- Do preserve semantic shadcn compatibility, font choices, SSR, and preference behavior.
- Do verify rendered light/dark desktop/mobile states and contrast with evidence.
- Don't redesign dashboard or app-page content in v0.1.
- Don't treat documentation of a future design as proof it is implemented.
- Don't remove screens or copy third-party logos into the tenboards identity.
