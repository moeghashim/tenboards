import type { current, v1 } from "../db/fixtures/crm.ts";
export type CrmData = {
  current: typeof current;
  v1: typeof v1;
  variant: "current" | "v1";
  projection: { pipeline: { date: string; qualified: number }[]; previousMonth: string };
  renderedAt: string;
};
