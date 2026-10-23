# v0.2 breakdown — incumbent evidence

Baseline main 307b8cf, 2026-10-23. Planning only: no runtime code edits and no after-restyle screenshots.

Build, check and typecheck pass. Biome has the inherited highlighter.tsx noArrayIndexKey warning; build retains dependency directive warnings. Local default smoke passes all four states without console/page errors.

Scoped local capture: 52/56 initially pass. Three Patient Monitoring cases reproduce the inherited clock hydration mismatch. Infrastructure dark/mobile hit an external Roboto Slab font timeout; its four-state retry passes 4/4, leaving 53/56 after retry and three real hydration failures. Original reports/logs are retained. Finance/Finance V1/Productivity passing locally does not clear their recorded Workers failures from v0.1.

The initial capture failed because the dev server bound IPv6 localhost while capture used IPv4 127.0.0.1; original diagnostics are kept under initial-binding-failure. Restarting with --host 0.0.0.0 corrected access. No script or application code was changed.

The local report is authoritative per case; a PNG may exist despite a hydration error. Contact sheets are inspection aids, not passing evidence. All 56 baseline states and the Infrastructure retry were visually inspected; no v0.2 acceptance claim is made.

## Baseline matrix

| Route | Light desktop | Dark desktop | Light mobile | Dark mobile |
| --- | --- | --- | --- | --- |
| /dashboard/default | [light/desktop](local/_dashboard_default-light-desktop.png) | [dark/desktop](local/_dashboard_default-dark-desktop.png) | [light/mobile](local/_dashboard_default-light-mobile.png) | [dark/mobile](local/_dashboard_default-dark-mobile.png) |
| /dashboard/default-v1 | [light/desktop](local/_dashboard_default-v1-light-desktop.png) | [dark/desktop](local/_dashboard_default-v1-dark-desktop.png) | [light/mobile](local/_dashboard_default-v1-light-mobile.png) | [dark/mobile](local/_dashboard_default-v1-dark-mobile.png) |
| /dashboard/crm | [light/desktop](local/_dashboard_crm-light-desktop.png) | [dark/desktop](local/_dashboard_crm-dark-desktop.png) | [light/mobile](local/_dashboard_crm-light-mobile.png) | [dark/mobile](local/_dashboard_crm-dark-mobile.png) |
| /dashboard/crm-v1 | [light/desktop](local/_dashboard_crm-v1-light-desktop.png) | [dark/desktop](local/_dashboard_crm-v1-dark-desktop.png) | [light/mobile](local/_dashboard_crm-v1-light-mobile.png) | [dark/mobile](local/_dashboard_crm-v1-dark-mobile.png) |
| /dashboard/finance | [light/desktop](local/_dashboard_finance-light-desktop.png) | [dark/desktop](local/_dashboard_finance-dark-desktop.png) | [light/mobile](local/_dashboard_finance-light-mobile.png) | [dark/mobile](local/_dashboard_finance-dark-mobile.png) |
| /dashboard/finance-v1 | [light/desktop](local/_dashboard_finance-v1-light-desktop.png) | [dark/desktop](local/_dashboard_finance-v1-dark-desktop.png) | [light/mobile](local/_dashboard_finance-v1-light-mobile.png) | [dark/mobile](local/_dashboard_finance-v1-dark-mobile.png) |
| /dashboard/analytics | [light/desktop](local/_dashboard_analytics-light-desktop.png) | [dark/desktop](local/_dashboard_analytics-dark-desktop.png) | [light/mobile](local/_dashboard_analytics-light-mobile.png) | [dark/mobile](local/_dashboard_analytics-dark-mobile.png) |
| /dashboard/analytics-v1 | [light/desktop](local/_dashboard_analytics-v1-light-desktop.png) | [dark/desktop](local/_dashboard_analytics-v1-dark-desktop.png) | [light/mobile](local/_dashboard_analytics-v1-light-mobile.png) | [dark/mobile](local/_dashboard_analytics-v1-dark-mobile.png) |
| /dashboard/productivity | [light/desktop](local/_dashboard_productivity-light-desktop.png) | [dark/desktop](local/_dashboard_productivity-dark-desktop.png) | [light/mobile](local/_dashboard_productivity-light-mobile.png) | [dark/mobile](local/_dashboard_productivity-dark-mobile.png) |
| /dashboard/ecommerce | [light/desktop](local/_dashboard_ecommerce-light-desktop.png) | [dark/desktop](local/_dashboard_ecommerce-dark-desktop.png) | [light/mobile](local/_dashboard_ecommerce-light-mobile.png) | [dark/mobile](local/_dashboard_ecommerce-dark-mobile.png) |
| /dashboard/academy | [light/desktop](local/_dashboard_academy-light-desktop.png) | [dark/desktop](local/_dashboard_academy-dark-desktop.png) | [light/mobile](local/_dashboard_academy-light-mobile.png) | [dark/mobile](local/_dashboard_academy-dark-mobile.png) |
| /dashboard/logistics | [light/desktop](local/_dashboard_logistics-light-desktop.png) | [dark/desktop](local/_dashboard_logistics-dark-desktop.png) | [light/mobile](local/_dashboard_logistics-light-mobile.png) | [dark/mobile](local/_dashboard_logistics-dark-mobile.png) |
| /dashboard/infrastructure | [light/desktop](local/_dashboard_infrastructure-light-desktop.png) | [dark/desktop](local/_dashboard_infrastructure-dark-desktop.png) | [light/mobile](local/_dashboard_infrastructure-light-mobile.png) | [dark/mobile retry](infrastructure-retry/_dashboard_infrastructure-dark-mobile.png) |
| /dashboard/patient-monitoring | [light/desktop](local/_dashboard_patient-monitoring-light-desktop.png) | [dark/desktop](local/_dashboard_patient-monitoring-dark-desktop.png) | [light/mobile](local/_dashboard_patient-monitoring-light-mobile.png) | [dark/mobile](local/_dashboard_patient-monitoring-dark-mobile.png) |

Infrastructure dark/mobile original PNG was not saved because fonts did not settle; use the [successful retry](infrastructure-retry/_dashboard_infrastructure-dark-mobile.png).
