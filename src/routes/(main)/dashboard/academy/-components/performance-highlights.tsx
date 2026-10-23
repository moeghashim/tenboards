import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { DashboardCard, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function PerformanceHighlights() {
  const performanceHighlights = useDashboardData().performance;
  return (
    <DashboardCard className="h-full">
      <SectionHeader
        title="Performance Highlights"
        actions={<span className="text-muted-foreground text-xs">View Insights</span>}
      />
      <CardContent className="flex flex-col gap-4">
        <div className="text-muted-foreground flex justify-between text-xs" aria-hidden="true">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        {performanceHighlights.map((row) => (
          <div key={row.className} className="space-y-2 border-t pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">
                <span className="text-muted-foreground mr-2">{row.className}</span>
                {row.subject}
              </div>
              <span className="font-medium tabular-nums">{row.score}%</span>
            </div>
            <div
              className="bg-muted h-2 rounded-sm"
              role="img"
              aria-label={`${row.className} weekly performance window; score ${row.score}%`}
            >
              <div
                className="bg-primary h-full rounded-sm"
                style={{ marginLeft: `${(row.start / 4) * 100}%`, width: `${(row.duration / 4) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {row.students.map((student) => (
                <Tooltip key={student.initials}>
                  <TooltipTrigger
                    type="button"
                    aria-label={student.name}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{student.name}</p>
                    <p>
                      {student.achievement} · {student.score}%
                    </p>
                    <p>
                      {row.className} · {row.subject}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </DashboardCard>
  );
}
