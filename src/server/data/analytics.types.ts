import type { current, v1 } from "../db/fixtures/analytics.ts";
export type AnalyticsData = {
  current: typeof current;
  v1: typeof v1;
  variant: "current" | "v1";
  projection: { range: { from: string; to: string }; revenue: { day: string; revenue: number }[] };
  renderedAt: string;
};
