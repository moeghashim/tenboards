# Task 005 evidence — PR #82

Implementation head: 6b5c02f. Scratch project: /tmp/tenboards-005-consumer (outside the repository, independently installed dependencies).

- `before/`, `after/`: npm run screenshots, light/dark × desktop/mobile kit captures.
- `interactions/`: expanded install controls, keyboard disclosures, clipboard command, visible focus, no horizontal overflow, axe WCAG 2.2 AA and runtime checks.
- `consumer/`: external StatCard + DashboardChart renders, computed token/type/density checks, two named series, accessible data table, axe and runtime checks.
- `consumer-source/`: reproducible Vite + shadcn consumer (no node_modules, no credentials).
- `verify/`: standard verify:page reports (zero axe/runtime findings in all four states).
- `logs/`: build/check/typecheck, preview deployment/assets, external CLI installs/build/render, regression and smoke logs.

External installation used https://73e0c13c-tenboards-preview.mohanadgh.workers.dev. Final preview is https://8dfbffb6-tenboards-preview.mohanadgh.workers.dev (alias https://pr-82-tenboards-preview.mohanadgh.workers.dev); the asset probe proves all nine final registry JSONs are byte-identical to the installed version. Both blocks were installed with `npx shadcn add <preview>/r/<item>.json --yes`; no component or CSS edits were needed after installation. Source README documents intentional global theme installation.

Testing corrections (all resolved): screenshots uses catalog route `/dashboard/kit/`; browser smoke accepts the requested `/dashboard/kit` URL. Focus-visible assertion requires keyboard modality. Scratch Vite uses vite/client declarations for CSS imports; the CLI preset is `nova`, not `base-nova`. Initial block-type registry bundles preserved shadcn's initialized palette: fixed by style-type bundles and complete dark aliases, then reinitialized CSS, removed installed tenboards modules, installed from the corrected Worker and repeated builds/renders.

Inherited notices: Biome reports 35 pre-existing warnings/10 infos; app builds report third-party module directives. Scratch Vite reports its standard >500 kB chart bundle warning. All required checks exit zero.
