import { useRef, useState } from "react";

import { ArrowDown, Check, Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { AssistantConfig, ProviderId } from "@/lib/assistant/config";

import { failureCopy } from "./conversation";
import { AssistantSurface, Composer, ConversationTurn, RecordedPicker, ReplyAction, Welcome } from "./presentation";
import { SafeResponse } from "./safe-response";
import { useConversation } from "./use-conversation";

export function Assistant({ config }: { config: AssistantConfig }) {
  const conversation = useConversation(config);
  const { turns, input, setInput, error, busy, composer, selected, provider, send, clear } = conversation;
  const latestReply = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const latest = turns.at(-1);
  async function copy() {
    try {
      await navigator.clipboard.writeText(latestReply.current?.innerText ?? "");
      setCopyStatus("Reply copied.");
    } catch {
      setCopyStatus("Copy unavailable. Select the reply text to copy it.");
    }
  }
  return (
    <AssistantSurface
      clear={() => {
        clear();
        setCopyStatus("");
      }}
    >
      <div
        ref={conversation.transcript}
        onScroll={conversation.trackScroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 md:px-6"
        data-assistant-scroll
      >
        <div className="mx-auto flex min-h-full w-full max-w-[752px] flex-col gap-7 py-5">
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
          {turns.length === 0 ? <Welcome send={(prompt) => void send(prompt)} disabled={conversation.blocked} /> : null}
          <div
            role="log"
            aria-label="Conversation"
            aria-live="polite"
            aria-relevant="additions text"
            aria-busy={busy}
            className="min-w-0 space-y-7 empty:hidden"
          >
            {turns.map((turn) => (
              <ConversationTurn key={turn.id} prompt={turn.prompt} attribution={`${turn.attribution} · ${turn.status}`}>
                <div ref={turn.id === latest?.id ? latestReply : undefined} className="min-w-0 space-y-3">
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
                {turn.id === latest?.id && !busy && (
                  <div className="text-muted-foreground flex items-center gap-1">
                    <ReplyAction
                      label="Regenerate"
                      disabled={conversation.blocked}
                      onClick={() => {
                        setCopyStatus("");
                        conversation.regenerate();
                      }}
                    >
                      <RotateCcw aria-hidden="true" />
                    </ReplyAction>
                    {turn.status === "completed" && (
                      <ReplyAction label="Copy reply" onClick={() => void copy()}>
                        {copyStatus === "Reply copied." ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      </ReplyAction>
                    )}
                    <span role="status" className="text-xs">
                      {copyStatus}
                    </span>
                  </div>
                )}
              </ConversationTurn>
            ))}
          </div>
        </div>
      </div>
      {conversation.away && (
        <div className="relative z-10 h-0 shrink-0">
          <Button
            variant="outline"
            className="bg-card absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full shadow-sm"
            onClick={conversation.jumpToLatest}
          >
            <ArrowDown aria-hidden="true" />
            Jump to latest
          </Button>
        </div>
      )}
      <Composer
        input={input}
        setInput={setInput}
        send={() => {
          setCopyStatus("");
          void send();
        }}
        stop={conversation.stop}
        busy={busy}
        blocked={conversation.blocked}
        disabled={conversation.expired}
        composer={composer}
        stopButton={conversation.stopButton}
        toolbar={
          conversation.config.providers.length ? (
            <>
              <label htmlFor="assistant-provider" className="sr-only">
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
            <RecordedPicker />
          )
        }
      >
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
      </Composer>
      <p className="sr-only" role="status" aria-live="polite">
        {busy
          ? selected
            ? "Preparing a reply."
            : "Preparing a recorded reply."
          : turns.length
            ? `Response ${latest?.status}.`
            : "Ready for a message."}
      </p>
    </AssistantSurface>
  );
}
