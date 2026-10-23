import { createContext, type ReactNode, useContext } from "react";

import type { InfrastructureData } from "@/server/data/infrastructure.types";

const Context = createContext<InfrastructureData | null>(null);
export function DataProvider({ data, children }: { data: InfrastructureData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return data;
}
