import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../-components/dashboard/cards";

export function MetricCards() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value="$1,250.00"
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp className="size-3" />
            +12.5%
          </Badge>
        }
        help="Visitors for the last 6 months"
      />

      <StatCard
        label="New Customers"
        value="1,234"
        trend={
          <Badge variant="outline" className="text-danger bg-danger-surface border-transparent">
            <TrendingDown className="size-3" />
            -20%
          </Badge>
        }
        help="Acquisition needs attention"
      />

      <StatCard
        label="Active Accounts"
        value="45,678"
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp className="size-3" />
            +12.5%
          </Badge>
        }
        help="Engagement exceeds targets"
      />

      <StatCard
        label="Growth Rate"
        value="4.5%"
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp className="size-3" />
            +4.5%
          </Badge>
        }
        help="Meets growth projections"
      />
    </div>
  );
}
