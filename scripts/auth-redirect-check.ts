import { authDestination, DEFAULT_AUTH_DESTINATION } from "../src/lib/auth/redirect.ts";
import assert from "node:assert/strict";

const hostile = [
  undefined,
  "",
  "https://evil.example",
  "//evil.example",
  "///evil.example",
  "/\\evil",
  "/%2fevil",
  "/%5cevil",
  "/%252fevil",
  "/%255cevil",
  "/%00evil",
  "/%0aevil",
  "/%7fevil",
  "/auth/v1/login",
  "/api/auth/sign-out",
  "/AUTH/v2/register",
  "/%61uth/v1/login",
  "/dashboard/../auth/v1/login",
  "/dashboard/%2e%2e/api/auth",
  `/dashboard/${String.fromCharCode(10)}`,
  "/%invalid",
];
for (const value of hostile) assert.equal(authDestination(value), DEFAULT_AUTH_DESTINATION);
const valid = [
  "/dashboard/profile?tab=account#sessions",
  "/dashboard/tasks?q=space%20test",
  "/mail",
  "/chat",
  "/unknown-app-page",
  "/dashboard/tasks?next=https://evil.example&path=%2Fapi#task",
  "/dashboard/tasks?q=%252f",
];
for (const value of valid) assert.equal(authDestination(value), value);
console.log(`Redirect validator: ${hostile.length + valid.length}/${hostile.length + valid.length} passing.`);
