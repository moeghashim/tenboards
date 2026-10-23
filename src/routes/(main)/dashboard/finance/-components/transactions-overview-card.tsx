import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  chartAxis,
  chartCursor,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  seriesConfig,
  useChartMotion,
} from "@/lib/charts/theme";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

const DAY_MS = 24 * 60 * 60 * 1000;

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
});

const formatWeekday = (value: number) => weekdayFormatter.format(new Date(value));

const formatTooltipCurrency = (value: number | string) => formatCurrency(Number(value), { noDecimals: true });

const chartConfig = seriesConfig({ expense: "Expense", income: "Income" });

const transactionPeriodItems = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export function TransactionsOverviewCard() {
  const chartData = useDashboardData().transactionsOverviewCardChartData;
  const first = new Date(chartData[0]?.date ?? 0);
  const weekStart = Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), first.getUTCDate());
  const weekdayTicks = Array.from({ length: 7 }, (_, index) => weekStart + (index + 0.5) * DAY_MS);
  const chartDomain = [weekStart, weekStart + 7 * DAY_MS];

  const motion = useChartMotion();
  return (
    <Card className="h-full">
      <SectionHeader
        title="Spending Overview"
        actions={
          <Select defaultValue="weekly" items={transactionPeriodItems}>
            <SelectTrigger aria-label="Spending period" className="w-28" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {transactionPeriodItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />

      <CardContent className="flex min-h-0 flex-1">
        <DashboardChart config={chartConfig} className="h-auto min-h-64 flex-1 sm:h-auto sm:min-h-80">
          <LineChart accessibilityLayer data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <Legend content={<DashboardLegend config={chartConfig} />} />
            <CartesianGrid {...chartGrid} />
            <XAxis
              {...chartAxis}
              axisLine={false}
              dataKey="timestamp"
              domain={chartDomain}
              scale="time"
              tickFormatter={formatWeekday}
              tickLine={false}
              tickMargin={10}
              ticks={weekdayTicks}
              tick={chartAxis.tick}
              type="number"
            />
            <YAxis {...chartAxis} hide axisLine={false} tickLine={false} tickMargin={10} tick={chartAxis.tick} />
            <ChartTooltip
              {...motion}
              cursor={chartCursor}
              content={({ active, payload, label }) => (
                <DashboardTooltip
                  active={active}
                  hideLabel
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: typeof item.value === "number" ? formatTooltipCurrency(item.value) : item.value,
                  }))}
                />
              )}
            />
            <Line
              {...motion}
              connectNulls
              dataKey="income"
              dot={false}
              stroke="var(--color-income)"
              strokeDasharray={chartConfig.income.strokeDasharray}
              strokeLinecap="round"
              strokeWidth={2}
              type="linear"
            />
            <Line
              {...motion}
              dataKey="expense"
              dot={false}
              stroke="var(--color-expense)"
              strokeLinecap="round"
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </DashboardChart>
      </CardContent>
    </Card>
  );
}
