import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DashboardCard as Card } from "../../-components/dashboard/cards";

export function ClassSchedule() {
  const today = "Friday, 23 October";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Class Schedule</CardTitle>
        <CardAction className="text-muted-foreground flex items-center gap-1 text-xs">
          View Full Schedule <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        <div className="divide-border flex flex-col divide-y">
          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[8rem_1fr] sm:items-center">
            <div className="flex gap-2">
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">08:00 - 08:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground text-sm leading-snug font-medium">Pure Mathematics</div>
              <div className="text-muted-foreground text-xs leading-snug">Grade 11A • Room 2.14</div>
            </div>

            <Badge
              variant="secondary"
              className="border-success/30 bg-success-surface text-success w-fit rounded-md text-xs sm:col-start-2"
            >
              In Progress
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[8rem_1fr] sm:items-center">
            <div className="flex gap-2">
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">09:00 - 09:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground text-sm leading-snug font-medium">English Literature</div>
              <div className="text-muted-foreground text-xs leading-snug">Grade 11B • Seminar Room 3</div>
            </div>

            <Badge
              variant="secondary"
              className="border-warning/30 bg-warning-surface text-warning w-fit rounded-md text-xs sm:col-start-2"
            >
              Upcoming
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[8rem_1fr] sm:items-center">
            <div className="flex gap-2">
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">10:00 - 10:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground text-sm leading-snug font-medium">Physics</div>
              <div className="text-muted-foreground text-xs leading-snug">Grade 11C • Physics Lab</div>
            </div>

            <Badge
              variant="secondary"
              className="border-warning/30 bg-warning-surface text-warning w-fit rounded-md text-xs sm:col-start-2"
            >
              Upcoming
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[8rem_1fr] sm:items-center">
            <div className="flex gap-2">
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">11:00 - 11:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground text-sm leading-snug font-medium">Modern European History</div>
              <div className="text-muted-foreground text-xs leading-snug">Grade 11A • Room 1.08</div>
            </div>

            <Badge
              variant="secondary"
              className="border-danger/30 bg-danger-surface text-danger w-fit rounded-md text-xs sm:col-start-2"
            >
              Cancelled
            </Badge>
          </div>

          <div className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[8rem_1fr] sm:items-center">
            <div className="flex gap-2">
              <div className="text-xs text-nowrap">
                <div className="text-foreground font-medium">12:00 - 12:45</div>
                <div className="text-muted-foreground">{today}</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="text-foreground text-sm leading-snug font-medium">Computer Science</div>
              <div className="text-muted-foreground text-xs leading-snug">Grade 11B • Computing Lab</div>
            </div>

            <Badge
              variant="secondary"
              className="border-warning/30 bg-warning-surface text-warning w-fit rounded-md text-xs sm:col-start-2"
            >
              Upcoming
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
