import { BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function FocusCard() {
  const focus = useDashboardData().focus;
  return (
    <Card>
      <SectionHeader title="Focus" />
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-3xl font-medium tracking-tight tabular-nums">{focus.duration}</div>
            <Button className="min-w-20" aria-label="Start focus session">
              Start
            </Button>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <BellOff className="size-3" />
            <span>{focus.state}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
