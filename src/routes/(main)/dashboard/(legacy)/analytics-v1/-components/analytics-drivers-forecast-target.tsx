import { Bar, CartesianGrid, ComposedChart, LabelList, Line, ReferenceLine, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { chartAxis, chartGrid, DashboardChart, DashboardTooltip, useChartMotion } from "@/lib/charts/theme";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";

const forecastChartConfig = {
  closedWon: {
    label: "Closed Won",
    color: "var(--chart-1)",
  },
  weightedPipeline: {
    label: "Weighted Pipeline",
    color: "var(--chart-2)",
  },
  target: {
    label: "Target",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

type TrendPoint = {
  period: string;
  closedWon: number;
  weightedPipeline: number;
  target: number;
  deltaLabel?: string;
};

const CHART_DATA: TrendPoint[] = [
  { period: "W1", closedWon: 68.6, weightedPipeline: 152.4, target: 100 },
  { period: "W2", closedWon: 87.1, weightedPipeline: 158.1, target: 100 },
  { period: "W3", closedWon: 77.1, weightedPipeline: 154.8, target: 100 },
  { period: "W4", closedWon: 94.3, weightedPipeline: 162.2, target: 100 },
  { period: "W5", closedWon: 80.6, weightedPipeline: 160.4, target: 100 },
  { period: "W6", closedWon: 100, weightedPipeline: 168.5, target: 100 },
  { period: "W7", closedWon: 87.5, weightedPipeline: 172.1, target: 100 },
  { period: "W8", closedWon: 95.8, weightedPipeline: 178.3, target: 100 },
  { period: "W9", closedWon: 100, weightedPipeline: 181.0, target: 100 },
  { period: "W10", closedWon: 95.9, weightedPipeline: 185.4, target: 100 },
  { period: "W11", closedWon: 104.1, weightedPipeline: 188.7, target: 100 },
  { period: "W12", closedWon: 109.5, weightedPipeline: 192.1, target: 100, deltaLabel: "+9.5pp" },
];

export function DriversForecastTarget() {
  const motion = useChartMotion();
  const chartData = CHART_DATA;

  return (
    <Card>
      <SectionHeader title="Forecast vs Target" description="12-week trend with attainment context" />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricChip label="Attainment" value="72.4%" note="closed won / monthly target" />
          <MetricChip label="Weighted Pipeline" value="$1,284,000" note="vs $668,000 remaining" />
          <MetricChip label="Forecast Confidence" value="81.0%" note="volatility-adjusted confidence" />
        </div>
        <DashboardChart config={forecastChartConfig} className="h-72 w-full sm:h-80">
          <ComposedChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid {...chartGrid} />
            <XAxis {...chartAxis} dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis
              {...chartAxis}
              tickFormatter={(value) => `${Math.round(value)}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              domain={[0, "auto"]}
              ticks={[0, 50, 100, 150, 200]}
            />
            <ChartTooltip
              {...motion}
              cursor={false}
              content={(props) => (
                <DashboardTooltip
                  active={props.active}
                  label={props.label}
                  className="w-48"
                  payload={(props.payload ?? []).map((item) => ({
                    ...item,
                    value: typeof item.value === "number" ? `${item.value.toFixed(1)}%` : item.value,
                  }))}
                />
              )}
            />
            <ReferenceLine y={100} stroke="var(--color-target)" strokeWidth={2} strokeDasharray="6 5" />
            <Bar
              {...motion}
              dataKey="closedWon"
              name="Closed won"
              fill="var(--color-closedWon)"
              fillOpacity={1}
              stroke="var(--color-closedWon)"
              strokeOpacity={1}
              radius={[5, 5, 0, 0]}
              barSize={14}
            >
              <LabelList dataKey="deltaLabel" position="top" offset={8} fill="var(--color-closedWon)" />
            </Bar>
            <Line
              {...motion}
              type="monotone"
              dataKey="weightedPipeline"
              name="Pipeline vs target"
              strokeWidth={2}
              stroke="var(--color-weightedPipeline)"
              strokeDasharray="2 3"
              dot={{ r: 3, fill: "var(--color-weightedPipeline)" }}
              activeDot={false}
            />
          </ComposedChart>
        </DashboardChart>
        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>Solid bars: Closed won</span>
          <span>Dotted line: Pipeline vs target</span>
          <span>Dashed line: 100% target</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricChip({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-muted rounded-md border px-3 py-2.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{note}</p>
    </div>
  );
}
