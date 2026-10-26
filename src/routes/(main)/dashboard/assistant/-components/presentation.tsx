import type { ComponentProps, ReactNode, Ref } from "react";

import { ArrowUp, Bot, ChartNoAxesCombined, ClipboardList, Plus, Square, Table2 } from "lucide-react";

import { PageHeader } from "@/components/blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { examples } from "@/lib/assistant/recorded";

export function AssistantSurface({ clear, children }: { clear: () => void; children: ReactNode }) {
  return (
    <div
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col"
    >
      <div className="shrink-0 px-4 py-3 md:px-6">
        <PageHeader
          title="AI Assistant"
          className="flex-nowrap gap-2 [&>div:first-child]:basis-auto"
          actions={
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" onClick={clear}>
                    <Plus />
                    New conversation
                  </Button>
                }
              />
              <TooltipContent>Conversation clears when you leave or reload.</TooltipContent>
            </Tooltip>
          }
        />
      </div>
      {children}
    </div>
  );
}

const suggestions = [
  { icon: ClipboardList, title: "Summarize a sample launch", description: "See a snapshot and next steps." },
  { icon: Table2, title: "Compare sample plans", description: "Put sample options side by side." },
  { icon: ChartNoAxesCombined, title: "Chart a sample week", description: "Turn sample numbers into charts." },
];
export function Welcome({ send, disabled }: { send: (prompt: string) => void; disabled?: boolean }) {
  return (
    <section className="mx-auto my-auto w-full max-w-[600px] py-8">
      <div className="mb-7 text-center">
        <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-xl">
          <Bot className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-medium tracking-tight">What would you like to explore?</h2>
        <p className="text-muted-foreground mt-2 text-sm">Illustrative replies, with no access to your workspace.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {examples.map((example, index) => {
          const suggestion = suggestions[index];
          const Icon = suggestion.icon;
          return (
            <Button
              key={example.id}
              variant="outline"
              disabled={disabled}
              aria-label={example.label}
              className="bg-card h-auto min-w-0 flex-col items-start justify-start gap-2 rounded-xl p-4 text-left whitespace-normal last:col-span-2"
              onClick={() => send(example.prompt)}
            >
              <Icon className="text-muted-foreground mb-1 size-5" aria-hidden="true" />
              <span className="font-medium">{suggestion.title}</span>
              <span className="text-muted-foreground text-xs font-normal">{suggestion.description}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export function ConversationTurn({
  prompt,
  attribution,
  children,
}: {
  prompt: string;
  attribution: string;
  children: ReactNode;
}) {
  return (
    <article className="min-w-0 space-y-5">
      <div className="bg-muted ml-auto w-fit max-w-full rounded-xl px-4 py-3 sm:max-w-[85%]">
        <span className="sr-only">You: </span>
        <p className="whitespace-pre-wrap break-words">{prompt}</p>
      </div>
      <div className="min-w-0 space-y-3">
        <h2 className="sr-only">Assistant reply</h2>
        <div className="flex items-center gap-2">
          <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-lg">
            <Bot className="size-4" aria-hidden="true" />
          </span>
          <p className="text-muted-foreground text-xs">{attribution}</p>
        </div>
        <div className="min-w-0 space-y-3 sm:pl-9">{children}</div>
      </div>
    </article>
  );
}

export function RecordedPicker() {
  return (
    <Badge variant="secondary" className="text-muted-foreground font-normal">
      Recorded demo
    </Badge>
  );
}

export function Composer({
  input,
  setInput,
  send,
  stop,
  busy,
  blocked,
  disabled,
  composer,
  stopButton,
  toolbar,
  children,
}: {
  input: string;
  setInput: (value: string) => void;
  send: () => void;
  stop: () => void;
  busy: boolean;
  blocked?: boolean;
  disabled?: boolean;
  composer: Ref<HTMLTextAreaElement>;
  stopButton?: Ref<HTMLButtonElement>;
  toolbar?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <form
      className="bg-background shrink-0 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] md:px-6"
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
    >
      <div className="mx-auto w-full max-w-[752px] space-y-2">
        {children}
        <div className="border-input bg-card rounded-xl border p-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
          <label htmlFor="assistant-message" className="sr-only">
            Message
          </label>
          <Textarea
            ref={composer}
            id="assistant-message"
            rows={1}
            disabled={disabled}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question…"
            className="min-h-0 max-h-[calc(8lh+1rem)] resize-none rounded-none border-0 bg-transparent leading-6 shadow-none focus-visible:ring-0 focus-visible:!outline-none dark:bg-transparent"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                event.preventDefault();
                send();
              }
            }}
          />
          <div className="mt-2 flex min-w-0 items-center justify-between gap-2 px-1">
            <div className="min-w-0 flex-1">{toolbar ?? <RecordedPicker />}</div>
            {busy ? (
              <Button type="button" size="icon" variant="secondary" aria-label="Stop" ref={stopButton} onClick={stop}>
                <Square className="size-4 fill-current" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" size="icon" aria-label="Send" disabled={!input.trim() || blocked}>
                <ArrowUp aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export function ReplyAction({ label, children, ...props }: ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button {...props} type="button" variant="ghost" size="icon-sm" aria-label={label}>
            {children}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
