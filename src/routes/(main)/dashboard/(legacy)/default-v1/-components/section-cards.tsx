import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../-components/dashboard/cards";

export function SectionCards() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value="$1,250.00"
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp />
            +12.5%
          </Badge>
        }
        help={
          <>
            <p className="text-foreground font-medium">Trending up this month</p>
            <p>Visitors for the last 6 months</p>
          </>
        }
      />
      <StatCard
        label="New Customers"
        value="1,234"
        trend={
          <Badge variant="outline" className="text-danger bg-danger-surface border-transparent">
            <TrendingDown />
            -20%
          </Badge>
        }
        help={
          <>
            <p className="text-foreground font-medium">Down 20% this period</p>
            <p>Acquisition needs attention</p>
          </>
        }
      />
      <StatCard
        label="Active Accounts"
        value="45,678"
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp />
            +12.5%
          </Badge>
        }
        help={
          <>
            <p className="text-foreground font-medium">Strong user retention</p>
            <p>Engagement exceed targets</p>
          </>
        }
      />
      <StatCard
        label="Growth Rate"
        value="4.5%"
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp />
            +4.5%
          </Badge>
        }
        help={
          <>
            <p className="text-foreground font-medium">Steady performance increase</p>
            <p>Meets growth projections</p>
          </>
        }
      />
    </div>
  );
}
