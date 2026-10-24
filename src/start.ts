import { createMiddleware, createStart } from "@tanstack/react-start";

const configurationBoundary = createMiddleware().server(async ({ next }) => {
  const { authConfiguration } = await import("./lib/auth/config");
  try {
    const config = authConfiguration(process.env);
    if (config.enabled) {
      const { assertAuthStorage } = await import("./lib/auth/auth.server");
      await assertAuthStorage();
    }
  } catch {
    return new Response("Authentication/data configuration is invalid. Check your server environment.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  return next();
});
export const startInstance = createStart(() => ({ requestMiddleware: [configurationBoundary] }));
