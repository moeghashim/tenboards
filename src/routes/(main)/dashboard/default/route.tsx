import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { DataProvider } from "./-components/data-context";
import { MetricCards } from "./-components/metric-cards";
import { PerformanceOverview } from "./-components/performance-overview";
import { SubscriberOverview } from "./-components/subscriber-overview";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { requestReference } = await import("@/server/request-reference.server");
  const { readDefault } = await import("@/server/data/default");
  return readDefault({ renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/dashboard/default")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  return (
    <div className="@container/main flex min-w-0 flex-col gap-4 md:gap-6">
      <MetricCards />
      <PerformanceOverview />
      <SubscriberOverview />
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
