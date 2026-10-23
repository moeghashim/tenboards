import { createContext, type ReactNode, useContext } from "react";

import type { DefaultData } from "@/server/data/default.types";

const Context = createContext<DefaultData | null>(null);
export function DataProvider({ data, children }: { data: DefaultData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return { ...data.v1, renderedAt: data.renderedAt, projection: data.projection };
}
