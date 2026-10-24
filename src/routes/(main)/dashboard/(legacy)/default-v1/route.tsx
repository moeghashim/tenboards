import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { ChartAreaInteractive } from "./-components/chart-area-interactive";
import { DataProvider, useDashboardData } from "./-components/data-context";
import { ProposalSectionsTable } from "./-components/proposal-sections-table/table";
import { SectionCards } from "./-components/section-cards";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { requestReference } = await import("@/server/request-reference.server");
  const { readDefault } = await import("@/server/data/default");
  return readDefault({ variant: "v1", renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/dashboard/(legacy)/default-v1")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  const data = useDashboardData().recordsProposals;
  return (
    <div className="@container/main flex min-w-0 flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <ProposalSectionsTable data={data} />
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
