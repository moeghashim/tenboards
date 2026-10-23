# Open questions

## 2026-10-23 — 012 full-matrix clock hydration blocker

Task 009 long-title capture exposed an inherited `new Date()` in `src/routes/(main)/dashboard/patient-monitoring/route.tsx:19`. Direct SSR navigation can render different seconds on the server/client, causing hydration recovery. The failure predates this batch (the page file is unchanged from main). Exact output is retained with task 009 evidence in `pr-assets/009/009-inherited-failure.log`.

Observed diff: client `04:55:30`, server `04:55:29`; a second smoke reproduced client `04:55:50`, server `04:55:49`. React reports: `Hydration failed because the server rendered text didn't match the client.`

Decision requested: authorize a narrow nonvisual clock hydration fix in 012, or leave the full-matrix acceptance criterion blocked. No page content edit made. Independent shell tasks continue; error-free full-route acceptance remains pending.
