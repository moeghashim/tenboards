import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { sql } from "drizzle-orm";

import { authAccount, authSession, authUser, authVerification } from "../../server/db/auth-schema.ts";
import { getDatabase } from "../../server/db/client.server.ts";
import { authConfiguration } from "./config.ts";

function createAuth(config: Extract<ReturnType<typeof authConfiguration>, { enabled: true }>) {
  return betterAuth({
    appName: "tenboards",
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: [config.baseURL],
    database: drizzleAdapter(getDatabase(), {
      provider: "pg",
      schema: {
        user: authUser,
        session: authSession,
        account: authAccount,
        verification: authVerification,
      },
    }),
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
    socialProviders: {
      ...(config.providers.google ? { google: config.providers.google } : {}),
      ...(config.providers.github
        ? { github: { ...config.providers.github, scope: ["read:user", "user:email"] } }
        : {}),
    },
    account: { accountLinking: { enabled: false } },
    session: { cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: "memory", window: 10, max: 100 },
    advanced: { useSecureCookies: config.baseURL.startsWith("https://") },
    logger: { disabled: true },
    telemetry: { enabled: false },
    plugins: [tanstackStartCookies()],
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  const config = authConfiguration(process.env);
  if (!config.enabled) return null;
  instance ??= createAuth(config);
  return instance;
}
export const AUTH_SERVICE_ERROR =
  "Authentication is unavailable. Check the database connection and migrations, then retry.";
export async function assertAuthStorage() {
  try {
    // Even a signed-out request must fail closed when auth storage is missing.
    await getDatabase().execute(sql`select 1 from auth_user, auth_session, auth_account, auth_verification limit 0`);
  } catch {
    throw new Error(AUTH_SERVICE_ERROR);
  }
}
export async function handleAuth(request: Request) {
  try {
    const auth = getAuth();
    if (!auth) return Response.json({ message: "Authentication is disabled in this demo." }, { status: 404 });
    await assertAuthStorage();
    const response = await auth.handler(request);
    response.headers.set("Cache-Control", "private, no-store");
    if (response.status >= 500) return Response.json({ message: AUTH_SERVICE_ERROR }, { status: 503 });
    return response;
  } catch {
    return Response.json({ message: AUTH_SERVICE_ERROR }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
