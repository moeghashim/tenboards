import { chromium } from "playwright";
import postgres from "postgres";

import { callRpc, localDatabase, startTestServer, testHeaders, testSecret } from "./auth-test-support.ts";
import { cacheCaptureFonts } from "./screenshot-assets.ts";
import { testOrigin } from "./test-port.ts";
import assert from "node:assert/strict";

const server = await startTestServer({
  DATABASE_URL: localDatabase,
  BETTER_AUTH_SECRET: testSecret(),
  BETTER_AUTH_URL: testOrigin("http://localhost:3011"),
});
const browser = await chromium.launch(),
  db = postgres(localDatabase, { max: 1 });
const context = await browser.newContext({ extraHTTPHeaders: testHeaders });
await cacheCaptureFonts(context);
const page = await context.newPage(),
  email = `project-v08-${Date.now()}@example.test`;
const file = "/src/routes/(main)/dashboard/projects/-components/project-functions.ts";
try {
  await page.goto(`${server.baseURL}/auth/v2/login`);
  for (const name of ["loadProject", "loadProjectTasks", "loadProjectBoard"]) {
    const result = await callRpc(page, file, name, "GET", { projectId: "sample-docs" });
    assert.equal(result.ok, false);
    assert.equal(result.message, "Sign in to continue.");
  }
  for (const path of ["/dashboard/projects/sample-docs/board", "/dashboard/projects/missing/list"]) {
    let response = await context.request.get(server.baseURL + path, { maxRedirects: 0 });
    const location = response.headers().location;
    if (location?.startsWith(`${path}?`))
      response = await context.request.get(server.baseURL + location, { maxRedirects: 0 });
    assert.equal(response.status(), 307);
    assert.match(response.headers().location, /auth\/v2\/login/);
  }
  const signup = await context.request.post(`${server.baseURL}/api/auth/sign-up/email`, {
    headers: { origin: server.baseURL },
    data: { name: "Project test", email, password: testSecret() },
  });
  assert.equal(signup.status(), 200);
  const user = (await signup.json()).user;
  await page.goto(`${server.baseURL}/dashboard/projects/sample-docs/list`);
  await page.getByRole("heading", { name: "Documentation refresh", exact: true }).waitFor();
  const tasks = await callRpc(page, file, "loadProjectTasks", "GET", { projectId: "sample-docs" });
  assert.equal(tasks.ok, true);
  assert.equal(tasks.result.total, 5);
  assert.ok(tasks.result.items.every((t: { projectId: string }) => t.projectId === "sample-docs"));
  assert.match(tasks.cacheControl, /private.*no-store/);
  for (const input of [{ projectId: "sample-docs", id: "board:tender-workflow-map" }, { projectId: "sample-empty" }]) {
    const result = await callRpc(page, file, "loadProjectTasks", "GET", input);
    assert.equal(result.result.total, 0);
  }
  assert.equal((await callRpc(page, file, "loadProjectTasks", "GET", { projectId: "missing" })).result, null);
  for (const input of [
    { projectId: "../wrong" },
    { projectId: "a".repeat(121) },
    { projectId: "sample-docs", limit: 101 },
    { projectId: "sample-docs", status: "unknown" },
  ])
    assert.equal((await callRpc(page, file, "loadProjectTasks", "GET", input)).ok, false);
  const missing = await context.request.get(`${server.baseURL}/dashboard/projects/missing/board`);
  assert.equal(missing.status(), 404);
  await db`delete from auth_session where user_id=${user.id}`;
  assert.equal(
    (await callRpc(page, file, "loadProjectTasks", "GET", { projectId: "sample-docs" })).message,
    "Sign in to continue.",
  );
  assert.equal(
    (await context.request.get(`${server.baseURL}/dashboard/projects/sample-docs/board`, { maxRedirects: 0 })).status(),
    307,
  );
  console.log(
    `PASS ${process.env.AUTH_TEST_RUNTIME ?? "Node"}: denied/direct guarded RPCs, unknown-project auth boundary, DB scope/empty/missing, malformed/filter bounds, private cache, revocation`,
  );
} finally {
  await db`delete from auth_user where email=${email}`;
  await db.end();
  await context.close();
  await browser.close();
  await server.stop();
}
