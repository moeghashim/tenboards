# v0.6.1 task 001 evidence

Base: f45e813. Before captures render archived base source in an isolated capture install. After captures render implementation source; all eight Auth V2 screenshots are byte-identical to before. Sidebar captures wait for collapsed content to hide and scroll the navigation to its lower groups, showing Legacy removal and 25 → 21 explored-page count.

Final matrix: 12/12 cases (sidebar/default, Auth V2 login and register × light/dark × desktop/mobile). Sidebar keyboard expansion, visible focus, command selection, Escape focus return, settings keyboard/reduced-motion and persistence checks pass. Auth validation/autofill/demo/short-height checks pass. The first combined after report had sidebar failures; the separate settled sidebar report supersedes those four cases. Final selected reports contain no errors.

Original failures: a concurrent Vite cache collision produced React/asset errors; isolated dependencies and serialized Node auth rerun pass all 426 scenarios. Filtering the palette to its sole Finance result exposed a missing cmdk aria-activedescendant; the usage-site input ref synchronizes the actual rendered selection. Four-theme/viewport sidebar rerun and hosted keyboard Enter navigation pass. Shared UI wrappers and tokens are unchanged.

Checks: build, Biome, TypeScript; fresh and populated migration/seed, repeat execution and retained-row comparisons; 22 reads/104 parity scenarios; 96 local alias checks; Node auth 426; Worker runtime 17 checks including HTTP parity; Worker auth 245 protection + 15 account + 12 security; seven distributed Worker security checks. The preview also passed twelve safe/hostile 308 checks and default SSR/browser smoke.

Preview: https://644297e0-tenboards-preview.mohanadgh.workers.dev (alias https://pr-63-tenboards-preview.mohanadgh.workers.dev). ASSETS-only remote configuration and no secrets verified by preview:deploy. Hosted database integration is not claimed.

Inherited warnings: Base UI mixed animations/transitions; Biome one highlighter index-key warning and eight nursery class-sort infos; upstream build directive/chunk warnings; npm ci 8 advisories (6 moderate, 2 high). No new dependency or token changes.
