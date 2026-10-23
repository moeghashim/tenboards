import type { current, v1 } from "../db/fixtures/default.ts";
export type DefaultData = {
  current: typeof current;
  v1: typeof v1;
  variant: "current" | "v1";
  projection: {
    performance: ({ date: string } & (typeof current.performanceOverviewChartValues)[number])[];
    visitors: typeof v1.chartAreaInteractiveChartData;
  };
  renderedAt: string;
};
