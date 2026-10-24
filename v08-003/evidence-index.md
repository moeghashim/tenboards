# v0.8 / 003 evidence

Implementation commit 3f477d0 (PR head 7c76c00 adds only docs/test corrections), stacked after002caf164d and00160dffee. PR71, preview99332b1b at https://99332b1b-tenboards-preview.mohanadgh.workers.dev .

Canonical final matrix: final/ (8screens×4states), final-timeline/ (same Timeline4states), interactions/calendar-* (Calendar4states). All retain real clocks. before/ contains actual001Calendar/FileManager and002Board/List; new views had no previous screen. after/ and earlier logs retain development history and are not final acceptance evidence.

preview/ and preview-interactions/ validate immutable hosted demo. Worker/database/auth suites use dedicated localPostgres54338 and isolated_v08_names, not hostedDB. No hosted-auth claim. All data remain shared synthetic sample records.

Final testlogs: build-final.log,check-final.log,typecheck-final.log,auth-final.log,parity.log,projects.log,schedule.log,worker-auth.log,worker-security.log,worker-runtime.log,project-access.log,project-access-worker.log,redirects.log,interactions-final.log,captures-final.log,captures-timeline.log,preview-smoke.log,preview-interactions.log. Original failurelogs retained auth.log/auth-signout-race.log/interactions.log.

Design review and documenter: design-review.md. T3 narrower/zoom/filter checks: supplemental-browser.log. Protected wrappers, PLAN, tokens, package dependencies and production config untouched.

Final results: auth:test 12 suites / 471 scenarios pass. Node and workerd parity 29 reads / 204 scenarios pass. Dev 32 captures and immutable preview 16 captures pass with no console errors. Project interactions pass locally and hosted in all four states plus three delayed-hydration zones.
