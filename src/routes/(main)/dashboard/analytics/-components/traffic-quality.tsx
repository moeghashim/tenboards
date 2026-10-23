import { CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import {
  chartAxis,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  seriesConfig,
  useChartMotion,
} from "@/lib/charts/theme";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

const chartConfig = seriesConfig({ actualQuality: "Actual quality", baselineQuality: "Baseline quality" });

const weeklyTicks = [4, 11, 18, 25];

function formatWeek(value: number) {
  const weekIndex = weeklyTicks.indexOf(value);

  return weekIndex >= 0 ? `Week ${weekIndex + 1}` : "";
}

export function TrafficQuality() {
  const qualitySeries = useDashboardData().trafficQualityQualitySeries;
  const chartData = qualitySeries.map((item, index) => ({
    ...item,
    dayIndex: 1 + (index * 27) / (qualitySeries.length - 1),
  }));

  const motion = useChartMotion();
  return (
    <Card className="h-full">
      <SectionHeader title="Traffic Quality" />

      <CardContent>
        <DashboardChart config={chartConfig} className="h-72 w-full sm:h-80">
          <ComposedChart data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <CartesianGrid {...chartGrid} />
            <XAxis
              {...chartAxis}
              dataKey="dayIndex"
              axisLine={false}
              domain={[1, 28]}
              interval={0}
              tickFormatter={formatWeek}
              tickLine={false}
              tickMargin={14}
              ticks={weeklyTicks}
              type="number"
            />
            <YAxis
              {...chartAxis}
              axisLine={false}
              domain={[-6, 6]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              tickMargin={10}
              width={34}
            />
            <ChartTooltip
              {...motion}
              cursor={false}
              content={<DashboardTooltip className="w-40" labelFormatter={() => "Traffic quality"} />}
            />
            <Line
              {...motion}
              dataKey="baselineQuality"
              dot={false}
              stroke="var(--color-baselineQuality)"
              strokeOpacity={1}
              strokeDasharray={chartConfig.baselineQuality.strokeDasharray}
              strokeWidth={2}
              type="linear"
            />
            <Line
              {...motion}
              dataKey="actualQuality"
              dot={false}
              activeDot={{ r: 4 }}
              stroke="var(--color-actualQuality)"
              strokeWidth={2.5}
              type="linear"
            />
            <Legend content={<DashboardLegend config={chartConfig} />} />
          </ComposedChart>
        </DashboardChart>
      </CardContent>
    </Card>
  );
}
