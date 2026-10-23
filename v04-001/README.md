# v0.4 task 001 evidence

Build: build-final.log. Check/typecheck: check.log, typecheck.log. Postgres 17.10: postgres-version.txt, migrate.log, seed.log, parity.log, counts.txt, relationships.log. Source selection and both negative controls: source-matrix.log. Real DB-row mutation fails parity, then restored by seed: db-mismatch.log. Fault browser captures: faults/ (20 cases, expected diagnostics retained).

Baseline: before/ (8 successful interaction cases). Demo: demo/ plus Roles final correction in demo-final/. DB: db/ plus Roles final correction in db-final/ and default-shell retry in db-default-retry/. Initial default light/mobile QA evaluation failed with `TypeError: Cannot read properties of null (reading 'textContent')`; repeat all four default cases passed. This is retained as a harness failure, not hidden as a clean original run. An intermediate Roles alert layout change from separate text nodes was corrected with a single formatted string.

No Docker: no-docker/ (12). Workers interaction direct/refresh: workers-final/ (24, version 47c60a45). Latest version after dev-env script update: workers-release/ (24, version 7a227c1e). Both versions have identical app data/UI implementation. All Default light/dark × 1440×900/390×844. No data masks. Final visual-comparison-final.json: 92/104 exact decoded images; tiny remaining activity-dot animation/focus edge differences inspected. All captures retain originals.

The first baseline launch used an IPv4 URL while Vite listened on IPv6 localhost: ERR_CONNECTION_REFUSED. Restarting with --host 0.0.0.0 fixed the harness connection. The T3 preview also failed local navigation; the explicitly required repository screenshot harness supplied evidence.

No database binding or DATABASE_URL exists in the generated Worker configuration. Source dispatch returns demo before lazy client access; the TCP sentinel sees zero demo connections. Bundle audit found only dependency metadata `postgres` and illustrative Kanban `Drizzle` text, not driver code or credentials.

Warnings: inherited Base UI module directives/mixed transitions, ts-node DEP0180, optional Wrangler OAuth scope notice, Biome one warning plus ten infos. New approved drizzle-kit tooling introduces four moderate audit advisories (npm-audit.json); no application runtime advisory was introduced by postgres/drizzle-orm.
