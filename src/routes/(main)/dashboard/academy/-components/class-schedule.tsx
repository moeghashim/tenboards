import { ArrowRight } from "lucide-react";

import { DashboardCard as Card } from "@/components/blocks";
import { Badge } from "@/components/ui/badge";
import { CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useDashboardData } from "./data-context";

const scheduleClasses: Record<string, string> = {
  "In Progress": "border-success/30 bg-success-surface text-success w-fit rounded-md text-xs sm:col-start-2",
  Upcoming: "border-warning/30 bg-warning-surface text-warning w-fit rounded-md text-xs sm:col-start-2",
  Cancelled: "border-danger/30 bg-danger-surface text-danger w-fit rounded-md text-xs sm:col-start-2",
};

export function ClassSchedule() {
  const schedule = useDashboardData().schedule;
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
          {schedule.map((item) => (
            <div
              key={item.id}
              className="bg-card hover:bg-muted/30 grid grid-cols-1 gap-3 py-3 transition-colors sm:grid-cols-[8rem_1fr] sm:items-center"
            >
              <div className="flex gap-2">
                <div className="text-xs text-nowrap">
                  <div className="text-foreground font-medium">{item.time}</div>
                  <div className="text-muted-foreground">{item.dateLabel}</div>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="text-foreground text-sm leading-snug font-medium">{item.subject}</div>
                <div className="text-muted-foreground text-xs leading-snug">{`${item.classLabel} • ${item.room}`}</div>
              </div>
              <Badge variant="secondary" className={scheduleClasses[item.status]}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
