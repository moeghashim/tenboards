# tenboards

An MIT-licensed dashboard template built with TanStack Start, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui on Base UI.

The initial import preserves the full upstream screen catalog and mock data. The design-system and shell upgrade is planned in [PLAN.md](PLAN.md) and [the v0.1 task breakdown](dev/milestones/v0.1-design-system-shell/README.md). Current screens are demonstrations; database and authentication integrations are later milestones.

## Run locally

Use Node 22+ and npm. No environment variables or database are required.

```sh
git clone https://github.com/moeghashim/tenboards.git
cd tenboards
npm install
npm run dev
```

Open [the default dashboard](http://localhost:3000/dashboard/default).

## Commands

- `npm run dev` — development server on port 3000.
- `npm run build` — production client and server build.
- `npm run preview` — preview the compiled Worker locally with Wrangler.
- `npm run check` / `npm run check:fix` — Biome lint, imports, and formatting.
- `npm run typecheck` — TypeScript (`tsc --noEmit`).
- `npm run generate-routes` — regenerate file-based routes.
- `npm run generate:presets` — regenerate the preset registry.
- `npm run deploy` — build and deploy to the live Workers URL.
- `npm run preview:deploy -- --preview-alias pr-NNN` — build and upload a version preview without changing live traffic.

## Included screens

Default, CRM, Finance, Analytics, Productivity, E-commerce, Academy, Logistics, Infrastructure, Patient Monitoring, legacy dashboard variants, file manager, products, profile, mail, chat, calendar, kanban, tasks, invoice, users, roles, authentication layouts, and error pages are retained. Route-specific components remain colocated under `src/routes/`.

## Provenance and license

Imported from [arhamkhnz/tanstack-shadcn-admin-dashboard](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard) (Studio Admin), revision [`81e5ef1391b68c176154faba0c9ac7b0023ecbaf`](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard/commit/81e5ef1391b68c176154faba0c9ac7b0023ecbaf). Copyright © 2026 Mohammed Arham Khan. The original MIT notice is preserved in [LICENSE](LICENSE), alongside the tenboards copyright. No upstream history or remote is retained.

The upstream contributor guidance is archived at [docs/upstream-AGENTS.md](docs/upstream-AGENTS.md). PLAN.md and its Decisions log govern tenboards. The root contributor rules will be established in task 003 after breakdown approval.

## Import validation notes

The unmodified import passed Biome with one existing `noArrayIndexKey` warning in `src/lib/highlighter.tsx`. Its initial TypeScript run found four errors: two unused bindings, a missing package version, and an `unknown` error accessed without narrowing. Task 001 applies narrowly scoped fixes without changing screen designs.

`npm install` reported seven high-severity dependency advisories in the inherited dependency tree. No forced dependency upgrades were applied during the import; details are included in the task PR evidence. These advisories are separate from the build, Biome, and TypeScript checks.

## Cloudflare demo and PR previews

**Live demo:** [tenboards.mohanadgh.workers.dev](https://tenboards.mohanadgh.workers.dev/dashboard/default).

**Task 002 preview:** [version 9913d738](https://9913d738-tenboards.mohanadgh.workers.dev/dashboard/default), with the reusable [pr-002 alias](https://pr-002-tenboards.mohanadgh.workers.dev/dashboard/default).

The Worker serves the existing mock-data demo. It has no database, authentication service, or secret bindings. Its only generated binding is `ASSETS` for static files. This first deployment comes from task 002's review branch; after merge, redeploy from `main`.

The build uses Nitro's `cloudflare-module` preset. `wrangler.jsonc` owns the Worker name, compatibility date, and public live/preview URL settings. Nitro generates `.output/server/wrangler.json` and `.wrangler/deploy/config.json`, including the server entry, assets binding, module rules, and Node compatibility flag. Do not hand-edit or commit generated output, or pass the root config explicitly to deploy (Wrangler follows Nitro's generated config redirect).

`npm run dev` retains upstream's Node development runtime. Nitro's direct development emulator expects Miniflare 4, while current Wrangler supplies Miniflare 5; forcing that combination fails validation. `npm run build && npm run preview` exercises the compiled Cloudflare Worker with current Wrangler instead. The production preset is therefore selected only for Vite builds. Wrangler is pinned at 4.152.0 for reproducibility.

Run manual deployments using an already authenticated Wrangler session:

```sh
# After the user merges, from a clean checkout:
git switch main
git pull --ff-only
npm ci
npm run check
npm run typecheck
npm run deploy
```

For each PR, from its branch:

```sh
npm run preview:deploy -- --preview-alias pr-NNN
```

Copy the returned version-specific URL into the PR body. The optional alias gives a reusable URL for that PR; uploading a version does not replace the live deployment. Preview URLs are public demo URLs. No GitHub Actions secrets or automated deployments are configured.

Deployment references: [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare) and [Cloudflare version URLs](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/).
