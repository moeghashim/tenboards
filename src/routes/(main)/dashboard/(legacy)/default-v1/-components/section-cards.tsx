import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function SectionCards() {
  const summary = useDashboardData().sectionCardsSummary[0];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value={summary.value1}
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp />
            {summary.value2}
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
        value={summary.value3}
        trend={
          <Badge variant="outline" className="text-danger bg-danger-surface border-transparent">
            <TrendingDown />
            {summary.value4}
          </Badge>
        }
        help={
          <>
            <p className="text-foreground font-medium">{summary.value5}</p>
            <p>Acquisition needs attention</p>
          </>
        }
      />
      <StatCard
        label="Active Accounts"
        value={summary.value6}
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp />
            {summary.value7}
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
        value={summary.value8}
        trend={
          <Badge variant="outline" className="text-success bg-success-surface border-transparent">
            <TrendingUp />
            {summary.value9}
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
