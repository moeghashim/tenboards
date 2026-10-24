import { request } from "playwright";

import type { AuthEnvironment } from "../src/lib/auth/config.ts";
import { databaseUrl } from "../src/server/data/source.ts";
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

export async function startWorker(
  env: AuthEnvironment = {},
  options: { port?: number; binding?: boolean; harness?: boolean } = {},
) {
  const port = options.port ?? 3021;
  const baseURL = `http://localhost:${port}`;
  const directory = path.resolve(`.wrangler/review-${port}`);
  await mkdir(directory, { recursive: true });
  const vars = { ...env };
  const hyperdrive = options.binding
    ? [{ binding: "HYPERDRIVE", id: "00000000000000000000000000000000", localConnectionString: databaseUrl(env, true) }]
    : [];
  if (options.binding) delete vars.DATABASE_URL;
  // This is a separate local test source config, never a mutation of Nitro output.
  const config = {
    name: "tenboards-local-test",
    compatibility_date: "2026-10-23",
    compatibility_flags: ["nodejs_compat"],
    main: path.resolve(options.harness ? "scripts/worker-parity-harness.ts" : ".output/server/index.mjs"),
    no_bundle: !options.harness,
    rules: options.harness ? [] : [{ type: "ESModule", globs: ["**/*.mjs", "**/*.js"] }],
    assets: { binding: "ASSETS", directory: path.resolve(".output/public") },
    env: { local: { hyperdrive } },
  };
  const configPath = path.join(directory, "wrangler.json");
  await writeFile(configPath, JSON.stringify(config));
  await writeFile(
    path.join(directory, ".dev.vars.local"),
    Object.entries(vars)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join("\n"),
    { mode: 0o600 },
  );
  const child = spawn(
    process.execPath,
    [
      "node_modules/wrangler/bin/wrangler.js",
      "dev",
      "--config",
      configPath,
      "--env",
      "local",
      "--local",
      "--ip",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      env: { ...process.env, WRANGLER_SEND_METRICS: "false", CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  // Do not persist Wrangler output: local bindings include credentials.
  child.stdout.resume();
  child.stderr.resume();
  const stop = async () => {
    child.kill("SIGTERM");
    if (child.exitCode === null) await new Promise<void>((resolve) => child.once("exit", () => resolve()));
    await rm(directory, { recursive: true, force: true });
  };
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) break;
    try {
      const response = await fetch(`${baseURL}/favicon.svg`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Local server is still starting. */
    }
    await delay(250);
  }
  if (!ready) {
    await stop();
    throw new Error("Local Worker failed to start (details redacted).");
  }
  const api = await request.newContext({
    baseURL,
    extraHTTPHeaders: { origin: baseURL, "cf-connecting-ip": "192.0.2.1" },
  });
  return {
    baseURL,
    api,
    async stop() {
      await api.dispose();
      await stop();
    },
  };
}
