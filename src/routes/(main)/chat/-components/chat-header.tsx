import { Bell, MessageSquarePlus, Search, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function ChatHeader() {
  return (
    <header className="bg-card sticky top-0 z-50 flex h-(--header-height) w-full items-center border-b">
      <div className="flex h-full w-full items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h1 className="shrink-0 text-sm font-medium whitespace-nowrap">tenboards Chat</h1>
          <InputGroup className="h-7 min-w-0 flex-1 sm:max-w-sm">
            <InputGroupInput
              aria-label="Search conversations"
              className="h-7 min-w-0"
              placeholder="Search conversations..."
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="New conversation">
            <MessageSquarePlus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Settings">
            <Settings />
          </Button>
        </div>
      </div>
    </header>
  );
}
