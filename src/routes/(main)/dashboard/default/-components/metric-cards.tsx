import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function MetricCards() {
  const summary = useDashboardData().metricCardsSummary[0];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value={summary.value1}
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp className="size-3" />
            {summary.value2}
          </Badge>
        }
        help="Visitors for the last 6 months"
      />

      <StatCard
        label="New Customers"
        value={summary.value3}
        trend={
          <Badge variant="outline" className="text-danger bg-danger-surface border-transparent">
            <TrendingDown className="size-3" />
            {summary.value4}
          </Badge>
        }
        help="Acquisition needs attention"
      />

      <StatCard
        label="Active Accounts"
        value={summary.value5}
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp className="size-3" />
            {summary.value6}
          </Badge>
        }
        help="Engagement exceeds targets"
      />

      <StatCard
        label="Growth Rate"
        value={summary.value7}
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp className="size-3" />
            {summary.value8}
          </Badge>
        }
        help="Meets growth projections"
      />
    </div>
  );
}
