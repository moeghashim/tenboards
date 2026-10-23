import type { Conversation } from "../../routes/(main)/chat/-components/data.ts";
export type ChatData = {
  conversations: Conversation[];
  currentUser: { name: string; email: string };
  counts: { id: string; label: string }[];
};
