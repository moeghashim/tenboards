import { useEffect, useRef, useState } from "react";

import { inspectLanguage } from "@/lib/assistant/language";
import { recordedStream } from "@/lib/assistant/recorded";
import { bytes } from "@/lib/assistant/registry";
import { consumeStream } from "@/lib/assistant/transport";

import { AssistantSurface, Composer, ConversationTurn, Welcome } from "./presentation";
import { SafeResponse } from "./safe-response";

type Turn = { id: number; prompt: string; text: string; status: "streaming" | "completed" | "stopped" | "error" };
export function Assistant() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const composer = useRef<HTMLTextAreaElement>(null);
  const stopButton = useRef<HTMLButtonElement>(null);
  const busy = turns.at(-1)?.status === "streaming";
  useEffect(
    () => () => {
      generation.current++;
      active.current?.abort();
    },
    [],
  );
  async function send(prompt = input) {
    if (active.current || !prompt.trim()) return;
    if (bytes(prompt) > 8192) {
      setError("Keep your message under 8 KiB. Shorten it and try again.");
      return;
    }
    const id = ++generation.current;
    const controller = new AbortController();
    active.current = controller;
    setError("");
    setInput("");
    composer.current?.focus();
    setTurns((previous) => [...previous, { id, prompt, text: "", status: "streaming" }]);
    const update = (patch: Partial<Turn>) => {
      if (generation.current === id)
        setTurns((previous) => previous.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
    };
    try {
      const text = await consumeStream(recordedStream(prompt, controller.signal), controller.signal, (text) =>
        update({ text }),
      );
      update({ text, status: inspectLanguage(text, true).status === "ready" ? "completed" : "error" });
    } catch {
      update({ status: controller.signal.aborted ? "stopped" : "error" });
    } finally {
      if (generation.current === id) {
        active.current = null;
        if (document.activeElement === stopButton.current) composer.current?.focus();
      }
    }
  }
  function clear() {
    generation.current++;
    active.current?.abort();
    active.current = null;
    setTurns([]);
    setInput("");
    setError("");
    composer.current?.focus();
  }
  return (
    <AssistantSurface clear={clear}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 md:px-6">
        <div
          className="mx-auto flex min-h-full w-full max-w-[752px] flex-col gap-7 py-5"
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          aria-busy={busy}
        >
          {turns.length === 0 ? (
            <Welcome send={(prompt) => void send(prompt)} disabled={busy} />
          ) : (
            turns.map((turn) => (
              <ConversationTurn key={turn.id} prompt={turn.prompt} attribution={`Recorded demo · ${turn.status}`}>
                {turn.status !== "error" && (
                  <SafeResponse
                    text={turn.text}
                    complete={turn.status === "completed"}
                    pending={turn.status === "streaming"}
                  />
                )}
                {turn.status === "stopped" && (
                  <p className="text-muted-foreground">Response stopped. This reply is incomplete.</p>
                )}
                {turn.status === "error" && (
                  <p className="text-danger">The reply could not be completed. Try an example again.</p>
                )}
              </ConversationTurn>
            ))
          )}
        </div>
      </div>
      <Composer
        input={input}
        setInput={setInput}
        send={() => void send()}
        stop={() => {
          active.current?.abort();
          composer.current?.focus();
        }}
        busy={busy}
        composer={composer}
        stopButton={stopButton}
      >
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
      </Composer>
      <p className="sr-only" role="status">
        {busy
          ? "Preparing a recorded reply."
          : turns.length
            ? `Response ${turns.at(-1)?.status}.`
            : "Ready for a message."}
      </p>
    </AssistantSurface>
  );
}
