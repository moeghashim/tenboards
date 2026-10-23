# v0.4 task 008 acceptance evidence

Final runtime preview: https://9d63aeb5-tenboards.mohanadgh.workers.dev (alias pr-49).

- `coverage.json`: complete 1,824-case catalog, with explicit `retries.json`. Canonical `dev/`, `db/`, `workers/` directories each contain four preset reports.
- `before/`: incumbent layer 006 business code plus only the saved `incumbent-qa-instrumentation.patch` and helper. Layer 007 independently proved 40 exact operational comparisons; final matrix covers those routes across all presets. `before-runtime/` is the additional real-time pre-instrumentation run.
- `image-comparison.json`, `visual-review.json`, `pixel-diff-review.jpg`: all 1,216 local pairs and inspected nonzero raster edges. No broad threshold is used as an acceptance rule.
- `interaction-coverage.json`, `hydration-coverage.json`: resolved case inventory with original failures and exact rerun provenance. Root recovery uses keyboard focus then page Enter to avoid Playwright retrying after a successful synchronous button unmount.
- `fresh.log`, `upgrade.log`, `drift.log`, `source-matrix.log`, `source-browser.log`: actual Docker Postgres 17, repeat seeds, 22 reads / 130 scenarios, source faults and negative controls. `actual-db-negative.log` changes one real DB value, then `actual-db-restore.log` proves canonical reseed plus unrelated-row retention.
- `no-docker-build-final.log`, `onboarding-*.log`, `zero-env-config.json`: isolated documented install/dev/build and optional local DB setup. No credential file is included.
- `print-check.json`: all 16 invoice PDFs; representative final Worker/DB page renders are alongside their PDFs. `live-calendar.log`: independent 65-second real clocks in all three sources.
- `ownership-review.md`, `boundary-audit.json`, literal/array audits: all source owners, runtime import graph and explicit simulation exclusions.
- `workers-pre-spacing/`: superseded partial preview, retained for provenance only. Canonical Worker evidence uses the final version above. Chat count spacing corrections have explicit local retry mappings.
- Final build/check/typecheck logs are the implementation gates. Expected injected faults and deliberate negative controls are separate from clean reports.

Original failures are preserved, not removed. Final reports resolve network/navigation/form assertion timeouts and corrected QA helper assumptions through named reruns. No unresolved acceptance error or product/access question remains. Implementation tasks stay in review; reviewer owns merge/release/production deployment.
