import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  chartAxis,
  chartCursor,
  chartGrid,
  DashboardChart,
  DashboardTooltip,
  useChartMotion,
} from "@/lib/charts/theme";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";

const pipelineChartValues = [34, 38, 31, 47, 42, 51, 44, 40, 58, 46, 43, 49] as const;

const pipelineChartConfig = {
  qualified: {
    label: "Qualified",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const pipelineRangeItems = [
  { value: "last-30-days", label: "Last 30 days" },
  { value: "last-quarter", label: "Last quarter" },
  { value: "last-12-months", label: "Last 12 months" },
] as const;

const axisMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
const tooltipMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" });

function getRollingMonthData(values: readonly number[]) {
  return values.map((qualified, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (values.length - 1 - index));

    return {
      date: date.toISOString(),
      qualified,
    };
  });
}

export function PipelineActivity() {
  const motion = useChartMotion();
  const pipelineChartData = getRollingMonthData(pipelineChartValues);
  const totalQualified = pipelineChartData.reduce((sum, item) => sum + item.qualified, 0);
  const discoveryCallsBooked = 184;
  const discoveryProgress = Math.round((discoveryCallsBooked / totalQualified) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-12">
        <SectionHeader
          title="Qualified Lead Flow"
          actions={
            <Select defaultValue="last-12-months" items={pipelineRangeItems}>
              <SelectTrigger aria-label="Pipeline period" size="sm" className="min-w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {pipelineRangeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          }
        />

        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <DashboardChart config={pipelineChartConfig} className="lg:col-span-8">
              <BarChart data={pipelineChartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }} barSize={38}>
                <CartesianGrid {...chartGrid} />
                <XAxis
                  {...chartAxis}
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => axisMonthFormatter.format(new Date(String(value)))}
                />
                <YAxis hide />
                <ChartTooltip
                  {...motion}
                  cursor={chartCursor}
                  content={
                    <DashboardTooltip
                      hideIndicator
                      labelFormatter={(value) => tooltipMonthFormatter.format(new Date(String(value)))}
                    />
                  }
                />
                <Bar
                  {...motion}
                  dataKey="qualified"
                  fill="var(--color-qualified)"
                  radius={[3, 3, 0, 0]}
                  stroke="var(--color-qualified)"
                />
              </BarChart>
            </DashboardChart>

            <div className="flex flex-col gap-5 rounded-lg p-4 lg:col-span-4">
              <div className="flex flex-col gap-1">
                <div className="text-4xl leading-none font-medium tabular-nums">
                  {totalQualified} <span className="text-muted-foreground text-lg font-normal">leads</span>
                </div>
                <p className="text-muted-foreground text-sm">Total qualified leads captured over the last 12 months.</p>
              </div>

              <div className="flex flex-col gap-3 border-t pt-4">
                <div className="text-muted-foreground text-sm">Discovery Calls Booked</div>

                <div className="flex flex-col gap-1.5">
                  <div className="text-2xl leading-none font-medium tabular-nums">
                    {discoveryCallsBooked} <span className="text-muted-foreground text-sm font-normal">meetings</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {discoveryProgress}% of qualified leads booked a first call.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-0.5">
                  <Progress
                    value={discoveryProgress}
                    className="bg-muted *:data-[slot='progress-indicator']:bg-chart-2 h-2.5"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-medium tabular-nums">{discoveryCallsBooked} booked</div>
                    <div className="text-muted-foreground tabular-nums">{totalQualified} qualified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
