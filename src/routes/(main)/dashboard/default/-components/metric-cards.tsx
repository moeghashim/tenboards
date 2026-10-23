import { DollarSign, TrendingDown, TrendingUp, UserPlus, Users, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { StatCard } from "../../-components/dashboard/cards";

export function MetricCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs xl:grid-cols-4">
      <StatCard
        label="Total Revenue"
        value="$1,250.00"
        icon={
          <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
            <DollarSign className="size-4" />
          </div>
        }
        trend={
          <Badge>
            <TrendingUp className="size-3" />
            +12.5%
          </Badge>
        }
        help="Visitors for the last 6 months"
      />

      <StatCard
        label="New Customers"
        value="1,234"
        icon={
          <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
            <UserPlus className="size-4" />
          </div>
        }
        trend={
          <Badge variant="destructive">
            <TrendingDown className="size-3" />
            -20%
          </Badge>
        }
        help="Acquisition needs attention"
      />

      <StatCard
        label="Active Accounts"
        value="45,678"
        icon={
          <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
            <Users className="size-4" />
          </div>
        }
        trend={
          <Badge>
            <TrendingUp className="size-3" />
            +12.5%
          </Badge>
        }
        help="Engagement exceeds targets"
      />

      <StatCard
        label="Growth Rate"
        value="4.5%"
        icon={
          <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
            <Waves className="size-4" />
          </div>
        }
        trend={
          <Badge>
            <TrendingUp className="size-3" />
            +4.5%
          </Badge>
        }
        help="Meets growth projections"
      />
    </div>
  );
}
