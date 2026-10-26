import { format, parseISO } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import {
  chartAxis,
  chartCursor,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  SectionHeader,
  seriesConfig,
  useChartMotion,
} from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDashboardData } from "./data-context";

const chartConfig = seriesConfig({
  newCustomers: "New Customers",
  activeAccounts: "Active Accounts",
  returningUsers: "Returning Users",
});

const performancePeriodItems = [{ value: "quarter", label: "3 months" }] as const;

const performanceSegmentItems = [
  { value: "all", label: "All segments" },
  { value: "paid", label: "Paid" },
  { value: "organic", label: "Organic" },
] as const;

export function PerformanceOverview() {
  const data = useDashboardData();
  const chartData = data.projection.performance;

  const motion = useChartMotion();
  return (
    <Card className="@container/card">
      <SectionHeader
        title="Customer Activity"
        description={
          <>
            <span className="hidden @[540px]/card:block">Customer activity for the last 3 months</span>
            <span className="@[540px]/card:hidden">Last 3 months</span>
          </>
        }
        actions={
          <>
            <Select defaultValue="quarter" items={performancePeriodItems}>
              <SelectTrigger size="sm" className="w-28">
                <SelectValue placeholder="3 months" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Period</SelectLabel>
                  {performancePeriodItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select defaultValue="all" items={performanceSegmentItems}>
              <SelectTrigger size="sm" className="w-32">
                <SelectValue placeholder="All segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Segments</SelectLabel>
                  {performanceSegmentItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              View report
            </Button>
          </>
        }
      />

      <CardContent>
        <DashboardChart config={chartConfig}>
          <ComposedChart data={chartData} margin={{ top: 0 }}>
            <defs>
              <linearGradient id="fillNewCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.08} />
                <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartGrid} />

            <XAxis
              dataKey="date"
              {...chartAxis}
              minTickGap={48}
              tickFormatter={(value) =>
                parseISO(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              {...motion}
              cursor={chartCursor}
              content={
                <DashboardTooltip
                  className="w-50"
                  indicator="line"
                  labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")}
                />
              }
            />
            <ChartLegend
              itemSorter={null}
              verticalAlign="top"
              content={<DashboardLegend config={chartConfig} className="mb-5" />}
            />

            <Area
              {...motion}
              dataKey="newCustomers"
              type="natural"
              fill="url(#fillNewCustomers)"
              stroke="var(--color-newCustomers)"
              strokeWidth={2}
              dot={false}
              fillOpacity={1}
            />
            <Line
              {...motion}
              dataKey="activeAccounts"
              type="natural"
              stroke="var(--color-activeAccounts)"
              strokeWidth={2}
              strokeDasharray={chartConfig.activeAccounts.strokeDasharray}
              dot={false}
            />
            <Line
              {...motion}
              dataKey="returningUsers"
              type="natural"
              stroke="var(--color-returningUsers)"
              strokeWidth={2}
              strokeDasharray={chartConfig.returningUsers.strokeDasharray}
              dot={false}
            />
          </ComposedChart>
        </DashboardChart>
      </CardContent>
    </Card>
  );
}
