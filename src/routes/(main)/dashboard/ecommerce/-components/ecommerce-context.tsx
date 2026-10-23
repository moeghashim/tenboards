import { createContext, useContext } from "react";

import type { EcommerceData } from "@/server/data/ecommerce.types";
export const EcommerceContext = createContext<EcommerceData | null>(null);
export function useEcommerce() {
  const data = useContext(EcommerceContext);
  if (!data) throw new Error("Store loader data is unavailable.");
  return data;
}
