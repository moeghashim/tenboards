import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";

import {
  DashboardCard as Card,
  chartAxis,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  useChartMotion,
} from "@/components/blocks";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";

import { useEcommerce } from "./ecommerce-context";

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
  const { trafficData, summary } = useEcommerce();
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
          {`${summary.storeVisits / 1000}K visits`}
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
