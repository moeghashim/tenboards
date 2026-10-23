import { StatCard } from "../../-components/dashboard/cards";

const metrics = [
  { label: "Students Taught", value: "128", change: "+2.8%", help: "across 5 Grade 11 sections" },
  { label: "Avg. Attendance", value: "94.2%", change: "+1.1%", help: "vs last month" },
  { label: "Assignments", value: "81", change: null, help: "63 pending · 18 overdue" },
  { label: "Classes Today", value: "5", change: null, help: "1 in progress · 3 upcoming · 1 cancelled" },
];
export function KpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          density="compact"
          key={metric.label}
          label={metric.label}
          value={metric.value}
          help={metric.help}
          trend={metric.change && <span className="text-success text-xs">{metric.change}</span>}
        />
      ))}
    </div>
  );
}
