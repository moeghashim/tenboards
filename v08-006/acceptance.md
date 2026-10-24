# v0.8 integrated acceptance — task 006

Implementation verification: PASS. Ready for Claude review; not merged or released.

Stack (all target main): [001 #67](https://github.com/moeghashim/tenboards/pull/67) → [002 #69](https://github.com/moeghashim/tenboards/pull/69) → [003 #71](https://github.com/moeghashim/tenboards/pull/71) → [004 #73](https://github.com/moeghashim/tenboards/pull/73) → [005 #74](https://github.com/moeghashim/tenboards/pull/74) → [006 #75](https://github.com/moeghashim/tenboards/pull/75).

Preview: https://082cd8e9-tenboards-preview.mohanadgh.workers.dev · alias https://pr-75-tenboards-preview.mohanadgh.workers.dev. Approved preview command passed remote ASSETS-only/no-secrets inventory. No hosted DB validation is claimed. Task006 changes capture tooling/documentation only; application code remains task005 commit bb0b449. Subsequent documentation/check commits do not alter the preview application.

## Verification

| Gate | Result | Evidence |
| --- | --- | --- |
| Build/check/typecheck | Pass; Biome 1 inherited warning/4 infos; build dependency module-directive warnings | logs/v08-006-{build,check,typecheck}.log |
| Node auth | 12 suites, 458 scenarios pass | logs/v08-006-auth.log |
| Compiled local workerd auth | 277 protection +15 accounts +12 security =304 pass | logs/v08-006-worker-auth.log |
| Project route/RPC guards | Node and actual AUTH_TEST_RUNTIME=workerd pass; malformed/cross-project/missing IDs, private cache, revocation and failure/recovery | logs/v08-006-{access,worker-access}.log |
| Data parity | 29 reads /210 scenarios on Node and workerd | logs/v08-006-{parity,worker}.log |
| Migration/seed preservation | Fresh, populated additive upgrade, repeated migration/seed, adopter/auth/unrelated records and failure recovery pass | logs/v08-006-project.log |
| Worker runtime/security | Request bindings, exact origin, session denial, durable rate limits/failure recovery pass | logs/v08-006-{worker,security}.log |
| Redirects | 80 project +96 existing cases pass; HTTP308, client/hash/query/trailing slash, safe login return, root/default fallback | logs/v08-006-{redirect,legacy}.log |
| Retained-route captures | 35 visual patterns ×4 presets ×2 themes ×2 viewports =560 pass after explicit retries; 13 additional catalog entries are HTTP-only | route-coverage.json, retries.json, dev/, retries/ |
| Additional project captures | 2 concrete projects ×5 views ×4 presets ×4 states =160 pass after explicit retries | project-coverage.json, project-retries.json, projects/, retries/ |
| Sidebar matrix | 96 hydrated +96 JavaScript-disabled combinations pass against compiled immutable preview | logs/v08-006-sidebar{,-ssr}.log |
| Shell interaction/default smoke | Four-state palette/settings/keyboard/focus/reduced-motion checks and final clean default smoke | shell-interactions/, final-smoke/ |
| Immutable preview smoke | 9 routes ×4 states =36 clean captures | preview/ |
| Impeccable Operate finish review | SHIP; review findings resolved, compact density preserved | finish-review.md, contact-sheets/ |

Focused application tests from the unchanged task005 application are retained at [v08-005/logs](https://github.com/moeghashim/tenboards/tree/pr-assets/v08-005/logs): Board/List search/filters/keyboard/detail identity; Overview/Timeline/Files data equality and read-only states; Home/index totals and project ownership; nested navigation in four states/six layout combinations, corrupt/disabled storage, mobile manual-collapse lifetime and same-path rail dismissal; isolated DB navigation schema failure/recovery/empty state. Schedule tests cover DST, leap/year rollover, clipping/unscheduled data and request timezone projection. Delayed real-clock direct/refresh hydration passed UTC, America/Chicago and Pacific/Kiritimati for Calendar and Home. These suites were not repeated in 006 because no application code changed.

All captures were reviewed at contact-sheet level for missing/obscured renders. Project, secondary/empty, Home/index and replacement cases additionally received full-size inspection. Contact sheets resolve explicit retries; original captures/reports remain for audit. 35 detailed route sheets and eight secondary/empty sheets are indexed in contact-sheets/index.json; seven overview sheets cover the whole retained inventory. No reference-site source/assets are included.

## Transient failures retained and resolved

The first Node auth run stopped on macOS Node24 undici Socket.setTypeOfService EINVAL. The complete rerun passed458. The first dev sidebar run stopped on a Vite ECONNRESET HTTP500; both complete matrices passed against the compiled preview. Original retained captures include five diagnosed navigation/HTTP failures; secondary captures include two diagnosed List navigation failures. Visual inspection additionally found dev error overlays on Pine empty Files and Invoice/Profile cases even though their diagnostic arrays were empty. Explicit manifests retain52 retained-route retry cases and12 project retry cases (64 total), all now clean. The capture harness now rejects a mounted vite-error-overlay before recording successful evidence. No errors were suppressed, no application workaround was added, and originals remain uploaded.

## Boundaries and handoff

No runtime dependencies, tokens, protected UI/calendar wrappers, PLAN, package version, release/tag, merge or production deployment changed in006. Everything remains read-only; project/team metadata does not grant tenancy or permissions. Generated fixture dates use a shared request UTC anchor, and DB adopter dates remain intact. Main rechecked at3703f76 (v0.6.2); v0.7 Assistant has not merged. Its primary position is reserved immediately after Chat and must be unioned when the reviewer integrates the concurrent milestone.

No blocking implementation item remains. Inherited nonblocking task003 critique observations remain documented in#71: horizontally scrolling mobile List/Timeline loses the identity column, and exact-label filtering expects known vocabulary. No new material finding emerged in006. Claude owns review, stack rebase/squash merges and production deployment; rerun affected checks if that integration changes the app.
