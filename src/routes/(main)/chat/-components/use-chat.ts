import { createContext, createElement, type ReactNode, useContext, useState } from "react";

import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

import type { ChatData } from "@/server/data/chat.types";

import type { Conversation } from "./data";

type Config = { selected: Conversation["id"] | null };
type Store = { selection: Config; setSelection: (selection: Config) => void };
const StoreContext = createContext<StoreApi<Store> | null>(null);
const DataContext = createContext<ChatData | null>(null);
export function ChatProvider({ data, children }: { data: ChatData; children: ReactNode }) {
  const [store] = useState(() =>
    createStore<Store>((set) => ({
      selection: { selected: data.conversations[0]?.id ?? null },
      setSelection: (selection) => set({ selection }),
    })),
  );
  return createElement(DataContext, { value: data }, createElement(StoreContext, { value: store }, children));
}
export function useChatData() {
  const data = useContext(DataContext);
  if (!data) throw new Error("Missing chat data");
  return data;
}
export function useChat() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Missing chat store");
  const selection = useStore(store, (s) => s.selection);
  const setSelection = useStore(store, (s) => s.setSelection);
  const data = useChatData();
  const safeSelection =
    selection.selected === null || data.conversations.some((row) => row.id === selection.selected)
      ? selection
      : { selected: null };
  return [safeSelection, setSelection] as const;
}
