import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { visitorRange } from "@/server/data/core-dates";

import { SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

const chartConfig = seriesConfig({ desktop: "Desktop", mobile: "Mobile" });

const timeRangeItems = [
  { value: "90d", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
] as const;

export function ChartAreaInteractive() {
  const chartData = useDashboardData().chartAreaInteractiveChartData;

  const isMobile = useIsMobile();
  const motion = useChartMotion();
  const [timeRange, setTimeRange] = React.useState("90d");

  const setTimeRangeFromGroup = (groupValue: string[]) => {
    const nextValue = groupValue[0];
    if (!nextValue) return;
    setTimeRange(nextValue);
  };

  const setTimeRangeFromSelect = (value: string | null) => {
    if (!value) return;
    setTimeRange(value);
  };

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const reference = useDashboardData().chartAreaInteractiveReference[0].date;
  const filteredData = visitorRange(chartData, reference, timeRange as "90d" | "30d" | "7d");

  return (
    <Card className="@container/card">
      <SectionHeader
        title="Total Visitors"
        description={
          <>
            <span className="hidden @[540px]/card:block">Total for the last 3 months</span>
            <span className="@[540px]/card:hidden">Last 3 months</span>
          </>
        }
        actions={
          <>
            <ToggleGroup
              value={[timeRange]}
              onValueChange={setTimeRangeFromGroup}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRangeFromSelect} items={timeRangeItems}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Visitor time range"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectGroup>
                  {timeRangeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="rounded-lg">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        }
      />
      <CardContent>
        <DashboardChart config={chartConfig}>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.08} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.08} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartGrid} />
            <XAxis
              dataKey="date"
              {...chartAxis}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={chartCursor}
              {...motion}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <DashboardTooltip
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              {...motion}
              strokeWidth={2}
              strokeDasharray={chartConfig.mobile.strokeDasharray}
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
            />
            <Area
              {...motion}
              strokeWidth={2}
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
            />
            <ChartLegend itemSorter={null} content={<DashboardLegend config={chartConfig} />} />
          </AreaChart>
        </DashboardChart>
      </CardContent>
    </Card>
  );
}
