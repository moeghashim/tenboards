import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createXai } from "@ai-sdk/xai";
import { streamText } from "ai";

import type { ConfiguredProvider } from "./config.server.ts";
import { AssistantError } from "./errors.ts";
import type { AssistantRequest } from "./input.ts";
import { systemPrompt } from "./prompt.ts";

// Provider warnings can embed upstream details. This static policy contains no request state.
globalThis.AI_SDK_LOG_WARNINGS = false;
const hosts = new Set([
  "api.anthropic.com",
  "api.openai.com",
  "api.x.ai",
  "api.meta.ai",
  "generativelanguage.googleapis.com",
]);
export function boundedFetch(signal: AbortSignal, upstream: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.protocol !== "https:" || !hosts.has(url.hostname)) throw new AssistantError("provider");
    const combined = AbortSignal.any([signal, ...(init?.signal ? [init.signal] : [])]);
    const response = await upstream(input, { ...init, signal: combined, redirect: "error" });
    if (!response.ok || !response.body || !response.headers.get("content-type")?.includes("text/event-stream")) {
      void response.body?.cancel().catch(() => {
        /* Cancellation may race a closed reader. */
      });
      throw new AssistantError("provider");
    }
    const reader = response.body.getReader();
    let size = 0;
    let done = false;
    const cancel = () => {
      void reader
        .cancel()
        .catch(() => {
          /* Cancellation may race a closed reader. */
        })
        .finally(() => reader.releaseLock());
    };
    combined.addEventListener("abort", cancel, { once: true });
    const cleanup = () => {
      done = true;
      combined.removeEventListener("abort", cancel);
    };
    return new Response(
      new ReadableStream<Uint8Array>({
        async pull(controller) {
          if (done) return;
          try {
            combined.throwIfAborted();
            const part = await reader.read();
            if (part.done) {
              cleanup();
              reader.releaseLock();
              controller.close();
              return;
            }
            size += part.value.byteLength;
            // Bound parser frames and SDK metadata buffers independently of the visible-text cap.
            if (size > 2 * 1024 * 1024) throw new AssistantError("limit");
            controller.enqueue(part.value);
          } catch {
            cleanup();
            cancel();
            controller.error(new AssistantError("provider"));
          }
        },
        cancel() {
          cleanup();
          cancel();
        },
      }),
      { status: response.status, headers: { "Content-Type": "text/event-stream" } },
    );
  };
}
export function providerStream(
  provider: ConfiguredProvider,
  messages: AssistantRequest["messages"],
  signal: AbortSignal,
  upstream?: typeof fetch,
) {
  const options = { apiKey: provider.key, fetch: boundedFetch(signal, upstream) };
  const model = (() => {
    switch (provider.id) {
      case "anthropic":
        return createAnthropic(options)(provider.model);
      case "openai":
        return createOpenAI(options).responses(provider.model);
      case "xai":
        return createXai(options).responses(provider.model);
      case "google":
        return createGoogleGenerativeAI(options)(provider.model);
      case "meta":
        return createOpenAICompatible({
          ...options,
          name: "meta",
          baseURL: "https://api.meta.ai/v1",
          includeUsage: true,
          transformRequestBody: (body) => ({
            ...body,
            messages: body.messages.map((message: { role: string }) =>
              message.role === "system" ? { ...message, role: "developer" } : message,
            ),
          }),
        }).chatModel(provider.model);
    }
  })();
  return streamText({
    model,
    system: systemPrompt(),
    messages,
    maxOutputTokens: 4096,
    maxRetries: 0,
    telemetry: { isEnabled: false, recordInputs: false, recordOutputs: false, integrations: [] },
    providerOptions: { openai: { store: false }, xai: { store: false } },
    onError() {
      /* Only our safe error envelope crosses the response boundary. */
    },
  }).fullStream;
}
