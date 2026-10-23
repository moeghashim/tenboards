import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  chartAxis,
  chartCursor,
  chartGrid,
  DashboardChart,
  DashboardTooltip,
  useChartMotion,
} from "@/lib/charts/theme";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
} as ChartConfig;

const cashFlowPeriodItems = [
  { value: "this-month", label: "This Month" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "ytd", label: "Year to Date" },
  { value: "this-year", label: "This Year" },
] as const;

export function CashFlowOverview() {
  const chartData = useDashboardData().cashFlowOverviewChartData;

  const motion = useChartMotion();
  const totalIncome = chartData.reduce((acc, item) => acc + item.income, 0);
  const totalExpenses = chartData.reduce((acc, item) => acc + Math.abs(item.expenses), 0);
  return (
    <Card>
      <SectionHeader
        title="Cash Flow Overview"
        description="Monthly income and expenses with net cash impact."
        actions={
          <Select defaultValue="this-year" items={cashFlowPeriodItems}>
            <SelectTrigger aria-label="Cash flow period" size="sm" className="w-37">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {cashFlowPeriodItems.map((item) => (
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
        <Separator />
        <div className="flex items-start justify-between gap-2 py-5 md:items-stretch md:gap-0">
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="text-primary flex shrink-0 items-center justify-center">
              <ArrowDownLeft className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Income</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalIncome, { noDecimals: true })}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto! self-stretch" />
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="text-muted-foreground flex shrink-0 items-center justify-center">
              <ArrowUpRight className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Expenses</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalExpenses, { noDecimals: true })}</p>
            </div>
          </div>
        </div>
        <Separator />
        <DashboardChart config={chartConfig}>
          <BarChart
            stackOffset="sign"
            margin={{ left: -25, right: 0, top: 25, bottom: 0 }}
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid {...chartGrid} />
            <XAxis {...chartAxis} dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              {...chartAxis}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const abs = Math.abs(value);
                const formatted = abs >= 1000 ? `${abs / 1000}k` : `${abs}`;
                return value < 0 ? `-${formatted}` : formatted;
              }}
              ticks={[-8000, -4000, 0, 4000, 8000]}
            />
            <ChartTooltip
              {...motion}
              cursor={chartCursor}
              content={
                <DashboardTooltip
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-3">
                      <span>{name === "income" ? "Income" : "Expenses"}</span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(Number(value), { noDecimals: true })}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ReferenceLine y={0} stroke="var(--text-muted)" />
            <Bar {...motion} dataKey="income" stackId="a" fill={chartConfig.income.color} radius={[4, 4, 0, 0]} />
            <Bar {...motion} dataKey="expenses" stackId="a" fill={chartConfig.expenses.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </DashboardChart>
      </CardContent>
    </Card>
  );
}
