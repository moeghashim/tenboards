import { createContext, useContext } from "react";

import type { InvoiceReferences } from "./data";
export const InvoiceContext = createContext<InvoiceReferences | null>(null);
export function useInvoiceReferences() {
  const data = useContext(InvoiceContext);
  if (!data) throw new Error("Invoice reference data is unavailable.");
  return data;
}
