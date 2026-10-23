import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../../-components/dashboard/cards";
import { useDashboardData } from "../data-context";
export function NetWorth() {
  const summary = useDashboardData().kpisNetWorthSummary[0];

  return (
    <StatCard
      label="Net Worth"
      value={summary.value1}
      help="This month · Across all linked accounts"
      trend={<Badge className="bg-success-surface text-success">{summary.value2}</Badge>}
    />
  );
}
