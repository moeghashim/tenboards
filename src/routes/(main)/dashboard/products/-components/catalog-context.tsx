import { createContext, useContext } from "react";

import type { CatalogData } from "./data";
export const CatalogContext = createContext<CatalogData | null>(null);
export function useCatalog() {
  const data = useContext(CatalogContext);
  if (!data) throw new Error("Catalog loader data is unavailable.");
  return data;
}
