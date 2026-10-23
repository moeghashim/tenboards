import { createContext, type ReactNode, useContext } from "react";

import type { PatientsData } from "@/server/data/patients.types";

const Context = createContext<PatientsData | null>(null);
export function DataProvider({ data, children }: { data: PatientsData; children: ReactNode }) {
  return <Context value={data}>{children}</Context>;
}
export function useDashboardData() {
  const data = useContext(Context);
  if (!data) throw new Error("Missing dashboard data");
  return data;
}
