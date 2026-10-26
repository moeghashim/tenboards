import { StatCard } from "@/components/blocks";
import { Badge } from "@/components/ui/badge";

import { useDashboardData } from "./data-context";

export function AnalyticsKpiStrip() {
  const metrics = useDashboardData().analyticsKpiStripMetrics;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((m) => (
        <StatCard
          key={m.label}
          density="compact"
          label={m.label}
          value={m.value}
          help={`From ${m.previous} · last 4 weeks`}
          trend={
            <Badge className={m.positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}>{m.trend}</Badge>
          }
        />
      ))}
    </div>
  );
}
