import { TrendingDown, TrendingUp } from "lucide-react";

import { SectionHeader, StatCard } from "@/components/blocks";
import { Badge } from "@/components/ui/badge";

import { useDashboardData } from "./data-context";

export function KpiCards() {
  const metrics = useDashboardData().kpiCardsMetrics;

  return (
    <section className="min-w-0 space-y-4">
      <SectionHeader
        title="Pipeline Overview"
        description="Keep tabs on lead quality, open opportunities, and conversion rates across the current sales cycle."
      />
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            level={3}
            label={metric.label}
            value={metric.value}
            trend={
              <Badge
                variant="outline"
                className={
                  metric.positive
                    ? "bg-success-surface text-success border-transparent"
                    : "bg-danger-surface text-danger border-transparent"
                }
              >
                {metric.positive ? <TrendingUp /> : <TrendingDown />}
                {metric.trend}
              </Badge>
            }
            help={
              <>
                <span className="text-foreground font-medium">{metric.previous}</span> last month
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}
