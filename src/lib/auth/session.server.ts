import { getRequestHeaders, setResponseHeader } from "@tanstack/react-start/server";

import { AUTH_SERVICE_ERROR, assertAuthStorage, getAuth } from "./auth.server.ts";
import { authConfiguration } from "./config.ts";
import type { AuthState } from "./types.ts";

export async function readAuthState(): Promise<AuthState> {
  setResponseHeader("Cache-Control", "private, no-store");
  const config = authConfiguration(process.env);
  if (!config.enabled) return { mode: "demo", user: null, providers: { google: false, github: false } };
  try {
    await assertAuthStorage();
    const session = await getAuth()?.api.getSession({ headers: getRequestHeaders() });
    return {
      mode: "auth",
      providers: { google: !!config.providers.google, github: !!config.providers.github },
      user: session ? { id: session.user.id, name: session.user.name, email: session.user.email } : null,
    };
  } catch {
    throw new Error(AUTH_SERVICE_ERROR);
  }
}
export async function requireSession() {
  const state = await readAuthState();
  if (state.mode === "auth" && !state.user) throw new Error("Sign in to continue.");
  return state;
}
