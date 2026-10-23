import { createContext, type ReactNode, useContext } from "react";

import type { CrmData } from "@/server/data/crm.types";

const Context = createContext<CrmData | null>(null);
export function DataProvider({ data, children }: { data: CrmData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return { ...data.v1, renderedAt: data.renderedAt, projection: data.projection };
}
