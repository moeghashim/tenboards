import { type CSSProperties, useEffect, useRef, useState } from "react";

import { cn } from "cn";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

import { ChatConversationList } from "./chat-conversation-list";
import { ChatProfileDetails } from "./chat-profile-details";
import { ChatThread } from "./chat-thread";
import type { Conversation } from "./data";
import { useChat } from "./use-chat";

interface ChatProps {
  conversations: Conversation[];
}

export function Chat({ conversations }: ChatProps) {
  const [chat] = useChat();
  const [showContact, setShowContact] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const selectedRow = useRef<HTMLElement | null>(null);
  const wasContactOpen = useRef(false);
  const wasThreadOpen = useRef(false);
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsWide(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && showThread && !wasThreadOpen.current) {
      requestAnimationFrame(() =>
        container.current?.querySelector<HTMLButtonElement>('[aria-label="Back to conversations"]')?.focus(),
      );
    } else if (isMobile && !showThread && wasThreadOpen.current) {
      requestAnimationFrame(() => selectedRow.current?.focus({ preventScroll: true }));
    }
    wasThreadOpen.current = showThread;
  }, [isMobile, showThread]);

  useEffect(() => {
    if (showContact && isWide)
      requestAnimationFrame(() =>
        container.current?.querySelector<HTMLButtonElement>("[data-profile-close]")?.focus({ preventScroll: true }),
      );
    else if (!showContact && wasContactOpen.current)
      requestAnimationFrame(() =>
        container.current?.querySelector<HTMLButtonElement>("[data-contact-trigger]")?.focus(),
      );
    wasContactOpen.current = showContact;
  }, [isWide, showContact]);

  useEffect(() => {
    const node = container.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (showContact && isWide) {
        setShowContact(false);
        event.preventDefault();
      } else if (isMobile && showThread && !showContact) {
        setShowThread(false);
        event.preventDefault();
      }
    };
    node?.addEventListener("keydown", onKeyDown);
    return () => node?.removeEventListener("keydown", onKeyDown);
  }, [isWide, isMobile, showContact, showThread]);

  const activeConversation = conversations.find((c) => c.id === chat.selected) ?? conversations[0];

  return (
    <>
      <div
        ref={container}
        className="grid h-[calc(100svh-var(--header-height))] min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden transition-[grid-template-columns] duration-200 ease-out *:min-h-0 *:min-w-0 md:grid-cols-[22.5rem_minmax(0,1fr)] md:*:first:border-r xl:grid-cols-[22.5rem_minmax(0,1fr)_var(--profile-width)]"
        style={
          {
            "--profile-width": showContact ? "20rem" : "0rem",
          } as CSSProperties
        }
      >
        <ChatConversationList
          conversations={conversations}
          inert={isMobile && showThread}
          className={cn(
            "transition-transform duration-200 ease-out will-change-transform max-md:col-start-1 max-md:row-start-1",
            showThread && "max-md:pointer-events-none max-md:-translate-x-full",
          )}
          onSelectConversation={() => {
            selectedRow.current = document.activeElement as HTMLElement;
            setShowThread(true);
          }}
        />
        <ChatThread
          inert={isMobile && !showThread}
          contact={activeConversation.contact}
          messages={activeConversation.messages}
          showBackButton={isMobile}
          onBack={() => setShowThread(false)}
          onOpenContact={() => setShowContact(true)}
          className={cn(
            "transition-transform duration-200 ease-out will-change-transform max-md:col-start-1 max-md:row-start-1",
            showThread ? "max-md:translate-x-0" : "max-md:pointer-events-none max-md:translate-x-full",
          )}
        />
        <div
          aria-hidden={!showContact || !isWide}
          inert={!showContact || !isWide}
          className={cn(
            "hidden overflow-hidden border-l transition-colors duration-200 xl:block",
            !showContact && "pointer-events-none border-l-transparent",
          )}
        >
          <div
            className={cn(
              "h-full w-80 transition-[opacity,transform] duration-200 ease-out",
              showContact ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            )}
          >
            <ChatProfileDetails contact={activeConversation.contact} onClose={() => setShowContact(false)} />
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: Sheet */}
      {!isWide && (
        <Sheet open={showContact} onOpenChange={setShowContact}>
          <SheetContent
            finalFocus={() => container.current?.querySelector<HTMLButtonElement>("[data-contact-trigger]") ?? false}
            side="right"
            className="w-80 p-0"
            showCloseButton={false}
          >
            <SheetTitle className="sr-only">Contact profile</SheetTitle>
            <SheetDescription className="sr-only">View contact details and activity</SheetDescription>
            <ChatProfileDetails contact={activeConversation.contact} onClose={() => setShowContact(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
