import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { SectionHeader, StatCard } from "../../-components/dashboard/cards";

const metrics = [
  { label: "Lead Pipeline Value", value: "$284,500", trend: "+12%", previous: "$254,200", positive: true },
  { label: "Qualified Lead Rate", value: "28.4%", trend: "-2.5%", previous: "30.9%", positive: false },
  { label: "Open Opportunities", value: "42", trend: "+7", previous: "35", positive: true },
  { label: "Lead-to-Deal Rate", value: "18.1%", trend: "+1.6%", previous: "16.5%", positive: true },
];

export function KpiCards() {
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
