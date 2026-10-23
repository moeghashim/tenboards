import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../-components/dashboard/cards";

const metrics = [
  { label: "Unique Visitors", value: "213.1k", previous: "207.3k", trend: "+2.8%", positive: true },
  { label: "Sessions", value: "248.6k", previous: "243.5k", trend: "+2.1%", positive: true },
  { label: "Pageviews", value: "547.9k", previous: "566.8k", trend: "−3.3%", positive: false },
  { label: "Engagement Rate", value: "61.4%", previous: "58.9%", trend: "+4.2%", positive: true },
  { label: "Conversion Rate", value: "8.4%", previous: "8.9%", trend: "−5.6%", positive: false },
];
export function AnalyticsKpiStrip() {
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
