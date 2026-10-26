import {
  chartAxis,
  chartGrid,
  DashboardCard,
  DashboardChart,
  DashboardTooltip,
  SectionHeader,
  useChartMotion,
} from "@/components/blocks";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "@/components/blocks/charts";
import { CardContent } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";

import { useDashboardData } from "./data-context";

const config = {
  submitted: { label: "Submitted", color: "var(--success)" },
  pending: { label: "Pending", color: "var(--warning)" },
  overdue: { label: "Overdue", color: "var(--danger)" },
};
export function AssignmentStatus() {
  const chartData = useDashboardData().assignments;
  const motion = useChartMotion();
  return (
    <DashboardCard className="h-full">
      <SectionHeader
        title="Assignment Status"
        description="Submission counts by class"
        actions={<span className="text-muted-foreground text-xs">View Report</span>}
      />
      <CardContent>
        <p className="text-muted-foreground mb-3 text-xs">Left to right: Submitted · Pending · Overdue</p>
        <DashboardChart config={config} className="h-64 sm:h-72">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid {...chartGrid} />
            <XAxis {...chartAxis} dataKey="className" />
            <YAxis {...chartAxis} width={28} allowDecimals={false} />
            <ChartTooltip {...motion} cursor={false} content={<DashboardTooltip />} />
            <Bar {...motion} dataKey="submitted" fill="var(--color-submitted)" radius={[2, 2, 0, 0]} />
            <Bar {...motion} dataKey="pending" fill="var(--color-pending)" radius={[2, 2, 0, 0]} />
            <Bar {...motion} dataKey="overdue" fill="var(--color-overdue)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </DashboardChart>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs tabular-nums">
            <caption className="sr-only">
              Assignment counts; bars are ordered submitted, pending, overdue within each class.
            </caption>
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-2 font-medium">Class</th>
                <th className="font-medium">Submitted</th>
                <th className="font-medium">Pending</th>
                <th className="font-medium">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.className} className="border-t">
                  <th className="py-2 font-medium">{row.className}</th>
                  <td>{row.submitted}</td>
                  <td>{row.pending}</td>
                  <td>{row.overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </DashboardCard>
  );
}
