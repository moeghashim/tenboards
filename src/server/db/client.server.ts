import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { databaseUrl } from "../data/source.ts";
import { runtimeEnvironment, workerRequestScope } from "../runtime.server.ts";

// Importing this module never opens a connection. Demo never calls getDatabase.
let client: ReturnType<typeof postgres> | undefined;
const databaseKey = Symbol("request database");
function createClient(workers: boolean) {
  return postgres(databaseUrl(runtimeEnvironment()), {
    max: workers ? 1 : 4,
    connect_timeout: 3,
    idle_timeout: 5,
    onnotice: () => undefined,
  });
}
export function getDatabase() {
  const scope = workerRequestScope();
  if (scope) {
    let database = scope.resources.get(databaseKey) as ReturnType<typeof drizzle> | undefined;
    if (!database) {
      const requestClient = createClient(true);
      database = drizzle(requestClient);
      scope.resources.set(databaseKey, database);
      scope.cleanup.push(() => requestClient.end({ timeout: 1 }));
    }
    return database;
  }
  client ??= createClient(false);
  return drizzle(client);
}
export async function closeDatabase() {
  await client?.end({ timeout: 1 });
  client = undefined;
}
