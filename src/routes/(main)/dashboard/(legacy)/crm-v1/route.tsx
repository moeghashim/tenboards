import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { DataProvider, useDashboardData } from "./-components/data-context";
import { InsightCards } from "./-components/insight-cards";
import { OperationalCards } from "./-components/operational-cards";
import { OverviewCards } from "./-components/overview-cards";
import { RecentLeadsTable } from "./-components/recent-leads-table/table";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readCrm } = await import("@/server/data/crm");
  return readCrm({ variant: "v1", renderedAt: new Date().toISOString() });
});

export const Route = createFileRoute("/(main)/dashboard/(legacy)/crm-v1")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  const recentLeadsData = useDashboardData().crmConfigRecentLeadsData;
  return (
    <div className="flex min-w-0 flex-col gap-4 md:gap-6">
      <OverviewCards />
      <InsightCards />
      <OperationalCards />
      <RecentLeadsTable data={recentLeadsData} />
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
