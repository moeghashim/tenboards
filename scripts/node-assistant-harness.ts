// Test-only preload for actual Node/Vite requests. Provider egress is intercepted before SDK initialization.

import type { ProviderId } from "../src/lib/assistant/config.ts";
import { wireResponse } from "./assistant-wire-fixtures.ts";

const originalFetch = globalThis.fetch;
const hosts: Record<string, ProviderId> = {
  "api.anthropic.com": "anthropic",
  "api.openai.com": "openai",
  "api.x.ai": "xai",
  "api.meta.ai": "meta",
  "generativelanguage.googleapis.com": "google",
};
globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  const provider = hosts[url.hostname];
  if (provider) return Promise.resolve(wireResponse(provider, "success", init?.signal));
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("Test blocked unexpected egress.");
  return originalFetch(input, init);
};
