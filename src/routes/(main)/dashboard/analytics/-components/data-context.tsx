import { createContext, type ReactNode, useContext } from "react";

import type { AnalyticsData } from "@/server/data/analytics.types";

const Context = createContext<AnalyticsData | null>(null);
export function DataProvider({ data, children }: { data: AnalyticsData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return { ...data.current, renderedAt: data.renderedAt };
}
