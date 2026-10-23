import { addDays, format } from "date-fns";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { civilDate } from "@/server/data/core-dates";

import { DashboardCard as Card } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function UpcomingEvents() {
  const data = useDashboardData();
  const upcomingEvents = data.events;
  const today = civilDate(data.day.date);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Upcoming Events</CardTitle>
        <CardAction className="text-muted-foreground flex items-center gap-1 text-xs">
          View Calendar <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {upcomingEvents.map((event) => {
          const eventDate = addDays(today, event.dayOffset);

          return (
            <div key={event.title} className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 basis-48 items-center gap-3">
                <div className="size-11 shrink-0 overflow-hidden rounded-sm border">
                  <div className="bg-muted grid h-1/3 place-items-center border-b text-xs leading-snug font-medium uppercase">
                    {format(eventDate, "MMM")}
                  </div>
                  <div className="grid h-2/3 place-items-center text-lg leading-snug">{format(eventDate, "d")}</div>
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <div className="text-sm leading-snug font-medium">{event.title}</div>
                  <div className="text-muted-foreground text-xs leading-snug">{event.time}</div>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium">
                {event.type}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
