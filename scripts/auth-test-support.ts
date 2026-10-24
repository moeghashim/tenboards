import { request } from "playwright";

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

export const testSecret = () => randomBytes(48).toString("base64url");
export const localDatabase =
  process.env.DATABASE_URL ?? "postgresql://tenboards:tenboards_local@127.0.0.1:54329/tenboards";
export async function startTestServer(overrides: NodeJS.ProcessEnv = {}, port = 3011) {
  const baseURL = `http://localhost:${port}`;
  const child = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "dev", "--port", String(port), "--strictPort"],
    {
      env: {
        ...process.env,
        DATABASE_URL: undefined,
        DATA_SOURCE: undefined,
        BETTER_AUTH_SECRET: undefined,
        BETTER_AUTH_URL: undefined,
        GOOGLE_CLIENT_ID: undefined,
        GOOGLE_CLIENT_SECRET: undefined,
        GITHUB_CLIENT_ID: undefined,
        GITHUB_CLIENT_SECRET: undefined,
        ...overrides,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  // Never save server output: errors may contain request material from third-party tooling.
  child.stdout.resume();
  child.stderr.resume();
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) throw new Error("Test server failed to start (configuration rejected).");
    try {
      await fetch(`${baseURL}/favicon.svg`);
      break;
    } catch {
      await delay(250);
    }
  }
  const api = await request.newContext({ baseURL, extraHTTPHeaders: { origin: baseURL } });
  return {
    baseURL,
    api,
    async stop() {
      await api.dispose();
      child.kill("SIGTERM");
      await new Promise<void>((resolve) => {
        if (child.exitCode !== null) resolve();
        else child.once("exit", () => resolve());
      });
    },
  };
}
export function assertSafeError(text: string) {
  assert.doesNotMatch(
    text,
    /postgres(?:ql)?:\/\/|SELECT |INSERT |password authentication|client_secret|BETTER_AUTH_SECRET=/i,
  );
}

// Exercise the actual transformed RPC, including validators, without a route guard.
export async function callRpc(
  page: import("playwright").Page,
  file: string,
  name: string,
  method: "GET" | "POST",
  data?: unknown,
) {
  const source = await (await page.request.get(new URL(file, page.url()).href)).text();
  const ids = [...source.matchAll(/createClientRpc\("([^"]+)"\)/g)].map((m) => m[1]);
  const id = ids.find(
    (value) => JSON.parse(Buffer.from(value, "base64url").toString()).export === `${name}_createServerFn_handler`,
  );
  if (!id) throw new Error(`RPC not found: ${name}`);
  const rpcURL = new URL(`/_serverFn/${id}`, page.url());
  // Use Start's installed wire codec, not its runtime-context-dependent client wrapper.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const { toJSONAsync, fromCrossJSON } = await import(require.resolve("seroval"));
  const payload = JSON.stringify(await toJSONAsync({ data }));
  if (method === "GET") rpcURL.searchParams.set("payload", payload);
  const response = await page.request.fetch(rpcURL.href, {
    method,
    headers: {
      "x-tsr-serverFn": "true",
      accept: "application/json",
      origin: rpcURL.origin,
      "content-type": "application/json",
    },
    ...(method === "POST" ? { data: payload } : {}),
  });
  const { createDefaultSerovalPlugins } = await import("@tanstack/react-router/ssr/client");
  const result = fromCrossJSON(await response.json(), { refs: new Map(), plugins: createDefaultSerovalPlugins() });
  if (result?.error) return { ok: false, message: result.error.message, result: undefined };
  return { ok: true, result: result?.result, message: undefined };
}
