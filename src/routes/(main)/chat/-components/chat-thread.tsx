import { cn } from "cn";
import {
  AlarmClock,
  ArrowLeft,
  Copy,
  Flag,
  Link,
  MoreHorizontal,
  Paperclip,
  PhoneCall,
  Send,
  Smile,
  Sparkles,
  Tag,
  Type,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";

import type { Message as ChatMessage, Contact } from "./data";
import { useChatData } from "./use-chat";

interface ChatThreadProps {
  contact: Contact;
  messages: ChatMessage[];
  onOpenContact?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
  inert?: boolean;
}

export function ChatThread({
  contact,
  messages,
  onOpenContact,
  onBack,
  showBackButton,
  className,
  inert,
}: ChatThreadProps) {
  const { currentUser, display } = useChatData();
  return (
    <div inert={inert} aria-hidden={inert} className={cn("bg-card flex h-full flex-col py-3", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Back to conversations"
                onClick={onBack}
              >
                <ArrowLeft />
              </Button>
            )}
            <Avatar className="size-8">
              <AvatarFallback className="bg-background text-foreground">{getInitials(contact.name)}</AvatarFallback>
              <AvatarBadge className="bg-success">
                <span className="sr-only">Online</span>
              </AvatarBadge>
            </Avatar>
            <div className="min-w-0 wrap-break-word">
              <div className="text-sm font-medium">{contact.name}</div>
              <div className="text-muted-foreground text-xs leading-3">{contact.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Call" />}>
                <PhoneCall />
              </TooltipTrigger>
              <TooltipContent>Call</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Tag" />}>
                <Tag />
              </TooltipTrigger>
              <TooltipContent>Tag</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Snooze" />}>
                <AlarmClock />
              </TooltipTrigger>
              <TooltipContent>Snooze</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="More actions" data-contact-trigger />}
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={onOpenContact}>
                    <UserRound />
                    View profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy />
                    Copy email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag />
                    Mark priority
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">Block contact</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />
      </div>

      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-3 py-4">
              <Marker variant="separator">
                <MarkerContent>{display.threadDateLabel}</MarkerContent>
              </Marker>

              {messages.map((message) => {
                const isOutbound = message.align === "end";
                const reactionAlign = isOutbound ? "start" : "end";
                const senderName = isOutbound ? currentUser.name : contact.name;

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={String(message.id)}
                    scrollAnchor={message.align === "end"}
                  >
                    <Message align={message.align}>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarFallback
                            className={cn(
                              "bg-muted text-foreground text-xs",
                              isOutbound && "bg-primary text-primary-foreground",
                            )}
                          >
                            {getInitials(senderName)}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>

                      <MessageContent>
                        <BubbleGroup>
                          <Bubble variant={isOutbound ? "default" : "muted"} align={message.align}>
                            <BubbleContent>{message.text}</BubbleContent>
                            {message.reaction ? (
                              <BubbleReactions aria-label={`Reaction: ${message.reaction}`} align={reactionAlign}>
                                <span>{message.reaction}</span>
                              </BubbleReactions>
                            ) : null}
                          </Bubble>
                        </BubbleGroup>
                        <MessageFooter>
                          {senderName} · {message.time}
                        </MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <div className="px-2">
        <Tabs defaultValue="reply" className="gap-0 rounded-md border">
          <TabsList
            variant="line"
            className="w-full justify-start gap-2 border-b px-3 group-data-horizontal/tabs:h-10 **:data-[slot=tabs-trigger]:border-x-0 **:data-[slot=tabs-trigger]:px-6"
          >
            <TabsTrigger value="reply" className="flex-none px-1">
              Reply
            </TabsTrigger>
            <TabsTrigger value="note" className="flex-none px-1">
              Internal note
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reply" className="m-0">
            <MessageComposer placeholder="Type your message..." />
          </TabsContent>
          <TabsContent value="note" className="m-0">
            <MessageComposer placeholder="Write an internal note..." />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MessageComposer({ placeholder }: { placeholder: string }) {
  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <InputGroup className="border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot][aria-invalid=true]]:border-0 has-[[data-slot][aria-invalid=true]]:ring-0 dark:bg-transparent dark:has-[[data-slot][aria-invalid=true]]:ring-0">
        <InputGroupTextarea
          aria-label={placeholder}
          placeholder={placeholder}
          className="min-h-14 px-3 py-2.5 text-sm ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:aria-invalid:ring-0"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton aria-label="Format" type="button" size="icon-sm">
            <Type />
          </InputGroupButton>
          <InputGroupButton aria-label="Emoji" type="button" size="icon-sm">
            <Smile />
          </InputGroupButton>
          <InputGroupButton aria-label="Attach file" type="button" size="icon-sm">
            <Paperclip />
          </InputGroupButton>
          <InputGroupButton aria-label="Insert link" type="button" size="icon-sm">
            <Link />
          </InputGroupButton>
          <InputGroupButton aria-label="AI assist" type="button" size="icon-sm" variant="outline">
            <Sparkles />
          </InputGroupButton>
          <InputGroupButton type="submit" variant="default" size="icon-sm" className="ml-auto">
            <Send />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
