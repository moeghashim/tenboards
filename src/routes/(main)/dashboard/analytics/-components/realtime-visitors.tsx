import { Bar, BarChart, type BarShapeProps, XAxis, YAxis } from "recharts";

import {
  DashboardCard as Card,
  chartAxis,
  DashboardChart,
  DashboardTooltip,
  SectionHeader,
  useChartMotion,
} from "@/components/blocks";
import { CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip } from "@/components/ui/chart";

import { useDashboardData } from "./data-context";

const chartConfig = {
  visitors: {
    color: "var(--chart-1)",
    label: "Visitors",
  },
} satisfies ChartConfig;

function RealtimeBarShape(props: BarShapeProps) {
  const { height, payload, width, x, y } = props;
  const barPayload = payload as { visitors: number } | undefined;
  const barHeightValue = Number(height);
  const barWidthValue = Number(width);
  const xValue = Number(x);
  const yValue = Number(y);
  const visitors = barPayload?.visitors ?? 0;
  const fill = "var(--color-visitors)";
  const fillOpacity = 1;
  const baselineFill = visitors === 0 ? "var(--text-muted)" : fill;
  const baselineOpacity = visitors === 0 ? 1 : fillOpacity;
  const baselineY = yValue + barHeightValue - 2;
  const barGap = 4;
  const barHeight = Math.max(0, barHeightValue - barGap);

  return (
    <g>
      <rect
        x={xValue}
        y={baselineY}
        width={barWidthValue}
        height={2}
        rx={1}
        fill={baselineFill}
        fillOpacity={baselineOpacity}
      />
      {visitors > 0 && barHeight > 0 ? (
        <rect
          x={xValue}
          y={yValue}
          width={barWidthValue}
          height={barHeight}
          rx={2}
          fill={fill}
          fillOpacity={fillOpacity}
        />
      ) : null}
    </g>
  );
}

export function RealtimeVisitors() {
  const summary = useDashboardData().realtimeVisitorsSummary[0];

  const realtimeData = useDashboardData().realtimeVisitorsRealtimeData;

  const motion = useChartMotion();
  return (
    <Card className="h-full">
      <SectionHeader title="Realtime Visitors" />

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl leading-none tracking-tight tabular-nums">{summary.value1}</span>
            <span className="text-muted-foreground text-sm">per minute</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="relative flex size-2">
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span>Live</span>
          </div>
        </div>
        <DashboardChart config={chartConfig} className="h-36 w-full sm:h-36">
          <BarChart data={realtimeData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }} barCategoryGap={3}>
            <XAxis {...chartAxis} dataKey="minute" hide />
            <YAxis {...chartAxis} hide domain={[0, 22]} />
            <ChartTooltip {...motion} cursor={false} content={<DashboardTooltip hideLabel />} />
            <Bar {...motion} dataKey="visitors" fill="var(--color-visitors)" shape={RealtimeBarShape} />
          </BarChart>
        </DashboardChart>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="border-border/50 flex items-center gap-3 sm:border-r border-b pt-1 pr-5 pb-4">
            <span
              aria-hidden="true"
              className="bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-xs font-medium"
            >
              US
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">United States</span>
            <span className="text-sm tabular-nums">{summary.value2}</span>
          </div>
          <div className="border-border/50 flex items-center gap-3 border-b pt-1 pb-4 sm:pl-5">
            <span
              aria-hidden="true"
              className="bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-xs font-medium"
            >
              GB
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">United Kingdom</span>
            <span className="text-sm tabular-nums">{summary.value3}</span>
          </div>
          <div className="border-border/50 flex items-center gap-3 sm:border-r pt-4 pr-5 pb-1">
            <span
              aria-hidden="true"
              className="bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-xs font-medium"
            >
              CA
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">Canada</span>
            <span className="text-sm tabular-nums">{summary.value4}</span>
          </div>
          <div className="flex items-center gap-3 pt-4 pb-1 sm:pl-5">
            <span
              aria-hidden="true"
              className="bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-xs font-medium"
            >
              IN
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">India</span>
            <span className="text-sm tabular-nums">{summary.value5}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
