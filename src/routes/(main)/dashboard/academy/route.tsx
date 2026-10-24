import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { BookOpenCheck, Megaphone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AssignmentStatus } from "./-components/assignment-status";
import { ClassSchedule } from "./-components/class-schedule";
import { DataProvider, useDashboardData } from "./-components/data-context";
import { KpiCards } from "./-components/kpi-cards";
import { PerformanceHighlights } from "./-components/performance-highlights";
import { UpcomingEvents } from "./-components/upcoming-events";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { readAcademy } = await import("@/server/data/academy");
  return readAcademy();
});
export const Route = createFileRoute("/(main)/dashboard/academy")({
  loader: () => loadData(),
  component: Page,
});

function Page() {
  return (
    <DataProvider data={Route.useLoaderData()}>
      <PageContent />
    </DataProvider>
  );
}
function PageContent() {
  const data = useDashboardData();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">Academy Dashboard</h1>
          <p className="text-muted-foreground text-sm">{`Teaching overview · Demo day: ${data.day.label}.`}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:w-fit">
          <Button size="sm">
            <Megaphone />
            New Announcement
          </Button>
          <Button size="sm" variant="outline">
            <BookOpenCheck />
            Gradebook
          </Button>
          <Button size="sm" variant="outline">
            <Plus />
            Add Assignment
          </Button>
        </div>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-5">
          <ClassSchedule />
        </div>
        <div className="min-w-0 xl:col-span-7">
          <AssignmentStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <PerformanceHighlights />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
