import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";
import {
  chartAxis,
  chartCursor,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  formatCurrency,
  seriesConfig,
  useChartMotion,
} from "@/lib/charts/theme";

import { DashboardCard, SectionHeader, StatCard } from "../../-components/dashboard/cards";
import { useEcommerce } from "./ecommerce-context";

// A dated demo interval, independent of Worker startup time and browser timezone.

const config = seriesConfig({ revenue: "Revenue", profit: "Profit" });

export function KpiStrip() {
  const { metrics, revenueOverviewData, revenueCaption } = useEcommerce();
  const motion = useChartMotion();
  return (
    <div className="grid min-w-0 gap-4 xl:col-span-12 xl:grid-cols-12">
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:col-span-5">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            density="compact"
            label={metric.label}
            value={metric.value}
            help={
              <>
                <span className={metric.positive ? "text-success" : "text-danger"}>{metric.change}</span> {metric.help}
              </>
            }
          />
        ))}
      </div>
      <DashboardCard className="h-full xl:col-span-7">
        <SectionHeader title="Sales Overview" description={revenueCaption} />
        <CardContent>
          <DashboardChart config={config} className="h-72 sm:h-80">
            <ComposedChart accessibilityLayer data={revenueOverviewData} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid {...chartGrid} />
              <XAxis
                {...chartAxis}
                dataKey="period"
                interval={17}
                tickFormatter={(value: string) => value.split(" · ")[0]}
              />
              <YAxis {...chartAxis} width={46} tickFormatter={(value: number) => `$${value / 1000}k`} />
              <ChartTooltip
                {...motion}
                cursor={chartCursor}
                content={<DashboardTooltip formatter={(value) => formatCurrency(Number(value))} />}
              />
              <ChartLegend content={<DashboardLegend config={config} />} />
              <Bar {...motion} dataKey="profit" fill="var(--color-profit)" radius={[2, 2, 0, 0]} />
              <Line {...motion} dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </DashboardChart>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
