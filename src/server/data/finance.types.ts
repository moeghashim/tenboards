import type { current, v1 } from "../db/fixtures/finance.ts";
export type FinanceData = {
  current: typeof current;
  v1: typeof v1;
  variant: "current" | "v1";
  projection: { statementDate: string };
  renderedAt: string;
};
