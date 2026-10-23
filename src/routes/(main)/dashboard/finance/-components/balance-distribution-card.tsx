import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardChart, DashboardTooltip, useChartMotion } from "@/lib/charts/theme";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

type BalanceKey = "investment" | "main" | "reserve" | "savings";

const chartConfig = {
  amount: {
    label: "Balance",
  },
  investment: {
    color: "var(--chart-1)",
    label: "Investment Account",
  },
  main: {
    color: "var(--chart-2)",
    label: "Main Wallet",
  },
  reserve: {
    color: "var(--chart-5)",
    label: "Reserve Account",
  },
  savings: {
    color: "var(--chart-4)",
    label: "Savings Account",
  },
} satisfies ChartConfig;

const currencies = {
  EUR: {
    label: "Euro Balance",
  },
  GBP: {
    label: "GBP Balance",
  },
  USD: {
    label: "USD Balance",
  },
} as const;

type Currency = keyof typeof currencies;

const currencyItems = Object.entries(currencies).map(([value, item]) => ({
  value,
  label: item.label,
}));

const getAccountColor = (key: BalanceKey) => {
  const config = chartConfig[key];

  return "color" in config ? config.color : undefined;
};

export function BalanceDistributionCard() {
  const balanceData = useDashboardData().balanceDistributionCardBalanceData;
  const chartData = balanceData.map((item) => ({
    ...item,
    fill: getAccountColor(item.key as BalanceKey),
  }));
  const totalBalance = balanceData.reduce((total, item) => total + item.amount, 0);

  const motion = useChartMotion();
  const [currency, setCurrency] = React.useState<Currency>("USD");

  return (
    <Card className="h-full">
      <SectionHeader
        title="Account Allocation"
        actions={
          <Select items={currencyItems} onValueChange={(value) => setCurrency(value as Currency)} value={currency}>
            <SelectTrigger aria-label="Account currency" className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencyItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />

      <CardContent className="grid items-center gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <DashboardChart config={chartConfig} className="mx-auto h-64 w-full sm:h-64">
          <PieChart>
            <ChartTooltip
              {...motion}
              cursor={false}
              content={
                <DashboardTooltip
                  hideLabel
                  className="w-52"
                  nameKey="account"
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-3">
                      <span>{name}</span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(Number(value), { currency, noDecimals: true })}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              {...motion}
              cornerRadius={6}
              data={chartData}
              dataKey="amount"
              innerRadius={52}
              nameKey="account"
              outerRadius={72}
              label={({ cx, cy, midAngle, outerRadius, index }) => {
                const item = chartData[index];
                const angle = (-Number(midAngle) * Math.PI) / 180;
                const x = Number(cx) + (Number(outerRadius) + 20) * Math.cos(angle);
                const y = Number(cy) + (Number(outerRadius) + 20) * Math.sin(angle);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="var(--foreground)"
                    fontSize={12}
                    textAnchor={x > Number(cx) ? "start" : "end"}
                  >
                    {item.account.split(" ")[0]}
                    <tspan x={x} dy={14}>
                      {item.percentage}%
                    </tspan>
                  </text>
                );
              }}
              labelLine={false}
              paddingAngle={2}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        Total
                      </tspan>
                      <tspan
                        className="fill-foreground font-heading text-lg font-medium tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
                        {formatCurrency(totalBalance, { currency, noDecimals: true })}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </DashboardChart>

        <div className="flex min-w-0 flex-col gap-3">
          {chartData.map((item) => (
            <div className="grid grid-cols-[1fr_auto] items-end gap-3" key={item.key}>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span aria-hidden="true" className="h-2 w-1 rounded-full" style={{ backgroundColor: item.fill }} />
                  <p className="text-muted-foreground truncate text-xs">{item.account}</p>
                </div>
                <p className="font-medium tabular-nums">
                  {formatCurrency(item.amount, { currency, noDecimals: true })}
                </p>
              </div>
              <div className="font-medium tabular-nums">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
