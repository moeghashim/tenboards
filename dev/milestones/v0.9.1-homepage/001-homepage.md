# 001 — Marketing homepage at `/`

Status: in progress. Branch: `feat/v0.9.1/001-homepage`. Base: main.

## Routing

- `/` renders the homepage (HTTP 200, SSR) instead of redirecting. It is public in demo and auth modes: no session, no server data, no secrets.
- Unchanged: `/dashboard` and `/dashboard/` redirect to `/dashboard/default`; `DEFAULT_AUTH_DESTINATION`, unsafe-return fallback, sidebar brand link, root not-found/error, Unauthorized and dashboard splat recovery links. Update only checks/scripts that asserted `/` → `/dashboard/default` (e.g. landing/redirect checks, screenshot tooling) so they assert the new behavior; keep the `/dashboard` assertions.
- Route-specific `<title>`, description and Open Graph tags for `/`.

## Content (one page, in this order)

All claims must be true of the repository today; source copy from README.md, AGENTS.md, docs/ and the skills. No invented metrics, testimonials, logos or star counts.

1. **Header:** brand mark/wordmark, anchor links to sections, Live demo, GitHub (`https://github.com/moeghashim/tenboards`), theme toggle. Collapses cleanly on mobile.
2. **Hero:** lead with agent-ready — e.g. an MIT dashboard template that coding agents (Codex, Claude Code) build on correctly. Primary CTA: “View on GitHub”; secondary: “Open live demo” (`/dashboard/default`). A real product screenshot.
3. **How an agent builds with it:** the actual loop as steps — prompt (“add a Sales dashboard…”), agent reads AGENTS.md + skill, `npm run new:dashboard sales`, composes `@/components/blocks`, `npm run check` + `npm run verify:page` catch off-system UI. A static terminal/code panel showing real commands is welcome.
4. **Agent-ready features:** AGENTS.md + CLAUDE.md; Agent Skills (`tenboards-build-ui`, `tenboards-connect-data`, `.agents/skills` + `.claude/skills`); page generators; public blocks + `/dashboard/kit`; design guardrails (`check:design`, axe/hydration `verify:page`); `/llms.txt`, `/llms-full.txt` and the shadcn registry (`/r/<block>.json`). Link the live kit, llms.txt and a registry example.
5. **What's included:** ten dashboards (name them), workspace (Home, Projects views, AI Assistant, Mail, Chat, Invoice, Products, Users, Roles, Profile, auth and system pages), design system (light/dark, presets, ⌘K, layout settings), optional integrations (Postgres/Drizzle, Better Auth, Assistant providers, Cloudflare Workers). A small screenshot gallery is welcome.
6. **Tech stack:** TanStack Start (SSR), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui on Base UI, TanStack Table, Recharts, Drizzle + Postgres, Better Auth, Cloudflare Workers. Text labels (icons optional; no third-party logo files unless already in the repo).
7. **Quick start:** the README clone/install/dev commands with a copy button.
8. **Footer CTA + footer:** GitHub link again, docs/changelog links, MIT license and upstream attribution (Studio Admin by Mohammed Arham Khan).

## Design and quality

- Follow DESIGN.md and PRODUCT.md: semantic tokens, the existing type/spacing scales, compact-but-readable density, light and dark. It should feel like the product, more spacious than app screens, not a generic SaaS template (no gradient blobs, stock illustrations or fake UI). Reuse existing primitives/blocks; route-local components go in a `-components/` folder next to the route.
- `check:design` must pass with **no new exceptions**.
- Images: real captures of the current app, in `public/` as WebP (or AVIF) with explicit width/height, descriptive alt text, lazy-loaded below the fold; total image weight ≤ 600 KB. Light/dark variants optional.
- Accessibility: landmarks, one `h1`, ordered headings, skip link, visible focus, ≥24px targets, external links identified, reduced motion respected. No hydration mismatch.
- Mobile 375px: no horizontal scroll; CTAs reachable.

## Adopter removal

Document in README and docs/reference.md (and mention in AGENTS.md's map in one line) how adopters replace the homepage with the redirect: the exact file(s) to delete/restore, with the redirect snippet. Generators and skills must not depend on the homepage.

## Acceptance criteria

- [ ] `/` returns 200 with the homepage in dev and local workerd (`npm run preview`), demo and auth modes; `/dashboard` and `/dashboard/` still 307 to `/dashboard/default`; auth fallback and redirect checks pass.
- [ ] All eight sections present with accurate copy; GitHub CTA in hero and footer; every internal link resolves (demo, kit, llms.txt, registry example, docs).
- [ ] `npm run build`, `npm run check` (no new design exceptions), `npm run typecheck` pass.
- [ ] `npm run verify:page -- /` passes in all four states (light/dark × desktop/mobile), zero axe violations, zero console/hydration errors; `verify:page --all` shows no regression.
- [ ] Image budget met; Lighthouse-style sanity: no layout shift from images (dimensions set).
- [ ] Evidence (four-state screenshots) uploaded only to pr-assets; isolated tenboards-preview version + alias linked in the PR.
- [ ] README (live site/homepage line, adopter removal note), docs/reference.md, CHANGELOG draft, llms.txt sources if they describe routes, milestone status updated.
