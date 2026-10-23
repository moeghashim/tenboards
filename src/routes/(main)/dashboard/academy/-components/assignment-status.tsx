import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { chartAxis, chartGrid, DashboardChart, DashboardTooltip, useChartMotion } from "@/lib/charts/theme";

import { DashboardCard, SectionHeader } from "../../-components/dashboard/cards";

const chartData = [
  { className: "G11A", submitted: 14, pending: 18, overdue: 2 },
  { className: "G11B", submitted: 22, pending: 7, overdue: 3 },
  { className: "G11C", submitted: 10, pending: 19, overdue: 5 },
  { className: "G11D", submitted: 17, pending: 15, overdue: 6 },
  { className: "G11E", submitted: 24, pending: 4, overdue: 2 },
];

const config = {
  submitted: { label: "Submitted", color: "var(--success)" },
  pending: { label: "Pending", color: "var(--warning)" },
  overdue: { label: "Overdue", color: "var(--danger)" },
};
export function AssignmentStatus() {
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
