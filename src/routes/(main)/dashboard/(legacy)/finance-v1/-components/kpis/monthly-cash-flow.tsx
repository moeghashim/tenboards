import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../../-components/dashboard/cards";
import { useDashboardData } from "../data-context";
export function MonthlyCashFlow() {
  const summary = useDashboardData().kpisMonthlyCashFlowSummary[0];

  return (
    <StatCard
      label="Monthly Cash Flow"
      value={summary.value1}
      help="This month · Net"
      trend={<Badge className="bg-success-surface text-success">{summary.value2}</Badge>}
    />
  );
}
