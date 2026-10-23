# v0.3 breakdown evidence

Planning baseline: main 1815a6b, package 0.2.0, 2026-10-23. Documentation only; no visual after state is claimed.

- `before/`: 92/92 default-preset dev cases (23 catalog entries × light/dark × desktop/mobile).
- `system-before/`: 8/8 dev cases (dashboard splat and slash index). Together these cover all 24 non-dashboard catalog entries plus the required default-dashboard smoke.
- `contact-*.jpg`: planning overview sheets from the original PNGs; full-resolution raw captures are retained.
- `production-root-not-found-light-desktop.png`: T3 browser inspection of production `/capture-not-found` at 1280×800. Expected HTTP 404. T3 also reported Electron sandbox/preload startup errors; these are browser-host diagnostics, not a passing app-console assertion. No RootError fault was induced in this planning-only pass.
- build/typecheck pass. `check.log` retains the existing package.json format error (exit 1), one highlighter warning and six informational diagnostics; no source/package fixes are included. Build emits inherited dependency module-directive warnings; dev emits the inherited Base UI mixed animation/transition warning.
- Local T3 preview attempts encountered localhost connection refusal and generic navigation failure; CLI screenshots use the explicitly requested repository runner at 127.0.0.1:3000 and completed.

These captures do not clear the locked Calendar/Invoice/Auth V2 Workers hydration findings or claim v0.3 implementation. All future task checklists remain unchecked.

Workers preview: https://0e6430e9-tenboards.mohanadgh.workers.dev (alias https://pr-26-tenboards.mohanadgh.workers.dev). `workers-smoke/` passes 4/4 default-dashboard light/dark desktop/mobile cases with no console/page errors. Version upload only; production was not changed.
