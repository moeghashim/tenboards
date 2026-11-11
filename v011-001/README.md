# v0.11 / 001 evidence

Base: 75810d4f2e987c548efd896fe82ebabec6a53cbc. Images live only on pr-assets.

- build/check/typecheck logs: final unset runs, exit 0. Biome retains 69 warnings and 12 infos; build reports dependency directive warnings.
- matrix.log: ten colours, hue roundtrip, sRGB gamut, contrast, exact rejection, invalid no-write and CLI stale/reset tests.
- computed-diff.json: 77 browser-computed properties, four presets × two modes; all diffs empty.
- verify-branded-all.log / verify-branded-summary.json: npm run verify:page -- --all, 37 routes × four states, exit 0.
- verify-unset-all.log / verify-unset-summary.json: same command with --base-url http://127.0.0.1:3409 in isolated copy; 37 routes × four states, exit 0.
- contrast-*.json: scripts/check-contrast.ts, 43 checks per mode, zero failures. Unset includes all four presets.
- purple/rose/yellow: Users, Default, kit and settings, light/dark × desktop/mobile. Browser result.json confirms hidden presets, stale Graphite cookie rewrite and no console/hydration errors. Browser assertions also cover selected borders and Escape/focus return.
- unset: picker retained and Graphite cookie preserved; before captures show Graphite.

Earlier interrupted runs are retained separately: a hot-reload homepage case and a dev-server exit. Clean final audits supersede them. A contrast attempt timed out at networkidle; final JSONs are successful reruns. Verifier-fixture.log intentionally contains seeded failures and ends with its expected-failure test passing.
