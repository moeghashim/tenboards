import { cn } from "cn";
import { Clock } from "lucide-react";
import { Funnel, FunnelChart, LabelList } from "recharts";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DashboardChart, useChartMotion } from "@/lib/charts/theme";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { actionItems, regionSalesData, salesPipelineChartConfig, salesPipelineChartData } from "./crm.config";

export function OperationalCards() {
  const totalSales = regionSalesData.reduce((sum, region) => sum + region.sales, 0);
  const motion = useChartMotion();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card>
        <SectionHeader title="Sales Pipeline" />

        <CardContent className="flex min-w-0 items-center gap-3">
          <DashboardChart config={salesPipelineChartConfig} className="h-56 sm:h-56">
            <FunnelChart margin={{ left: 0, right: 130, top: 0, bottom: 0 }}>
              <Funnel
                {...motion}
                className="stroke-card stroke-2"
                dataKey="value"
                data={salesPipelineChartData.map((stage) => ({ ...stage, fill: "var(--chart-1)" }))}
              >
                <LabelList
                  dataKey="stage"
                  position="right"
                  content={({ x, y, width, height, index }) => {
                    const stage = salesPipelineChartData[Number(index)];
                    return (
                      <text
                        x={Number(x) + Number(width) + 8}
                        y={Number(y) + Number(height) / 2}
                        dominantBaseline="middle"
                        fill="var(--foreground)"
                        fontSize={12}
                      >
                        {stage.stage} · {stage.value}
                      </text>
                    );
                  }}
                />
              </Funnel>
            </FunnelChart>
          </DashboardChart>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">Leads increased by 18.2% since last month.</p>
        </CardFooter>
      </Card>

      <Card>
        <SectionHeader
          title="Sales by Region"
          description={
            <span className="font-medium tabular-nums">{formatCurrency(totalSales, { noDecimals: true })}</span>
          }
        />

        <CardContent>
          <div className="space-y-2.5">
            {regionSalesData.map((region) => (
              <div key={region.region} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(region.sales, { noDecimals: true })}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        region.isPositive ? "text-success" : "text-danger",
                      )}
                    >
                      {region.growth}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Progress value={region.percentage} />
                  <span className="text-muted-foreground text-xs font-medium tabular-nums">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground flex justify-between gap-1 text-xs">
            <span>{regionSalesData.length} regions tracked</span>
            <span>•</span>
            <span>{regionSalesData.filter((r) => r.isPositive).length} regions growing</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <SectionHeader title="Action Items" />

        <CardContent>
          <ul className="space-y-2.5">
            {actionItems.map((item) => (
              <li key={item.id} className="space-y-2 border-b py-3 first:pt-0 last:border-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Checkbox aria-label={item.title} defaultChecked={item.checked} />
                  <span className="text-sm font-medium">{item.title}</span>
                  <span
                    className={cn(
                      "w-fit rounded-md px-2 py-1 text-xs font-medium",
                      item.priority === "High" && "bg-danger-surface text-danger",
                      item.priority === "Medium" && "bg-warning-surface text-warning",
                      item.priority === "Low" && "bg-success-surface text-success",
                    )}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs font-medium">{item.desc}</div>
                <div className="flex items-center gap-1">
                  <Clock className="text-muted-foreground size-3" />
                  <span className="text-muted-foreground text-xs font-medium">{item.due}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
