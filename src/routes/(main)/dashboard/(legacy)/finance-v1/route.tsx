import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CardOverview } from "./-components/card-overview";
import { CashFlowOverview } from "./-components/cash-flow-overview";
import { DataProvider } from "./-components/data-context";
import { IncomeReliability } from "./-components/income-reliability";
import { MonthlyCashFlow } from "./-components/kpis/monthly-cash-flow";
import { NetWorth } from "./-components/kpis/net-worth";
import { PrimaryAccount } from "./-components/kpis/primary-account";
import { SavingsRate } from "./-components/kpis/savings-rate";
import { SpendingBreakdown } from "./-components/spending-breakdown";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { requestReference } = await import("@/server/request-reference.server");
  const { readFinance } = await import("@/server/data/finance");
  return readFinance({ variant: "v1", renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/dashboard/(legacy)/finance-v1")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  return (
    <div className="min-w-0">
      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="activity">
            Activity
          </TabsTrigger>
          <TabsTrigger disabled value="insights">
            Insights
          </TabsTrigger>
          <TabsTrigger disabled value="utilities">
            Utilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              <PrimaryAccount />
              <NetWorth />
              <MonthlyCashFlow />
              <SavingsRate />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="flex flex-col gap-4">
                <CashFlowOverview />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <SpendingBreakdown />
                  <IncomeReliability />
                </div>
              </div>

              <CardOverview />
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
