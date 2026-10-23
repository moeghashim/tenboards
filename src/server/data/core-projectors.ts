import type { AnalyticsData } from "./analytics.types.ts";
import { performanceDates, previousMonth, revenueRange, rollingMonths, visitorRange } from "./core-dates.ts";
import type { CrmData } from "./crm.types.ts";
import type { DefaultData } from "./default.types.ts";
import type { FinanceData } from "./finance.types.ts";

type Request = { id?: string; range?: "90d" | "30d" | "7d"; from?: string; to?: string };
export function projectDefault(data: Omit<DefaultData, "projection">, input: Request): DefaultData {
  if (input.id !== undefined) {
    data.current.recordsCustomers = data.current.recordsCustomers.filter((row) => row.id === input.id);
    data.v1.recordsProposals = data.v1.recordsProposals.filter((row) => String(row.id) === input.id);
  }
  const timing = data.current.performanceOverviewTiming[0];
  const reference = data.v1.chartAreaInteractiveReference[0];
  if (!timing || !reference) throw new Error("Missing chart reference");
  return {
    ...data,
    projection: {
      performance: performanceDates(data.current.performanceOverviewChartValues, data.renderedAt, timing.stepHours),
      visitors: visitorRange(data.v1.chartAreaInteractiveChartData, reference.date, input.range ?? "90d"),
    },
  };
}
export function projectCrm(data: Omit<CrmData, "projection">, input: Request): CrmData {
  if (input.id !== undefined) {
    data.current.recordsOpportunities = data.current.recordsOpportunities.filter((row) => row.id === input.id);
    data.v1.crmConfigRecentLeadsData = data.v1.crmConfigRecentLeadsData.filter((row) => row.id === input.id);
  }
  return {
    ...data,
    projection: {
      pipeline: rollingMonths(data.current.pipelineActivityPipelineChartValues, data.renderedAt),
      previousMonth: previousMonth(data.renderedAt),
    },
  };
}
export function projectFinance(data: Omit<FinanceData, "projection">, input: Request): FinanceData {
  if (input.id !== undefined) {
    data.current.walletWalletCards = data.current.walletWalletCards.filter((row) => String(row.id) === input.id);
    data.v1.cardOverviewUpcomingPayments = data.v1.cardOverviewUpcomingPayments.filter(
      (row) => String(row.id) === input.id,
    );
  }
  const statement = data.current.statementReference[0];
  if (!statement) throw new Error("Missing statement reference");
  return { ...data, projection: { statementDate: statement.date } };
}
export function projectAnalytics(data: Omit<AnalyticsData, "projection">, input: Request): AnalyticsData {
  if (input.id !== undefined) {
    data.current.topPagesPages = data.current.topPagesPages.filter((row) => row.path === input.id);
    data.v1.analyticsActionsRiskLedgerLedgerRows = data.v1.analyticsActionsRiskLedgerLedgerRows.filter(
      (row) => String(row.id) === input.id,
    );
  }
  const initial = data.v1.analyticsOverviewDateRange[0],
    model = data.v1.analyticsOverviewRevenueModel[0];
  if (!initial || !model) throw new Error("Missing revenue model");
  const range = { from: input.from ?? initial.from, to: input.to ?? initial.to };
  return { ...data, projection: { range, revenue: revenueRange(model, range.from, range.to) } };
}
