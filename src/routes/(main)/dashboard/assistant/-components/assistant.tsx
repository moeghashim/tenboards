import { useEffect, useRef, useState } from "react";

import { ArrowUp, Plus, Square } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { inspectLanguage } from "@/lib/assistant/language";
import { examples, recordedStream } from "@/lib/assistant/recorded";
import { bytes } from "@/lib/assistant/registry";
import { consumeStream } from "@/lib/assistant/transport";

import { PageHeader } from "../../-components/app-pages/page-header";
import { SafeResponse } from "./safe-response";

type Turn = { id: number; prompt: string; text: string; status: "streaming" | "completed" | "stopped" | "error" };
export function Assistant() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const composer = useRef<HTMLTextAreaElement>(null);
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
      if (generation.current === id) active.current = null;
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
    <div className="flex min-h-[calc(100svh-7rem)] min-w-0 flex-col gap-5">
      <PageHeader
        title="AI Assistant"
        description="Explore answers as summaries, tables and charts."
        actions={
          <Button variant="outline" onClick={clear}>
            <Plus />
            New conversation
          </Button>
        }
      />
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Recorded demo</Badge>
          <p className="text-muted-foreground text-xs">Sample replies · No model is connected</p>
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          {turns.length === 0 ? (
            <section className="space-y-4 py-6">
              <h2 className="text-lg font-medium">Try an example</h2>
              <p className="text-muted-foreground max-w-prose">
                These recorded replies use illustrative data. They cannot read or change your workspace.
              </p>
              <div className="flex flex-col items-start gap-2">
                {examples.map((example) => (
                  <Button key={example.id} variant="outline" onClick={() => void send(example.prompt)}>
                    {example.label}
                  </Button>
                ))}
              </div>
            </section>
          ) : (
            turns.map((turn) => (
              <article key={turn.id} className="min-w-0 space-y-4">
                <div className="bg-muted ml-auto max-w-prose rounded-xl px-4 py-3">
                  <p className="mb-1 font-medium">You</p>
                  <p className="whitespace-pre-wrap break-words">{turn.prompt}</p>
                </div>
                <div className="min-w-0 space-y-3">
                  <p className="text-muted-foreground text-xs">Recorded demo · {turn.status}</p>
                  <SafeResponse text={turn.text} complete={turn.status === "completed" || turn.status === "error"} />
                  {turn.status === "stopped" && (
                    <p className="text-muted-foreground">Response stopped. This reply is incomplete.</p>
                  )}
                  {turn.status === "error" && (
                    <p className="text-danger">The reply could not be completed. Try an example again.</p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
        <form
          className="bg-background sticky bottom-0 space-y-2 border-t py-3"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <label htmlFor="assistant-message" className="font-medium">
            Message
          </label>
          <Textarea
            ref={composer}
            id="assistant-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question or try an example…"
            className="max-h-48 resize-y"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                event.preventDefault();
                void send();
              }
            }}
          />
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">Conversation clears when you leave or reload.</p>
            {busy ? (
              <Button type="button" variant="outline" onClick={() => active.current?.abort()}>
                <Square />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!input.trim()}>
                <ArrowUp />
                Send
              </Button>
            )}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {busy
              ? "Preparing a recorded reply."
              : turns.length
                ? `Response ${turns.at(-1)?.status}.`
                : "Ready for a message."}
          </p>
        </form>
      </div>
    </div>
  );
}
