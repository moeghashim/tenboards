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

const revenueBucketValues = [
  [4820, 5150, 5060, 5520, 5990, 6880],
  [5140, 5360, 5520, 5860, 6120, 6720],
  [4920, 4680, 5150, 5360, 5720, 6150],
  [5480, 5920, 5660, 6180, 6340, 6660],
  [5840, 6220, 6480, 6110, 6680, 7230],
  [6280, 6740, 6960, 7120, 6780, 7240],
  [6820, 7240, 7680, 7410, 7920, 7810],
  [6040, 6420, 6150, 6860, 7080, 7090],
  [5860, 6120, 6340, 6080, 6620, 6900],
  [6520, 6840, 7060, 7420, 7160, 8280],
  [6980, 7320, 7640, 7160, 8040, 8620],
  [6900, 7400, 8100, 8600, 8200, 9360],
] as const;

// A dated demo interval, independent of Worker startup time and browser timezone.
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
const revenueBucketRanges = ["01–05", "06–10", "11–15", "16–20", "21–25", "26–end"];
const profitMultipliers = [0.24, 0.28, 0.26];
const revenueOverviewData = revenueBucketValues.flatMap((values, monthIndex) =>
  values.map((revenue, index) => ({
    period: `${monthFormatter.format(new Date(Date.UTC(2025, 10 + monthIndex, 1)))} · ${revenueBucketRanges[index]}`,
    revenue,
    profit: Math.round(revenue * profitMultipliers[index % profitMultipliers.length]),
  })),
);
const config = seriesConfig({ revenue: "Revenue", profit: "Profit" });
const metrics = [
  { label: "Total Sales", value: "$48,560.00", change: "+15.8%", help: "vs last week", positive: true },
  { label: "Total Orders", value: "379", change: "+8.3%", help: "vs last week", positive: true },
  { label: "Customer Growth", value: "820", change: "+12.5%", help: "vs last month", positive: true },
  { label: "Average Order", value: "$128", change: "−$4.20", help: "vs last week", positive: false },
  { label: "Return Requests", value: "18", change: "+0.6%", help: "vs last month", positive: false },
  { label: "Stock Accuracy", value: "97%", change: "+2.4 pts", help: "vs last audit", positive: true },
];
export function KpiStrip() {
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
        <SectionHeader title="Sales Overview" description="Revenue and profit · USD · Nov 2025–Oct 2026" />
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
