import { createContext, type ReactNode, useContext } from "react";

import type { LogisticsData } from "@/server/data/logistics.types";

const Context = createContext<LogisticsData | null>(null);
export function DataProvider({ data, children }: { data: LogisticsData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return data;
}
