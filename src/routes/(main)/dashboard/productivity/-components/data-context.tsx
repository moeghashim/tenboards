import { createContext, type ReactNode, useContext } from "react";

import type { ProductivityData } from "@/server/data/productivity.types";

const Context = createContext<ProductivityData | null>(null);
export function DataProvider({ data, children }: { data: ProductivityData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return data;
}
