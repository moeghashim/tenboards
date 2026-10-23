import { createFileRoute } from "@tanstack/react-router";

import { CalendarPanel } from "./-components/calendar-panel";
import { FocusCard } from "./-components/focus-card";
import { ProjectsSection } from "./-components/projects-section";
import { QuickActions } from "./-components/quick-actions";
import { QuoteCard } from "./-components/quote-card";
import { RecentNotesCard } from "./-components/recent-notes-card";
import { SummaryCards } from "./-components/summary-cards";
import { TasksSection } from "./-components/tasks-section";
import { WeeklySummaryCard } from "./-components/weekly-summary-card";

export const Route = createFileRoute("/(main)/dashboard/productivity")({
  component: Page,
});

function Page() {
  return (
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="min-w-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-foreground text-3xl leading-tight tracking-tight">Good morning, Jordan.</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Let&apos;s make today productive and meaningful.
            </p>
          </div>
          <SummaryCards />
          <TasksSection />
          <ProjectsSection />
          <QuickActions />
          <QuoteCard />
        </div>
      </section>

      <section className="grid min-w-0 items-start gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <CalendarPanel />
        <FocusCard />
        <RecentNotesCard />
        <WeeklySummaryCard />
      </section>
    </div>
  );
}
