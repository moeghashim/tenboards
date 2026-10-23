import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../../-components/dashboard/cards";
export function SavingsRate() {
  return (
    <StatCard
      label="Savings Rate"
      value="32%"
      help="This month · After expenses · Above your average"
      trend={<Badge className="bg-success-surface text-success">+3.5% MoM</Badge>}
    />
  );
}
