import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { DataProvider } from "./-components/data-context";
import { KpiCards } from "./-components/kpi-cards";
import { OpportunitiesSection } from "./-components/opportunities-section";
import { PipelineActivity } from "./-components/pipeline-activity";
import { TaskReminders } from "./-components/task-reminders";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { requestReference } = await import("@/server/request-reference.server");
  const { readCrm } = await import("@/server/data/crm");
  return readCrm({ variant: "current", renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/dashboard/crm")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  return (
    <div className="flex min-w-0 flex-col gap-4 md:gap-6">
      <KpiCards />
      <PipelineActivity />
      <TaskReminders />
      <OpportunitiesSection />
    </div>
  );
}

function Page() {
  const data = Route.useLoaderData();
  return (
    <DataProvider data={data}>
      <PageContent />
    </DataProvider>
  );
}
