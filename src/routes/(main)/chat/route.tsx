import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Chat } from "./-components/chat";
import { ChatHeader } from "./-components/chat-header";
import { ChatSidebar } from "./-components/chat-sidebar";
import { ChatProvider } from "./-components/use-chat";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readChat } = await import("@/server/data/chat");
  return readChat();
});

export const Route = createFileRoute("/(main)/chat")({
  loader: () => loadData(),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  const conversations = data.conversations;
  return (
    <ChatProvider data={data}>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <ChatHeader />
          <div className="flex flex-1">
            <ChatSidebar />
            <Chat conversations={conversations} />
          </div>
        </SidebarProvider>
      </div>
    </ChatProvider>
  );
}
