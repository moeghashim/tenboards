import { migrate } from "drizzle-orm/postgres-js/migrator";

import { databaseUrl } from "../src/server/data/source.ts";
import { closeDatabase, getDatabase } from "../src/server/db/client.server.ts";
import { seed } from "../src/server/db/seed.ts";

try {
  databaseUrl(process.env, true);
  const command = process.argv[2];
  if (command === "migrate") await migrate(getDatabase(), { migrationsFolder: "src/server/db/migrations" });
  else if (command === "seed") await seed();
  else throw new Error("Unknown database command.");
  console.log(`Database ${command} completed.`);
} catch {
  console.error(
    "Database command failed. Check the explicit local DATABASE_URL, Postgres availability and migrations.",
  );
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
