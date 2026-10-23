import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../../../-components/dashboard/cards";
export function NetWorth() {
  return (
    <StatCard
      label="Net Worth"
      value="$84,250"
      help="This month · Across all linked accounts"
      trend={<Badge className="bg-success-surface text-success">+$3,680 MoM</Badge>}
    />
  );
}
