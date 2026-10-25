import { inspectLanguage } from "../../lib/assistant/language.ts";
import { bytes } from "../../lib/assistant/registry.ts";
import { encodeEvent, type StreamEvent } from "../../lib/assistant/transport.ts";

export type SourceEvent =
  | { type: "text-delta"; text: string }
  | { type: "finish"; finishReason: string }
  | { type: string };
export const deadlines = { first: 20000, idle: 15000, total: 60000 };
export function boundedStream(
  source: (signal: AbortSignal) => ReadableStream<SourceEvent>,
  requestSignal: AbortSignal,
  timing = deadlines,
) {
  const abort = new AbortController();
  let reader: ReadableStreamDefaultReader<SourceEvent> | undefined;
  let finished = false;
  let content = "";
  let contentBytes = 0;
  let timer: ReturnType<typeof setTimeout>;
  let total: ReturnType<typeof setTimeout>;
  let finish: (event?: StreamEvent) => void = () => {
    /* Cancellation may race a closed reader. */
  };
  const disconnect = () => finish({ v: 1, type: "error", code: "unavailable" });
  return new ReadableStream<Uint8Array>(
    {
      start(controller) {
        finish = (event) => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          clearTimeout(total);
          requestSignal.removeEventListener("abort", disconnect);
          abort.abort();
          void reader
            ?.cancel()
            .catch(() => {
              /* Cancellation may race a closed reader. */
            })
            .finally(() => reader?.releaseLock());
          if (event) {
            controller.enqueue(encodeEvent(event));
            controller.close();
          }
        };
        requestSignal.addEventListener("abort", disconnect, { once: true });
        timer = setTimeout(() => finish({ v: 1, type: "error", code: "timeout" }), timing.first);
        total = setTimeout(() => finish({ v: 1, type: "error", code: "timeout" }), timing.total);
        if (requestSignal.aborted) {
          disconnect();
          return;
        }
        try {
          reader = source(abort.signal).getReader();
        } catch {
          finish({ v: 1, type: "error", code: "provider" });
        }
      },
      async pull(controller) {
        if (finished || !reader) return;
        try {
          while (!finished) {
            const part = await reader.read();
            if (finished) return;
            if (part.done) {
              finish({ v: 1, type: "error", code: "provider" });
              return;
            }
            const event = part.value;
            if (event.type === "text-delta" && "text" in event && typeof event.text === "string" && event.text) {
              contentBytes += bytes(event.text);
              if (contentBytes > 65536) {
                finish({ v: 1, type: "error", code: "limit" });
                return;
              }
              content += event.text;
              clearTimeout(timer);
              timer = setTimeout(() => finish({ v: 1, type: "error", code: "timeout" }), timing.idle);
              controller.enqueue(encodeEvent({ v: 1, type: "text-delta", text: event.text }));
              return;
            }
            if (event.type === "finish") {
              const usage = "totalUsage" in event ? (event.totalUsage as { outputTokens?: number }) : undefined;
              if ((usage?.outputTokens ?? 0) > 4096 || ("finishReason" in event && event.finishReason === "length")) {
                finish({ v: 1, type: "error", code: "limit" });
                return;
              }
              const valid =
                "finishReason" in event &&
                event.finishReason === "stop" &&
                inspectLanguage(content, true).status === "ready";
              finish(valid ? { v: 1, type: "finish" } : { v: 1, type: "error", code: content ? "invalid" : "refused" });
              return;
            }
            if (event.type === "error" || event.type === "abort" || event.type.startsWith("tool-")) {
              finish({ v: 1, type: "error", code: "provider" });
              return;
            }
            // Reasoning, metadata, usage, sources and protocol bookkeeping never reach the renderer.
          }
        } catch {
          finish({ v: 1, type: "error", code: "provider" });
        }
      },
      cancel() {
        finish();
      },
    },
    { highWaterMark: 1 },
  );
}
