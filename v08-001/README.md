# v0.8 / 001 — Projects foundation evidence

Implementation PR: https://github.com/moeghashim/tenboards/pull/67

Immutable demo preview: https://178cda12-tenboards-preview.mohanadgh.workers.dev
Alias: https://pr-67-tenboards-preview.mohanadgh.workers.dev

Nonvisual layer. `before/` contains light/dark × desktop/mobile Default, Kanban, Tasks, Calendar and File Manager. `after/` contains fresh Default four-state smoke. `preview/` contains the same four-state smoke against the immutable preview. No UI, tokens or protected wrappers changed. Default captures were visually inspected for layout, text, charts and mobile overflow. Incumbent workspace captures are the before evidence for following layers.

- Build/check/typecheck pass. Check retains one inherited warning and eight informational class-order findings. Build retains inherited chunk-size warnings. npm ci reports 6 moderate / 2 high inherited audit findings; no dependency changes.
- `parity.log`: all 29 reads / 202 scenarios pass, preserving the old 22 / 104 floor.
- `projects-final.log`: explicit mapping coverage, same-project constraints, invalid IDs/enums/dates/counts, pagination, canceled metrics, calendar boundaries, DB-only sentinel, repeat seeds, populated migration with adopter board/ledger/file and auth row preservation, schema failure/recovery.
- `auth-rerun.log`: 12 suites / 426 scenarios pass. `auth.log` preserves the first run's inherited ERR_ABORTED navigation failure; full rerun passes without an application change.
- `redirects.log`: 96 / 96 existing permanent-redirect cases pass. New project aliases remain task 005, so this layer introduces no redirects.
- `worker-auth.log`: compiled protection/account/security coverage; `worker-security.log`: shared limiter concurrency, origin, spoofing, retry and failure/recovery checks.
- `worker-final.log`: compiled local runtime checks and HTTP parity over the complete 29 / 202 registry. The earlier `worker.log` predates three additional filter/sort scenarios and is retained as intermediate evidence.
- `preview.log`: isolated upload only to tenboards-preview; remote inventory confirms ASSETS only / no secrets. Nothing promoted to production.

Local DB: dedicated v0.8 Postgres container on port 54338, with `_v08_` database names. Dev port 3270; test listeners 3280–3288. No hosted database used. Auth storage/cookies and reference-site material are not included.
