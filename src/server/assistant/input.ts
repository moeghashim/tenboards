import { z } from "zod";

import { providerIds } from "../../lib/assistant/config.ts";
import { bytes } from "../../lib/assistant/registry.ts";
import { AssistantError } from "./errors.ts";

const message = z.discriminatedUnion("role", [
  z.strictObject({
    role: z.literal("user"),
    content: z
      .string()
      .min(1)
      .refine((value) => bytes(value) <= 8192),
  }),
  z.strictObject({
    role: z.literal("assistant"),
    content: z
      .string()
      .min(1)
      .refine((value) => bytes(value) <= 32768),
  }),
]);
export const requestSchema = z
  .strictObject({ provider: z.enum(providerIds).optional(), messages: z.array(message).min(1).max(20) })
  .refine((body) => body.messages.at(-1)?.role === "user");
export type AssistantRequest = z.infer<typeof requestSchema>;
export async function readInput(request: Request, timeoutMs = 10000): Promise<AssistantRequest> {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get("content-type") ?? ""))
    throw new AssistantError("invalid", 415);
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > 65536)) throw new AssistantError("limit", 413);
  if (!request.body) throw new AssistantError("invalid", 400);
  const reader = request.body.getReader();
  let timeout = false;
  const cancel = () => {
    void reader.cancel().catch(() => {
      /* Cancellation may race a closed reader. */
    });
  };
  const timer = setTimeout(() => {
    timeout = true;
    cancel();
  }, timeoutMs);
  request.signal.addEventListener("abort", cancel, { once: true });
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let size = 0;
    let body = "";
    while (true) {
      if (request.signal.aborted) throw new AssistantError("invalid", 400);
      const part = await reader.read();
      if (timeout) throw new AssistantError("timeout", 408);
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 65536) throw new AssistantError("limit", 413);
      body += decoder.decode(part.value, { stream: true });
    }
    body += decoder.decode();
    return requestSchema.parse(JSON.parse(body));
  } catch (error) {
    throw error instanceof AssistantError ? error : new AssistantError("invalid", 400);
  } finally {
    clearTimeout(timer);
    request.signal.removeEventListener("abort", cancel);
    void reader.cancel().catch(() => {
      /* Cancellation may race a closed reader. */
    });
    reader.releaseLock();
  }
}
