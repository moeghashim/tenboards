// Optional offset lets independent worktrees run the same regression suites.
export function testPort(port: number) {
  const offset = Number(process.env.TEST_PORT_OFFSET ?? 0);
  if (!Number.isInteger(offset) || port + offset < 1024 || port + offset > 65535)
    throw new Error("Invalid test port offset.");
  return port + offset;
}
export function testOrigin(origin: string) {
  const url = new URL(origin);
  if (url.hostname === "localhost" && url.port) url.port = String(testPort(Number(url.port)));
  return url.origin;
}
