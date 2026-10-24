import { assertSafeError, localDatabase, startTestServer, testSecret } from "./auth-test-support.ts";
import assert from "node:assert/strict";

for (const [label, DATABASE_URL, auth, expected] of [
  ["zero environment", undefined, false, 404],
  ["DB without secret", localDatabase, false, 404],
  ["unreachable auth DB", "postgresql://test:private@127.0.0.1:1/absent", true, 503],
  ["missing auth schema", localDatabase.replace(/\/tenboards$/, "/tenboards_missing_schema"), true, 503],
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
