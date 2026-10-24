import type { AuthEnvironment } from "../lib/auth/config.ts";
import { databaseUrl } from "./data/source-config.ts";
import { AsyncLocalStorage } from "node:async_hooks";

export type RuntimeBindings = AuthEnvironment & { HYPERDRIVE?: unknown };
type RuntimeRequest = Request & {
  runtime?: { cloudflare?: { env: RuntimeBindings } };
};
type RequestScope = {
  env: AuthEnvironment;
  resources: Map<symbol, unknown>;
  cleanup: (() => Promise<void>)[];
};
const requests = new AsyncLocalStorage<RequestScope>();

// Resolve once at the request boundary. Never merge Worker bindings with process.env.
export function resolveEnvironment(bindings: RuntimeBindings): AuthEnvironment {
  if (bindings.DATA_SOURCE === "demo" || !("HYPERDRIVE" in bindings)) return { ...bindings };
  const binding = bindings.HYPERDRIVE;
  if (
    !binding ||
    typeof binding !== "object" ||
    !("connectionString" in binding) ||
    typeof binding.connectionString !== "string" ||
    !binding.connectionString
  ) {
    throw new Error("Database binding configuration is invalid.");
  }
  const env = { ...bindings, DATABASE_URL: binding.connectionString };
  databaseUrl(env);
  return env;
}

export function runtimeEnvironment(): AuthEnvironment {
  return requests.getStore()?.env ?? process.env;
}

export function workerRequestScope() {
  return requests.getStore();
}

export async function withRuntimeRequest<T>(
  request: RuntimeRequest,
  next: () => Promise<T>,
  invalidConfiguration?: () => T,
): Promise<T> {
  const cloudflare = request.runtime?.cloudflare;
  if (!cloudflare) return next();
  let env: AuthEnvironment;
  try {
    env = resolveEnvironment(cloudflare.env);
    env.REQUIRE_AUTH_ORIGIN = !["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);
  } catch (error) {
    if (invalidConfiguration) return invalidConfiguration();
    throw error;
  }
  const scope: RequestScope = { env, resources: new Map(), cleanup: [] };
  return requests.run(scope, async () => {
    try {
      return await next();
    } finally {
      await Promise.allSettled(scope.cleanup.map((close) => close()));
    }
  });
}
