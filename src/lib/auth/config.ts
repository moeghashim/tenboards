import { type DataEnvironment, databaseUrl, selectSource } from "../../server/data/source.ts";

export type AuthEnvironment = DataEnvironment & {
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
};
export function authConfiguration(env: AuthEnvironment) {
  const source = selectSource(env);
  const secret = env.BETTER_AUTH_SECRET;
  if (secret === undefined || secret === "") return { enabled: false as const };
  if (source !== "db") throw new Error("Authentication requires the database data source.");
  databaseUrl(env);
  // Enforce the library's recommended minimum instead of allowing warning-only secrets.
  if (secret !== secret.trim() || secret.length < 32 || secret.length * Math.log2(new Set(secret).size) < 120)
    throw new Error("Authentication secret is invalid. Generate a random secret of at least 32 characters.");
  let baseURL: string;
  try {
    const url = new URL(env.BETTER_AUTH_URL ?? "http://localhost:3000");
    if (
      (url.protocol !== "https:" &&
        !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error();
    baseURL = url.origin;
  } catch {
    throw new Error("Authentication base URL is invalid.");
  }
  const pair = (clientId?: string, clientSecret?: string) =>
    clientId?.trim() && clientSecret?.trim()
      ? { clientId: clientId.trim(), clientSecret: clientSecret.trim() }
      : undefined;
  return {
    enabled: true as const,
    secret,
    baseURL,
    providers: {
      google: pair(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET),
      github: pair(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET),
    },
  };
}
