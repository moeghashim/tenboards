import { z } from "zod";

import { bytes, limits } from "./registry.ts";

export const streamEvent = z.discriminatedUnion("type", [
  z.strictObject({ v: z.literal(1), type: z.literal("text-delta"), text: z.string().max(65536) }),
  z.strictObject({ v: z.literal(1), type: z.literal("finish") }),
  z.strictObject({
    v: z.literal(1),
    type: z.literal("error"),
    code: z.enum(["provider", "timeout", "limit", "refused", "invalid", "unavailable"]),
  }),
]);
export type StreamEvent = z.infer<typeof streamEvent>;
export const encodeEvent = (event: StreamEvent) => new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
export class StreamFailure extends Error {
  readonly code: string;
  constructor(code: string) {
    super("The response could not be completed.");
    this.code = code;
  }
}
export async function consumeStream(
  stream: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  onText: (text: string) => void,
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let buffer = "";
  let text = "";
  let terminal = false;
  let wireBytes = 0;
  const cancel = () => {
    void reader.cancel().catch(() => {
      /* Cancellation may race a closed reader. */
    });
  };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    while (true) {
      signal.throwIfAborted();
      const part = await reader.read();
      if (part.done) {
        buffer += decoder.decode();
        break;
      }
      wireBytes += part.value.byteLength;
      if (wireBytes > 2 * 1024 * 1024) throw new StreamFailure("limit");
      buffer += decoder.decode(part.value, { stream: true });
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        if (terminal || !frame.startsWith("data: ")) throw new StreamFailure("invalid");
        const event = streamEvent.parse(JSON.parse(frame.slice(6)));
        if (event.type === "text-delta") {
          text += event.text;
          if (bytes(text) > limits.outputBytes) throw new StreamFailure("limit");
          onText(text);
        } else {
          terminal = true;
          if (event.type === "error") throw new StreamFailure(event.code);
        }
        boundary = buffer.indexOf("\n\n");
      }
      if (bytes(buffer) > 400000) throw new StreamFailure("limit");
    }
    signal.throwIfAborted();
    if (!terminal || buffer.length) throw new StreamFailure("invalid");
    return text;
  } finally {
    signal.removeEventListener("abort", cancel);
    await reader.cancel().catch(() => {
      /* Cancellation may race a closed reader. */
    });
    reader.releaseLock();
  }
}
