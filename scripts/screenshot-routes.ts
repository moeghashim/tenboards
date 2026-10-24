export { captureRoutes } from "../src/navigation/route-catalog.ts";

// HTTP endpoints have separate API tests and no visual document.
export const httpRoutes: string[] = ["/api/auth/$"];
