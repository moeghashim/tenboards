import { createContext, createElement, type ReactNode, useContext, useState } from "react";

import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

import type { MailData } from "@/server/data/mail.types";

import type { Mail } from "./data";

type Config = { selected: Mail["id"] | null };
type Store = { selection: Config; setSelection: (selection: Config) => void };
const StoreContext = createContext<StoreApi<Store> | null>(null);
const DataContext = createContext<MailData | null>(null);
export function MailProvider({ data, children }: { data: MailData; children: ReactNode }) {
  const [store] = useState(() =>
    createStore<Store>((set) => ({
      selection: { selected: data.mails[0]?.id ?? null },
      setSelection: (selection) => set({ selection }),
    })),
  );
  return createElement(DataContext, { value: data }, createElement(StoreContext, { value: store }, children));
}
export function useMailData() {
  const data = useContext(DataContext);
  if (!data) throw new Error("Missing mail data");
  return data;
}
export function useMail() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Missing mail store");
  const selection = useStore(store, (s) => s.selection);
  const setSelection = useStore(store, (s) => s.setSelection);
  const data = useMailData();
  const safeSelection =
    selection.selected === null || data.mails.some((row) => row.id === selection.selected)
      ? selection
      : { selected: null };
  return [safeSelection, setSelection] as const;
}
