import { createContext, type ReactNode, useContext } from "react";

import type { AcademyData } from "@/server/data/academy.types";

const Context = createContext<AcademyData | null>(null);
export function DataProvider({ data, children }: { data: AcademyData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return data;
}
