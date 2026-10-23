import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Download, RotateCw, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDemoDate } from "@/routes/(main)/dashboard/-components/finance-demo-dates";

import { BalanceDistributionCard } from "./-components/balance-distribution-card";
import { DataProvider, useDashboardData } from "./-components/data-context";
import { FinanceNotification } from "./-components/finance-notification";
import { IncomeBreakdown } from "./-components/income-breakdown";
import { OverviewKpis } from "./-components/overview-kpis";
import { QuickActions } from "./-components/quick-actions";
import { TransactionsOverviewCard } from "./-components/transactions-overview-card";
import { UpcomingTransactions } from "./-components/upcoming-transactions";
import { Wallet } from "./-components/wallet";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readFinance } = await import("@/server/data/finance");
  return readFinance({ variant: "current", renderedAt: new Date().toISOString() });
});

export const Route = createFileRoute("/(main)/dashboard/finance")({
  loader: () => loadData(),
  component: Page,
});

function PageContent() {
  const summary = useDashboardData().pageSummary[0];

  const formattedDate = formatDemoDate(useDashboardData().statementDate);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Personal Finances</h1>
        <p className="text-muted-foreground text-sm">Demo statement · {formattedDate}</p>
      </div>

      <Tabs defaultValue="30-days" className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList variant="line">
            <TabsTrigger value="30-days">Dashboard</TabsTrigger>
            <TabsTrigger value="12-months">Accounts</TabsTrigger>
            <TabsTrigger value="custom">Transactions</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <RotateCw className="size-4" />
              <span>{summary.value1}</span>
            </div>
            <Button size="sm" variant="outline">
              <Settings2 />
              Settings
            </Button>
            <Button size="sm" variant="outline">
              <Download data-icon="inline-start" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="30-days" className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <OverviewKpis />
            </div>

            <div className="flex flex-col gap-4 xl:col-span-6">
              <IncomeBreakdown />
              <FinanceNotification />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TransactionsOverviewCard />
            </div>
            <div className="xl:col-span-5">
              <BalanceDistributionCard />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <Wallet />
            </div>
            <div className="xl:col-span-4">
              <UpcomingTransactions />
            </div>
            <div className="xl:col-span-4">
              <QuickActions />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="12-months">
          <div className="border-border text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
            Accounts view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="border-border text-muted-foreground flex h-64 items-center justify-center rounded-xl border border-dashed">
            Transactions view coming soon.
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
