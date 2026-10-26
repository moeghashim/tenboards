import { StatCard } from "@/components/blocks";
import { Badge } from "@/components/ui/badge";

import { useDashboardData } from "./data-context";

export function OverviewKpis() {
  const metrics = useDashboardData().overviewKpisMetrics;

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
