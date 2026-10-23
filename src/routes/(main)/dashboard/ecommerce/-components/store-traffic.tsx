import { useState } from "react";

import { subMinutes } from "date-fns";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";
import {
  chartAxis,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  useChartMotion,
} from "@/lib/charts/theme";

import { DashboardCard as Card } from "../../-components/dashboard/cards";

const trafficIntervalMinutes = 15;

const trafficPoints = [
  { visitors: 280, anomalies: 8 },
  { visitors: 420, anomalies: 4 },
  { visitors: 360, anomalies: 3 },
  { visitors: 140, anomalies: 2 },
  { visitors: 80, anomalies: 1 },
  { visitors: 600, anomalies: 4 },
  { visitors: 260, anomalies: 3 },
  { visitors: 70, anomalies: 2 },
  { visitors: 90, anomalies: 1 },
  { visitors: 180, anomalies: 4 },
  { visitors: 150, anomalies: 3 },
  { visitors: 60, anomalies: 2 },
  { visitors: 430, anomalies: 1 },
  { visitors: 110, anomalies: 4 },
  { visitors: 260, anomalies: 3 },
  { visitors: 120, anomalies: 2 },
  { visitors: 90, anomalies: 1 },
  { visitors: 40, anomalies: 8 },
  { visitors: 75, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 15, anomalies: 1 },
  { visitors: 35, anomalies: 4 },
  { visitors: 60, anomalies: 3 },
  { visitors: 95, anomalies: 2 },
  { visitors: 105, anomalies: 1 },
  { visitors: 120, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 25, anomalies: 2 },
  { visitors: 70, anomalies: 1 },
  { visitors: 110, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 140, anomalies: 2 },
  { visitors: 310, anomalies: 1 },
  { visitors: 120, anomalies: 4 },
  { visitors: 160, anomalies: 8 },
  { visitors: 30, anomalies: 2 },
  { visitors: 20, anomalies: 1 },
  { visitors: 0, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 210, anomalies: 2 },
  { visitors: 110, anomalies: 1 },
  { visitors: 190, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 85, anomalies: 2 },
  { visitors: 250, anomalies: 1 },
  { visitors: 40, anomalies: 4 },
  { visitors: 110, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 140, anomalies: 1 },
  { visitors: 95, anomalies: 4 },
  { visitors: 180, anomalies: 3 },
  { visitors: 620, anomalies: 18 },
  { visitors: 35, anomalies: 1 },
  { visitors: 330, anomalies: 4 },
  { visitors: 45, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 160, anomalies: 1 },
  { visitors: 190, anomalies: 4 },
  { visitors: 260, anomalies: 3 },
  { visitors: 90, anomalies: 2 },
  { visitors: 70, anomalies: 1 },
  { visitors: 180, anomalies: 4 },
  { visitors: 150, anomalies: 3 },
  { visitors: 280, anomalies: 2 },
  { visitors: 160, anomalies: 1 },
  { visitors: 20, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 200, anomalies: 2 },
  { visitors: 45, anomalies: 8 },
  { visitors: 115, anomalies: 4 },
  { visitors: 145, anomalies: 3 },
  { visitors: 40, anomalies: 2 },
  { visitors: 160, anomalies: 1 },
  { visitors: 170, anomalies: 4 },
  { visitors: 95, anomalies: 3 },
  { visitors: 140, anomalies: 2 },
  { visitors: 70, anomalies: 1 },
  { visitors: 230, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 65, anomalies: 2 },
  { visitors: 35, anomalies: 1 },
  { visitors: 0, anomalies: 4 },
  { visitors: 80, anomalies: 3 },
  { visitors: 180, anomalies: 2 },
  { visitors: 95, anomalies: 1 },
  { visitors: 140, anomalies: 8 },
  { visitors: 270, anomalies: 3 },
  { visitors: 110, anomalies: 2 },
  { visitors: 50, anomalies: 1 },
  { visitors: 230, anomalies: 18 },
  { visitors: 115, anomalies: 3 },
  { visitors: 80, anomalies: 2 },
  { visitors: 260, anomalies: 1 },
  { visitors: 20, anomalies: 4 },
  { visitors: 120, anomalies: 3 },
  { visitors: 5, anomalies: 2 },
] as const;

function getTrafficData() {
  const now = new Date("2026-10-23T12:00:00Z");

  return trafficPoints.map((point, index) => ({
    ...point,
    timestamp: subMinutes(now, (trafficPoints.length - 1 - index) * trafficIntervalMinutes).toISOString(),
  }));
}

const trafficConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  anomalies: {
    label: "Anomalies",
    strokeDasharray: "6 3",
    color: "var(--destructive)",
  },
};

function formatTrafficTooltipLabel(value: string) {
  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value))} UTC`;
}

export function StoreTraffic() {
  const motion = useChartMotion();
  const [trafficData] = useState(() => getTrafficData());
  const firstTrafficTimestamp = trafficData[0].timestamp;
  const lastTrafficTimestamp = trafficData.at(-1)?.timestamp ?? "";

  function formatTrafficTick(value: string) {
    if (value === firstTrafficTimestamp) {
      return "Previous day";
    }

    return value === lastTrafficTimestamp ? "12:00 UTC" : "";
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-foreground text-sm font-medium">Store Traffic</CardTitle>
        <CardDescription className="text-foreground text-xl leading-none tracking-tight tabular-nums">
          12.9K visits
        </CardDescription>
      </CardHeader>

      <CardContent>
        <DashboardChart config={trafficConfig} className="h-64 w-full sm:h-64">
          <AreaChart accessibilityLayer data={trafficData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartGrid} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              tick={chartAxis.tick}
              tickFormatter={formatTrafficTick}
              tickLine={false}
              tickMargin={10}
              ticks={[trafficData[0].timestamp, trafficData.at(-1)?.timestamp ?? ""]}
            />
            <YAxis
              {...chartAxis}
              axisLine={false}
              domain={[0, 650]}
              tickLine={false}
              tickMargin={6}
              width={36}
              yAxisId="traffic"
            />
            <ChartTooltip
              {...motion}
              content={<DashboardTooltip labelFormatter={(value) => formatTrafficTooltipLabel(String(value))} />}
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            />
            <ChartLegend align="right" verticalAlign="top" content={<DashboardLegend config={trafficConfig} />} />
            <Area
              {...motion}
              dataKey="visitors"
              dot={false}
              fill="url(#fillVisitors)"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              type="stepAfter"
              yAxisId="traffic"
            />
            <Line
              {...motion}
              strokeDasharray="6 3"
              dataKey="anomalies"
              dot={false}
              stroke="var(--color-anomalies)"
              strokeLinecap="round"
              strokeWidth={2}
              type="stepAfter"
              yAxisId="traffic"
            />
          </AreaChart>
        </DashboardChart>
      </CardContent>
    </Card>
  );
}
