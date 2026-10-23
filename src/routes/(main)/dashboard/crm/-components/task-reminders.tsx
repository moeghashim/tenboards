import { cn } from "cn";
import { CalendarDays, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function TaskReminders() {
  const proposalSent = useDashboardData().taskRemindersGoal[0].sent;
  const proposalGoal = useDashboardData().taskRemindersGoal[0].target;
  const proposalProgressPercentage = Math.round((proposalSent / proposalGoal) * 100);
  const proposalGoalBarCount = 42;
  const activeProposalBars = Math.round((proposalSent / proposalGoal) * proposalGoalBarCount);

  const proposalGoalBars = Array.from({ length: proposalGoalBarCount }, (_, index) => ({
    id: `proposal-goal-${index + 1}`,
    active: index < activeProposalBars,
  }));

  const summary = useDashboardData().taskRemindersSummary[0];

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-8">
        <SectionHeader
          title="Upcoming Meetings"
          actions={
            <Button variant="outline" size="sm">
              <CalendarDays data-icon="inline-start" />
              View Calendar
            </Button>
          }
        />

        <CardContent>
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
              <div className="flex flex-col items-center gap-1">
                <span>{summary.value1}</span>
                <span className="bg-border h-2 w-px" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span>{summary.value2}</span>
                <span className="bg-border h-2 w-px" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span>{summary.value3}</span>
                <span className="bg-border h-2 w-px" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span>{summary.value4}</span>
                <span className="bg-border h-2 w-px" />
              </div>
            </div>

            <div className="relative h-14">
              <div className="bg-border/80 absolute inset-x-3 top-1/2 h-px -translate-y-1/2" />
              <div className="bg-primary text-primary-foreground absolute top-2 bottom-2 left-[8%] flex w-[84%] items-center rounded-lg px-2 sm:left-[22%] sm:w-[44%]">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="bg-background text-primary flex size-7 shrink-0 items-center justify-center rounded-full">
                    <CalendarRange className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-primary-foreground truncate text-xs leading-none font-medium">
                      {summary.value5}
                    </div>
                    <div className="text-primary-foreground truncate text-xs">{summary.value6}</div>
                  </div>
                </div>
              </div>
              <div className="bg-primary-foreground absolute top-4 bottom-4 left-[90%] w-1 rounded-full sm:left-[64%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-4">
        <SectionHeader title="Monthly Proposal Goal" />

        <CardContent className="flex flex-col gap-1">
          <div className="flex items-end justify-between gap-3">
            <div className="text-2xl leading-none font-medium tabular-nums">
              {proposalSent} <span className="text-muted-foreground text-base font-normal">sent</span>
            </div>
            <div className="text-muted-foreground text-sm tabular-nums">{proposalGoal} target</div>
          </div>
          <div aria-hidden="true" className="flex h-10 w-full items-end gap-0.5">
            {proposalGoalBars.map((bar) => (
              <div key={bar.id} className="flex min-w-0 flex-1 justify-center">
                <div className={cn("h-10 w-full max-w-1.5 rounded-full", bar.active ? "bg-primary" : "bg-muted")} />
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            {proposalProgressPercentage}% of this month&apos;s proposal target reached.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
