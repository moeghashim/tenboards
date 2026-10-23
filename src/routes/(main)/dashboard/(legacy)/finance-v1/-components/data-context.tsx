import { createContext, type ReactNode, useContext } from "react";

import type { FinanceData } from "@/server/data/finance.types";

const Context = createContext<FinanceData | null>(null);
export function DataProvider({ data, children }: { data: FinanceData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return {
    ...data.v1,
    renderedAt: data.renderedAt,
    projection: data.projection,
    statementDate: data.current.statementReference[0].date,
  };
}
