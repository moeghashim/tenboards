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

const DAY_MS = 24 * 60 * 60 * 1000;
const weekStart = Date.UTC(2026, 0, 5);

const chartData = [
  { date: "2026-01-05T02:24:00Z", expense: 23, income: 38 },
  { date: "2026-01-05T08:24:00Z", expense: 32 },
  { date: "2026-01-05T14:52:48Z", expense: 26 },
  { date: "2026-01-05T21:07:12Z", expense: 39 },
  { date: "2026-01-06T03:36:00Z", expense: 37 },
  { date: "2026-01-06T10:04:48Z", expense: 52 },
  { date: "2026-01-06T16:19:12Z", expense: 15 },
  { date: "2026-01-06T22:04:48Z", expense: 36 },
  { date: "2026-01-07T03:50:24Z", expense: 31 },
  { date: "2026-01-07T09:36:00Z", expense: 45, income: 44 },
  { date: "2026-01-07T15:21:36Z", expense: 53 },
  { date: "2026-01-07T21:07:12Z", expense: 40 },
  { date: "2026-01-08T02:52:48Z", expense: 26 },
  { date: "2026-01-08T08:24:00Z", expense: 42 },
  { date: "2026-01-08T13:55:12Z", expense: 47 },
  { date: "2026-01-08T19:40:48Z", expense: 50 },
  { date: "2026-01-09T01:12:00Z", expense: 34 },
  { date: "2026-01-09T06:43:12Z", expense: 53 },
  { date: "2026-01-09T12:28:48Z", expense: 44 },
  { date: "2026-01-09T18:00:00Z", expense: 70 },
  { date: "2026-01-09T23:31:12Z", expense: 50 },
  { date: "2026-01-10T04:48:00Z", expense: 51 },
  { date: "2026-01-10T10:04:48Z", expense: 34, income: 54 },
  { date: "2026-01-10T15:21:36Z", expense: 39 },
  { date: "2026-01-10T20:38:24Z", expense: 30 },
  { date: "2026-01-11T01:55:12Z", expense: 50 },
  { date: "2026-01-11T07:12:00Z", expense: 48 },
  { date: "2026-01-11T12:28:48Z", expense: 67 },
  { date: "2026-01-11T17:45:36Z", expense: 33 },
  { date: "2026-01-11T22:04:48Z", expense: 53, income: 58 },
].map((item: { date: string; expense: number; income?: number }) => ({
  date: item.date,
  expense: item.expense,
  income: item.income,
  timestamp: Date.parse(item.date),
}));

const weekdayTicks = Array.from({ length: 7 }, (_, index) => weekStart + (index + 0.5) * DAY_MS);

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
});

const formatWeekday = (value: number) => weekdayFormatter.format(new Date(value));

const chartDomain = [weekStart, weekStart + 7 * DAY_MS];
const formatTooltipCurrency = (value: number | string) => formatCurrency(Number(value), { noDecimals: true });

const chartConfig = seriesConfig({ expense: "Expense", income: "Income" });

const transactionPeriodItems = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export function TransactionsOverviewCard() {
  const motion = useChartMotion();
  return (
    <Card>
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

      <CardContent>
        <DashboardChart config={chartConfig}>
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
