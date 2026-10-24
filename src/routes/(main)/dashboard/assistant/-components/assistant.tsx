import { ArrowUp, Plus, RotateCcw, Square } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { AssistantConfig, ProviderId } from "@/lib/assistant/config";
import { examples } from "@/lib/assistant/recorded";

import { PageHeader } from "../../-components/app-pages/page-header";
import { failureCopy } from "./conversation";
import { SafeResponse } from "./safe-response";
import { useConversation } from "./use-conversation";

export function Assistant({ config }: { config: AssistantConfig }) {
  const conversation = useConversation(config);
  const { turns, input, setInput, error, busy, composer, selected, provider, send, clear } = conversation;
  return (
    <div className="flex min-h-[calc(100svh-7rem)] min-w-0 flex-col gap-5">
      <PageHeader
        title="AI Assistant"
        description="Explore answers as summaries, tables and charts."
        actions={
          <Button variant="outline" onClick={() => clear()}>
            <Plus />
            New conversation
          </Button>
        }
      />
      <div className="flex w-full max-w-4xl flex-1 flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          {conversation.config.providers.length ? (
            <>
              <label htmlFor="assistant-provider" className="text-sm font-medium">
                Provider
              </label>
              <NativeSelect
                id="assistant-provider"
                value={provider ?? ""}
                disabled={busy || conversation.expired || conversation.refreshing}
                onChange={(event) => conversation.select(event.target.value as ProviderId)}
                className="max-w-full"
                size="sm"
              >
                {conversation.selectionRequired && (
                  <NativeSelectOption value="" disabled>
                    Choose a provider
                  </NativeSelectOption>
                )}
                {conversation.config.providers.map((item) => (
                  <NativeSelectOption key={item.id} value={item.id}>
                    {item.name} · {item.model}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </>
          ) : (
            <>
              <Badge variant="secondary">Recorded demo</Badge>
              <p className="text-muted-foreground text-xs">Sample replies · No model is connected</p>
            </>
          )}
        </div>
        {conversation.selectionRequired && (
          <p role="status" className="text-muted-foreground">
            Available providers changed.{" "}
            {conversation.config.providers.length
              ? "Choose an available provider before sending."
              : "No model is connected."}
            {!conversation.config.providers.length && (
              <Button variant="outline" onClick={conversation.chooseRecorded}>
                Use recorded demo
              </Button>
            )}
          </p>
        )}
        {conversation.refreshing && (
          <p role="status" className="text-muted-foreground">
            Checking available providers…
          </p>
        )}
        {conversation.expired && (
          <p role="alert">
            Your session ended. The conversation has been cleared.{" "}
            <a
              ref={conversation.signIn}
              className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
              href="/auth/v2/login?redirect=%2Fdashboard%2Fassistant"
            >
              Sign in to continue
            </a>
            .
          </p>
        )}
        {conversation.contextNotice && (
          <p role="status" className="text-muted-foreground">
            Older complete exchanges were left out to fit the context limit. They remain visible here.
          </p>
        )}
        <div className="min-w-0 flex-1 space-y-6">
          {turns.length === 0 ? (
            <section className="space-y-4 py-6">
              <h2 className="text-lg font-medium">Try an example</h2>
              <p className="text-muted-foreground max-w-prose">
                {selected
                  ? "Ask a question or use an illustrative example. The Assistant cannot read or change your workspace."
                  : "These recorded replies use illustrative data. They cannot read or change your workspace."}
              </p>
              <div className="flex flex-col items-start gap-2">
                {examples.map((example) => (
                  <Button
                    key={example.id}
                    disabled={conversation.blocked}
                    variant="outline"
                    onClick={() => void send(example.prompt)}
                  >
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
                  <p className="text-muted-foreground text-xs">
                    {turn.attribution} · {turn.status}
                  </p>
                  {turn.status !== "error" && (turn.text || turn.status === "streaming") && (
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
                    <p role="alert" className="text-danger">
                      {failureCopy[turn.error ?? "unavailable"]}
                    </p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
        {turns.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" disabled={conversation.blocked} onClick={conversation.regenerate}>
              <RotateCcw />
              Regenerate
            </Button>
            <p className="text-muted-foreground text-xs">
              Replaces the latest reply. Stopped and failed replies are not reused.
            </p>
          </div>
        )}
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
            disabled={conversation.expired}
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
            <div className="flex flex-wrap items-center gap-2">
              <p role="alert" className="text-danger">
                {error}
              </p>
              <Button type="button" variant="outline" onClick={() => clear()}>
                New conversation
              </Button>
            </div>
          )}
          {conversation.remaining > 0 && (
            <p className="text-muted-foreground text-xs">
              Try again in {conversation.remaining}s. No request will be sent automatically.
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">Conversation clears when you leave or reload.</p>
            {busy ? (
              <Button type="button" variant="outline" ref={conversation.stopButton} onClick={conversation.stop}>
                <Square />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!input.trim() || conversation.blocked}>
                <ArrowUp />
                Send
              </Button>
            )}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {busy
              ? selected
                ? "Preparing a reply."
                : "Preparing a recorded reply."
              : turns.length
                ? `Response ${turns.at(-1)?.status}.`
                : "Ready for a message."}
          </p>
        </form>
        <div ref={conversation.end} />
      </div>
    </div>
  );
}
