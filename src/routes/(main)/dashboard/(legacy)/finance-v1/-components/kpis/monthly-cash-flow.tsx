import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../../-components/dashboard/cards";
export function MonthlyCashFlow() {
  return (
    <StatCard
      label="Monthly Cash Flow"
      value="+$2,780"
      help="This month · Net"
      trend={<Badge className="bg-success-surface text-success">+4.1% MoM</Badge>}
    />
  );
}
