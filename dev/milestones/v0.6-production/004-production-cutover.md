---
id: "004"
title: Provision production and release v0.6.0
milestone: v0.6-production
status: todo
category: operations
files: ["wrangler.jsonc", "docs/deploy.md", "README.md", "CHANGELOG.md", "package.json", "package-lock.json", "dev/milestones/v0.6-production/", "dev/milestones.json", "dev/open-questions.md"]
---

## Goal and scope

**Reviewer-owned: Claude Opus 5.5. Not an implementer assignment.** After 001–003 are reviewed/merged and the user supplies the direct Neon URL, activate db+auth on `tenboards.mohanadgh.workers.dev`, verify production and release v0.6.0. The user creates the Neon project; reviewer owns Hyperdrive, secrets, migration/seed, binding-ID commit, merge/deploy and release.

## Files and ownership

- Production `wrangler.jsonc`: reviewer commits real nonsecret HYPERDRIVE ID; no URL/secrets or local binding settings.
- External production operations: reviewer executes the approved runbook against Neon and `tenboards`, with query caching disabled and OAuth absent.
- Deployment docs, README, CHANGELOG, package release metadata and acceptance/status: reviewer records actual outcome and release evidence. No code redesign or new features.

## Before implementation

Review 003's runbook, migration compatibility, exact target configuration, preview isolation and rollback/version plan. No prefactor is planned: this is operational execution of already reviewed code. If a runtime bug appears, record it and route a scoped fix/review instead of improvising production changes.

## Acceptance criteria

- [ ] All prerequisite task PRs are merged, main build/check/typecheck pass, reviewer has approved evidence and the user has supplied Neon direct connection securely. Do not paste credentials in Git, PRs or evidence.
- [ ] Reviewer creates/verifies Hyperdrive with query caching disabled; records nonsecret ID and binding name only. Migrate and seed Neon directly using reviewed remote opt-in; verify schema/data and auth preservation.
- [ ] Reviewer sets runtime BETTER_AUTH_SECRET and canonical BETTER_AUTH_URL on production only, with no OAuth pairs, no forced demo and no accidental no-secret DB state. Activate committed real binding ID through reviewed main; follow staged secret/version ordering.
- [ ] Reviewer deploys main to exact host `tenboards.mohanadgh.workers.dev`; record revision/version and known-good rollback target. No Pages/custom domain or implementer production deployment.
- [ ] Read-only deploy smoke passes, followed by explicit throwaway signup/signin/signout and session/protected-route checks. Verify shared seeded data, immediate revocation, actual HTTPS cookie/origin behavior, hidden OAuth and cache-disabled Hyperdrive. Redact all account/session material; account cleanup follows the runbook.
- [ ] Independently verify `tenboards-preview` still has no secrets/database bindings and remains demo-only; production deployment has not changed the preview target or trusted preview origins.
- [ ] Inspect production public/authenticated affected screens in light/dark × desktop/mobile without console/hydration errors. Upload redacted evidence to pr-assets/attachments, including generated-config/binding facts and exact smoke commands/results.
- [ ] Finalize deployment guide, README and CHANGELOG; update task/milestone acceptance only for verified outcomes. Reviewer bumps package metadata, tags and publishes v0.6.0 with release notes. Close the pending Neon-access entry without recording the URL.

## Tests

Preflight build/check/typecheck and dev default smoke plus 003's accepted local evidence. Hosted deploy:check default and opt-in account path, protected data/session checks and four-state production captures. Compare actual remote Hyperdrive cache setting, secret names and preview isolation to the runbook. On failure, pause release, retain safe diagnostics and execute reviewer-owned compatible rollback; retest afterward. Do not run destructive fault injection or limiter saturation against shared production users.

## Dependencies and handoff

Depends on merged 001–003 and user-provided Neon access at cutover. This access gate is logged in dev/open-questions.md and blocks only 004. GPT-6-Astra must stop before this task; Claude alone executes merges, production deployment/rollback and release under the existing delegated authority.
