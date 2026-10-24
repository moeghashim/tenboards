import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { localDatabase } from "./auth-test-support.ts";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const archive = await mkdtemp(path.join(tmpdir(), "tenboards-v05-migrations-"));
const baseline = path.join(archive, "src/server/db/migrations");
const current = "src/server/db/migrations";
const admin = postgres(localDatabase, { connect_timeout: 3 });
const journal = JSON.parse(await readFile(`${current}/meta/_journal.json`, "utf8"));
try {
  const archiveFile = path.join(archive, "v05.tar");
  execFileSync("git", ["archive", "--output", archiveFile, "v0.5.0", "src/server/db/migrations"]);
  execFileSync("tar", ["-xf", archiveFile, "-C", archive]);
  for (const file of await readdir(baseline))
    if (file.endsWith(".sql"))
      assert.equal(
        await readFile(path.join(baseline, file), "utf8"),
        await readFile(path.join(current, file), "utf8"),
        "A v0.5 migration changed",
      );
  for (const mode of ["fresh", "upgrade"]) {
    const name = `tenboards_auth_${mode}_${Date.now()}`;
    await admin`create database ${admin(name)}`;
    const url = new URL(localDatabase);
    url.pathname = `/${name}`;
    const sql = postgres(url.href, { max: 1 });
    const run = (command: string) =>
      execFileSync("npm", ["run", command], {
        env: { ...process.env, DATABASE_URL: url.href, DATA_SOURCE: undefined, BETTER_AUTH_SECRET: undefined },
        stdio: "pipe",
      });
    const counts = async () => {
      const tables =
        await sql`select tablename from pg_tables where schemaname='public' and tablename not like 'auth_%' order by tablename`;
      const result: Record<string, number> = {};
      for (const table of tables)
        result[table.tablename] = Number((await sql`select count(*) as count from ${sql(table.tablename)}`)[0].count);
      return result;
    };
    try {
      let before: Record<string, number> | undefined;
      if (mode === "upgrade") {
        await migrate(drizzle(sql), { migrationsFolder: baseline });
        run("db:seed");
        before = await counts();
        assert.equal(
          (await sql`select count(*)::int as count from drizzle.__drizzle_migrations`)[0].count,
          journal.entries.length - 1,
        );
      }
      await migrate(drizzle(sql), { migrationsFolder: current });
      if (before) assert.deepEqual(await counts(), before);
      await migrate(drizzle(sql), { migrationsFolder: current });
      assert.equal(
        (await sql`select count(*)::int as count from drizzle.__drizzle_migrations`)[0].count,
        journal.entries.length,
      );
      run("db:seed");
      const seeded = await counts();
      run("db:seed");
      assert.deepEqual(await counts(), seeded);
      assert.equal(
        (
          await sql`select count(*)::int as count from pg_tables where schemaname='public' and tablename like 'auth_%'`
        )[0].count,
        5,
      );
      const parity = run("data:parity").toString();
      assert.ok(parity.includes('"reads":22,"scenarios":130,"passing":true'));
      console.log(
        `PASS ${mode}: ${journal.entries.length} migrations, repeat migrate/seed, 22 reads/130 scenarios; test database removed`,
      );
    } finally {
      await sql.end();
      await admin`drop database ${admin(name)} with (force)`;
    }
  }
} finally {
  await admin.end();
  await rm(archive, { recursive: true, force: true });
}
