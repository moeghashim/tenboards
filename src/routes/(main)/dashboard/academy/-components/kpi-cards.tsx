import { StatCard } from "@/components/blocks";

import { useDashboardData } from "./data-context";

export function KpiCards() {
  const metrics = useDashboardData().kpis;
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
