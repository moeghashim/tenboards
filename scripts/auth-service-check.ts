import postgres from "postgres";

import { assertSafeError, localDatabase, startTestServer, testSecret } from "./auth-test-support.ts";
import assert from "node:assert/strict";

// Make the missing-schema case real on a clean Docker setup. Preserve this
// explicitly test-owned empty database for inspection; never reset shared data.
const missingURL = new URL(localDatabase);
missingURL.pathname = "/tenboards_auth_unmigrated_test";
const admin = postgres(localDatabase, { connect_timeout: 3 });
try {
  const existing = await admin`select 1 from pg_database where datname = 'tenboards_auth_unmigrated_test'`;
  if (!existing.length) await admin`create database tenboards_auth_unmigrated_test`;
} finally {
  await admin.end();
}
const empty = postgres(missingURL.href, { connect_timeout: 3 });
try {
  const [result] = await empty`select to_regclass('public.auth_user') as table_name`;
  assert.equal(result.table_name, null, "Missing-schema test database must remain unmigrated.");
} finally {
  await empty.end();
}

for (const [label, DATABASE_URL, auth, expected] of [
  ["zero environment", undefined, false, 404],
  ["DB without secret", localDatabase, false, 404],
  ["unreachable auth DB", "postgresql://test:private@127.0.0.1:1/absent", true, 503],
  ["missing auth schema", missingURL.href, true, 503],
  ["recovered auth DB", localDatabase, true, 200],
] as const) {
  const server = await startTestServer({
    DATABASE_URL,
    BETTER_AUTH_SECRET: auth ? testSecret() : undefined,
    BETTER_AUTH_URL: "http://localhost:3011",
  });
  try {
    const response = await server.api.get("/api/auth/get-session");
    assert.equal(response.status(), expected, label);
    assertSafeError(await response.text());
    if (!auth) assert.equal((await server.api.get("/dashboard/default")).status(), 200);
    console.log(`PASS ${label}`);
  } finally {
    await server.stop();
  }
}
