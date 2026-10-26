import { PackageCheck, PackageX, TriangleAlert } from "lucide-react";

import { DashboardCard as Card, DashboardChart, useChartMotion } from "@/components/blocks";
import { Label, Pie, PieChart } from "@/components/blocks/charts";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

import { useEcommerce } from "./ecommerce-context";

const chartConfig = {
  "in-stock": {
    label: "In stock",
    color: "var(--success)",
  },
  "low-stock": {
    label: "Low stock",
    color: "var(--warning)",
  },
  "out-of-stock": {
    label: "Out of stock",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function Inventory() {
  const { chartData } = useEcommerce();
  const totalUnits = chartData[0]["in-stock"] + chartData[0]["low-stock"] + chartData[0]["out-of-stock"];
  const availablePercent = Math.round((chartData[0]["in-stock"] / totalUnits) * 100);
  const gaugeSegmentCount = 32;
  const inStockSegments = Math.round((chartData[0]["in-stock"] / totalUnits) * gaugeSegmentCount);
  const lowStockSegments = Math.round((chartData[0]["low-stock"] / totalUnits) * gaugeSegmentCount);

  function getGaugeSegmentStatus(index: number) {
    if (index < inStockSegments) {
      return "in-stock";
    }

    if (index < inStockSegments + lowStockSegments) {
      return "low-stock";
    }

    return "out-of-stock";
  }

  const gaugeSegments = Array.from({ length: gaugeSegmentCount }, (_, index) => {
    const status = getGaugeSegmentStatus(index);
    return {
      fill: `var(--color-${status})`,
      id: `segment-${index + 1}`,
      status,
      value: 1,
    };
  });

  const inventorySummary = [
    {
      icon: PackageCheck,
      label: "In stock",
      value: chartData[0]["in-stock"],
    },
    {
      icon: TriangleAlert,
      label: "Low stock",
      value: chartData[0]["low-stock"],
    },
    {
      icon: PackageX,
      label: "Out of stock",
      value: chartData[0]["out-of-stock"],
    },
  ] as const;

  const motion = useChartMotion();
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-foreground text-sm font-medium">Inventory</CardTitle>
        <CardDescription className="text-foreground text-xl leading-none tracking-tight tabular-nums">
          {availablePercent}% available
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DashboardChart config={chartConfig} className="mx-auto h-40 w-full sm:h-40">
          <PieChart>
            <Pie
              {...motion}
              cx="50%"
              cy="72%"
              cornerRadius={6}
              data={gaugeSegments}
              dataKey="value"
              endAngle={0}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              startAngle={180}
              stroke="var(--card)"
              strokeWidth={1}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                        <tspan
                          className="fill-foreground text-2xl font-medium tabular-nums"
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                        >
                          {availablePercent}%
                        </tspan>
                        <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy || 0) + 38}>
                          Available
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </DashboardChart>
        <Separator />

        <div className="grid grid-cols-3 divide-x">
          {inventorySummary.map((item, _index) => (
            <div key={item.label} className="flex flex-col items-center gap-3 text-center">
              <div className="bg-muted grid size-9 place-items-center rounded-full">
                <item.icon className="text-muted-foreground size-4" />
              </div>
              <div>
                <div className="text-muted-foreground text-xs leading-none">{item.label}</div>
                <div className="text-sm font-medium tabular-nums">{item.value.toLocaleString("en-US")}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
