import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../-components/dashboard/cards";

const metrics = [
  { label: "Net worth", value: "$128.4K", help: "+$9.8K vs last month", trend: "+8.4%", positive: true },
  { label: "Available cash", value: "$12.8K", help: "$410 above your 30-day average", trend: "+3.2%", positive: true },
  { label: "Monthly spend", value: "$2,140", help: "$124 more than last month", trend: "+6.1%", positive: false },
  { label: "Savings rate", value: "28%", help: "Up from 25.6% last month", trend: "+2.4%", positive: true },
];
export function OverviewKpis() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          help={metric.help}
          trend={
            <Badge className={metric.positive ? "bg-success-surface text-success" : "bg-danger-surface text-danger"}>
              {metric.trend}
            </Badge>
          }
        />
      ))}
    </div>
  );
}
