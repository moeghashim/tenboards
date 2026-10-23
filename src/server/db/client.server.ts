import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { databaseUrl } from "../data/source.ts";

// Importing this module never opens a connection. Demo never calls getDatabase.
let client: ReturnType<typeof postgres> | undefined;
export function getDatabase() {
  client ??= postgres(databaseUrl(process.env), {
    max: 4,
    connect_timeout: 3,
    idle_timeout: 5,
    onnotice: () => undefined,
  });
  return drizzle(client);
}
export async function closeDatabase() {
  await client?.end({ timeout: 1 });
  client = undefined;
}
