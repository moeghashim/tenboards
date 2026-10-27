# v0.9.1 / 001 — Marketing homepage

PR: https://github.com/moeghashim/tenboards/pull/83
Base: main c30bb8f. Implementation: feat/v0.9.1/001-homepage.

Preview version: https://57745272-tenboards-preview.mohanadgh.workers.dev
Preview alias: https://pr-83-tenboards-preview.mohanadgh.workers.dev
Remote inventory: ASSETS only, no secrets. Production was not deployed.

- `before/`: current root redirect → Default, dev captures, all four states.
- `after/`: final public homepage, compiled local Worker, all four states. Screenshot suite's root keyboard/demo interactions also pass.
- `product/`: original 1440×900 compiled Default dashboard captures used for the two WebP homepage assets (160,202 bytes total).
- `verify/`: final 37-route / 148-case run at http://127.0.0.1:3402; all pass, zero axe violations and console/hydration/runtime errors. Root also has zero axe incomplete findings. Desktop1440×900, mobile390×844.
- `checks/`: focused demo/auth checks on dev and workerd including 375px, SSR, metadata, named code regions, skip/focus, ≥24px targets, image loading/budget, internal links, clipboard success/failure and theme persistence; redirect suite 88/88, auth return10/10, auth protection292/292; block kit four-state interactions and remote read-only smoke.

`npm run build`, `npm run check`, `npm run typecheck` pass. Design guardrails retain the existing71 exceptions and add none. Biome retains35 inherited warnings. Auth redirect validator:30/30.

The fresh Impeccable visual review and fix verification are summarized in checks/design-review.md. No tokens, protected primitives, auth policy or app recovery destinations changed. No new dependency. Claude maintainer review is pending.
