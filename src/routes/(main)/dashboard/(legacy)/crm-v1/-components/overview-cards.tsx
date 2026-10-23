import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { chartAxis, DashboardChart, DashboardTooltip, useChartMotion } from "@/lib/charts/theme";

import { DashboardCard as Card, SectionHeader, StatCard } from "../../../-components/dashboard/cards";
import { leadsChartConfig, proposalsChartConfig, revenueChartConfig } from "./crm.config";
import { useDashboardData } from "./data-context";

export function OverviewCards() {
  const lastMonth = useDashboardData().projection.previousMonth;
  const summary = useDashboardData().overviewCardsSummary[0];

  const leadsChartData = useDashboardData().crmConfigLeadsChartData;
  const proposalsChartData = useDashboardData().crmConfigProposalsChartData;
  const revenueChartData = useDashboardData().crmConfigRevenueChartData;

  const motion = useChartMotion();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <SectionHeader title="New Leads" description="Last Month" />
        <CardContent className="size-full">
          <DashboardChart className="h-32 sm:h-32" config={leadsChartConfig}>
            <BarChart accessibilityLayer data={leadsChartData} barSize={8}>
              <defs>
                <pattern id="crm-disqualified" width="5" height="5" patternUnits="userSpaceOnUse">
                  <rect width="5" height="5" fill="var(--card)" />
                  <path d="M0 0L5 5M-1 4L1 6M4 -1L6 1" stroke="var(--muted-foreground)" strokeWidth="2" />
                </pattern>
              </defs>
              <XAxis {...chartAxis} dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip
                {...motion}
                content={<DashboardTooltip labelFormatter={(label) => `${lastMonth}: ${label}`} />}
              />
              <Bar
                {...motion}
                background={{ fill: "var(--color-background)", radius: 4, opacity: 0.07 }}
                dataKey="newLeads"
                stackId="a"
                fill="var(--color-newLeads)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                {...motion}
                dataKey="disqualified"
                stackId="a"
                fill="url(#crm-disqualified)"
                stroke="var(--muted-foreground)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </DashboardChart>
        </CardContent>
        <p className="text-muted-foreground px-4 text-xs">Solid: new leads · Striped: disqualified</p>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xl font-semibold tabular-nums">{summary.value1}</span>
          <span className="text-success text-sm font-medium">{summary.value2}</span>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden pb-0">
        <SectionHeader title="Proposals Sent" description="Last Month" />
        <CardContent className="flex-1 p-0">
          <DashboardChart className="h-32 sm:h-32" config={proposalsChartConfig}>
            <AreaChart
              data={proposalsChartData}
              margin={{
                left: 0,
                right: 0,
                top: 5,
              }}
            >
              <XAxis {...chartAxis} dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip
                {...motion}
                content={<DashboardTooltip labelFormatter={(label) => `${lastMonth}: ${label}`} hideIndicator />}
              />
              <Area
                {...motion}
                dataKey="proposalsSent"
                fill="var(--color-proposalsSent)"
                fillOpacity={0.08}
                stroke="var(--color-proposalsSent)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </DashboardChart>
        </CardContent>
      </Card>

      <StatCard
        label="Revenue"
        value={summary.value3}
        help="Last 6 Months"
        trend={<Badge className="bg-success-surface text-success">{summary.value4}</Badge>}
      />
      <StatCard
        label="Projects Won"
        value={summary.value5}
        help="Last 6 Months"
        trend={<Badge className="bg-danger-surface text-danger">{summary.value6}</Badge>}
      />

      <Card className="col-span-1 xl:col-span-2">
        <SectionHeader title="Revenue Growth" description="Year to Date (YTD)" />
        <CardContent>
          <DashboardChart config={revenueChartConfig} className="h-32 w-full sm:h-32">
            <LineChart
              data={revenueChartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis {...chartAxis} dataKey="month" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip {...motion} content={<DashboardTooltip />} />
              <Line
                {...motion}
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </DashboardChart>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">{summary.value7}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
