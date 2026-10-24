import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { ActionsManagerQueue } from "./-components/analytics-actions-manager-queue";
import { ActionsRiskLedger } from "./-components/analytics-actions-risk-ledger";
import { DriversCoverageTriage } from "./-components/analytics-drivers-coverage-triage";
import { DriversForecastTarget } from "./-components/analytics-drivers-forecast-target";
import { AnalyticsOverview } from "./-components/analytics-overview";
import { DataProvider } from "./-components/data-context";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { requestReference } = await import("@/server/request-reference.server");
  const { readAnalytics } = await import("@/server/data/analytics");
  return readAnalytics({ variant: "v1", renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/dashboard/(legacy)/analytics-v1")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  return (
    <div className="flex min-w-0 flex-col gap-4 md:gap-6">
      <AnalyticsOverview />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <DriversForecastTarget />
          <DriversCoverageTriage />
        </div>
        <ActionsManagerQueue />
      </div>

      <ActionsRiskLedger />
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
