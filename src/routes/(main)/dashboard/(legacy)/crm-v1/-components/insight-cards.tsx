import { Bar, BarChart, CartesianGrid, Label, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { chartAxis, chartGrid, DashboardChart, DashboardTooltip, useChartMotion } from "@/lib/charts/theme";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { leadsBySourceChartConfig, projectRevenueChartConfig } from "./crm.config";
import { useDashboardData } from "./data-context";

export function InsightCards() {
  const summary = useDashboardData().insightCardsSummary[0];

  const leadsBySourceChartData = useDashboardData().crmConfigLeadsBySourceChartData.map((row, index) => ({
    ...row,
    ...[
      { fill: "var(--color-website)" },
      { fill: "var(--color-referral)" },
      { fill: "var(--color-social)" },
      { fill: "var(--color-cold)" },
      { fill: "var(--color-other)" },
    ][index],
  }));
  const projectRevenueChartData = useDashboardData().crmConfigProjectRevenueChartData;

  const totalLeads = leadsBySourceChartData.reduce((acc, curr) => acc + curr.leads, 0);

  const motion = useChartMotion();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card className="col-span-1 xl:col-span-2">
        <SectionHeader title="Leads by Source" />

        <CardContent className="flex flex-wrap items-center gap-4">
          <DashboardChart config={leadsBySourceChartConfig} className="mx-auto h-64 w-full shrink-0 sm:h-64">
            <PieChart
              className="m-0"
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <ChartTooltip {...motion} cursor={false} content={<DashboardTooltip hideLabel />} />
              <Pie
                {...motion}
                data={leadsBySourceChartData}
                dataKey="leads"
                nameKey="source"
                innerRadius={52}
                outerRadius={65}
                label={({ cx, cy, midAngle, outerRadius, index }) => {
                  const entry = leadsBySourceChartData[index];
                  const words = String(leadsBySourceChartConfig[entry.source].label).split(" ");
                  const angle = (-Number(midAngle) * Math.PI) / 180;
                  const x = Number(cx) + (Number(outerRadius) + 22) * Math.cos(angle);
                  const y = Number(cy) + (Number(outerRadius) + 22) * Math.sin(angle);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="var(--foreground)"
                      fontSize={12}
                      textAnchor={x > Number(cx) ? "start" : "end"}
                    >
                      <tspan x={x}>{words[0]}</tspan>
                      <tspan x={x} dy={14}>
                        {words.slice(1).join(" ")} {entry.leads}
                      </tspan>
                    </text>
                  );
                }}
                labelLine={{ stroke: "var(--muted-foreground)" }}
                paddingAngle={2}
                cornerRadius={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {totalLeads.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Leads
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </DashboardChart>

          <ul className="flex min-w-36 flex-1 flex-col gap-3">
            {leadsBySourceChartData.map((item) => (
              <li key={item.source} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs capitalize">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      background:
                        "color" in leadsBySourceChartConfig[item.source]
                          ? leadsBySourceChartConfig[item.source].color
                          : undefined,
                    }}
                  />
                  {leadsBySourceChartConfig[item.source].label}
                </span>
                <span className="text-xs tabular-nums">{item.leads}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" variant="outline" className="basis-1/2">
            View Full Report
          </Button>
          <Button size="sm" variant="outline" className="basis-1/2">
            Download CSV
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 xl:col-span-3">
        <SectionHeader title="Project Revenue vs. Target" />

        <CardContent className="min-w-0 overflow-x-auto">
          <DashboardChart config={projectRevenueChartConfig} className="h-64 min-w-[600px] sm:h-64">
            <BarChart accessibilityLayer data={projectRevenueChartData} layout="vertical">
              <CartesianGrid {...chartGrid} horizontal={false} vertical />
              <YAxis
                {...chartAxis}
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={130}
              />
              <XAxis {...chartAxis} type="number" />
              <ChartTooltip {...motion} cursor={false} content={<DashboardTooltip indicator="line" />} />
              <Bar {...motion} stackId="a" dataKey="actual" fill="var(--color-actual)">
                <LabelList
                  dataKey="actual"
                  position="insideRight"
                  offset={8}
                  className="fill-primary-foreground text-xs tabular-nums"
                />
              </Bar>
              <Bar
                {...motion}
                stackId="a"
                dataKey="remaining"
                fill="var(--color-remaining)"
                stroke="var(--border-strong)"
                radius={[0, 3, 3, 0]}
              >
                <LabelList
                  dataKey="remaining"
                  position="insideRight"
                  offset={8}
                  className="fill-foreground text-xs tabular-nums"
                />
              </Bar>
            </BarChart>
          </DashboardChart>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="text-muted-foreground text-xs">Solid: actual revenue · Outlined: remaining to target</p>
          <p className="text-muted-foreground text-xs">{summary.value1}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
