import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../../-components/dashboard/cards";
import { useDashboardData } from "../data-context";
export function SavingsRate() {
  const summary = useDashboardData().kpisSavingsRateSummary[0];

  return (
    <StatCard
      label="Savings Rate"
      value={summary.value1}
      help="This month · After expenses · Above your average"
      trend={<Badge className="bg-success-surface text-success">{summary.value2}</Badge>}
    />
  );
}
