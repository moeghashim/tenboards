import { asc } from "drizzle-orm";
import { z } from "zod";

import { current, v1 } from "../db/fixtures/finance.ts";
import { projectFinance } from "./core-projectors.ts";
import type { FinanceData } from "./finance.types.ts";
import { loadMetricCollections } from "./metric-collections.ts";
import { joinMetric, type MetricUnit } from "./metric-projection.ts";
import { readSource } from "./source.ts";

const inputSchema = z.object({
  variant: z.enum(["current", "v1"]),
  renderedAt: z.iso.datetime(),
  id: z.string().optional(),
});
type Input = z.infer<typeof inputSchema>;
export async function demoFinance(input: Input): Promise<FinanceData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  return projectFinance(structuredClone({ current, v1, variant, renderedAt }), input);
}
export async function dbFinance(input: Input): Promise<FinanceData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  const { getDatabase } = await import("../db/client.server.ts");
  const s = await import("../db/core-entity-schema.ts");
  const db = getDatabase();
  const metrics = await loadMetricCollections("core-finance");
  const balanceDistributionCardBalanceData = (
    await db
      .select()
      .from(s.financeCurrentBalanceDistributionCardBalanceData)
      .orderBy(
        asc(s.financeCurrentBalanceDistributionCardBalanceData.position),
        asc(s.financeCurrentBalanceDistributionCardBalanceData.recordKey),
      )
  ).map((row) => ({
    account: row.account,
    amount: Number(row.amount),
    key: row.key,
    percentage: Number(row.percentage),
  }));
  const upcomingTransactionsTransactions = (
    await db
      .select()
      .from(s.financeCurrentUpcomingTransactionsTransactions)
      .orderBy(
        asc(s.financeCurrentUpcomingTransactionsTransactions.position),
        asc(s.financeCurrentUpcomingTransactionsTransactions.recordKey),
      )
  ).map((row) => ({
    id: Number(row.id),
    title: row.title,
    date: row.date,
    icon: row.icon,
  }));
  const walletWalletCards = (
    await db
      .select()
      .from(s.financeCurrentWalletWalletCards)
      .orderBy(asc(s.financeCurrentWalletWalletCards.position), asc(s.financeCurrentWalletWalletCards.recordKey))
  ).map((row) => ({
    id: Number(row.id),
    bank: row.bank,
    last4: row.last4,
    balance: joinMetric(row.balanceTemplate, false, [
      {
        value: row.balance,
        unit: row.balanceUnit as MetricUnit,
        currency: row.balanceUnit === "currency" ? "USD" : null,
        prefix: row.balancePrefix,
        decimals: row.balanceDecimals,
        grouped: row.balanceGrouped,
        scale: row.balanceScale,
        leadingDecimal: row.balanceLeadingDecimal,
      },
    ]) as string,
    icon: row.icon,
  }));
  const walletCryptoAssets = (
    await db
      .select()
      .from(s.financeCurrentWalletCryptoAssets)
      .orderBy(asc(s.financeCurrentWalletCryptoAssets.position), asc(s.financeCurrentWalletCryptoAssets.recordKey))
  ).map((row) => ({
    id: Number(row.id),
    name: row.name,
    vault: row.vault,
    balance: joinMetric(row.balanceTemplate, false, [
      {
        value: row.balance,
        unit: row.balanceUnit as MetricUnit,
        currency: row.balanceUnit === "currency" ? "USD" : null,
        prefix: row.balancePrefix,
        decimals: row.balanceDecimals,
        grouped: row.balanceGrouped,
        scale: row.balanceScale,
        leadingDecimal: row.balanceLeadingDecimal,
      },
    ]) as string,
    usdValue: joinMetric(row.usdValueTemplate, false, [
      {
        value: row.usdValue,
        unit: row.usdValueUnit as MetricUnit,
        currency: row.usdValueUnit === "currency" ? "USD" : null,
        prefix: row.usdValuePrefix,
        decimals: row.usdValueDecimals,
        grouped: row.usdValueGrouped,
        scale: row.usdValueScale,
        leadingDecimal: row.usdValueLeadingDecimal,
      },
    ]) as string,
    icon: row.icon,
  }));
  const quickActionsContacts = (
    await db
      .select()
      .from(s.financeCurrentQuickActionsContacts)
      .orderBy(asc(s.financeCurrentQuickActionsContacts.position), asc(s.financeCurrentQuickActionsContacts.recordKey))
  ).map((row) => ({
    id: Number(row.id),
    initials: row.initials,
  }));
  const cardOverviewUpcomingPayments = (
    await db
      .select()
      .from(s.financeV1CardOverviewUpcomingPayments)
      .orderBy(
        asc(s.financeV1CardOverviewUpcomingPayments.position),
        asc(s.financeV1CardOverviewUpcomingPayments.recordKey),
      )
  ).map((row) => ({
    id: Number(row.id),
    icon: row.icon,
    title: row.title,
    amount: Number(row.amount),
    date: row.date,
  }));
  const cardOverviewSummary = (
    await db
      .select()
      .from(s.financeV1CardOverviewSummary)
      .orderBy(asc(s.financeV1CardOverviewSummary.position), asc(s.financeV1CardOverviewSummary.recordKey))
  ).map((row) => ({
    cardType: row.cardType,
    brandIcon: row.brandIcon,
    networkIcon: row.networkIcon,
    value1: row.value1,
    value2: row.value2,
    value3: row.value3,
    value4: row.value4,
    value5: joinMetric(row.value5Template, false, [
      {
        value: row.value5,
        unit: row.value5Unit as MetricUnit,
        currency: row.value5Unit === "currency" ? "USD" : null,
        prefix: row.value5Prefix,
        decimals: row.value5Decimals,
        grouped: row.value5Grouped,
        scale: row.value5Scale,
        leadingDecimal: row.value5LeadingDecimal,
      },
    ]) as string,
    value6: joinMetric(row.value6Template, false, [
      {
        value: row.value6,
        unit: row.value6Unit as MetricUnit,
        currency: row.value6Unit === "currency" ? "USD" : null,
        prefix: row.value6Prefix,
        decimals: row.value6Decimals,
        grouped: row.value6Grouped,
        scale: row.value6Scale,
        leadingDecimal: row.value6LeadingDecimal,
      },
    ]) as string,
  }));
  const statementReference = (
    await db
      .select()
      .from(s.financeCurrentStatementReference)
      .orderBy(asc(s.financeCurrentStatementReference.position), asc(s.financeCurrentStatementReference.recordKey))
  ).map((row) => ({
    id: row.id,
    date: row.date,
  }));
  return projectFinance(
    {
      variant,
      renderedAt,
      current: {
        overviewKpisMetrics: (metrics["current.overviewKpisMetrics"] ??
          []) as FinanceData["current"]["overviewKpisMetrics"],
        balanceDistributionCardBalanceData: balanceDistributionCardBalanceData,
        incomeBreakdownSources: (metrics["current.incomeBreakdownSources"] ??
          []) as FinanceData["current"]["incomeBreakdownSources"],
        transactionsOverviewCardChartData: (metrics["current.transactionsOverviewCardChartData"] ??
          []) as FinanceData["current"]["transactionsOverviewCardChartData"],
        upcomingTransactionsTransactions: upcomingTransactionsTransactions,
        walletWalletCards: walletWalletCards,
        walletCryptoAssets: walletCryptoAssets,
        quickActionsContacts: quickActionsContacts,
        financeNotificationSummary: (metrics["current.financeNotificationSummary"] ??
          []) as FinanceData["current"]["financeNotificationSummary"],
        upcomingTransactionsSummary: (metrics["current.upcomingTransactionsSummary"] ??
          []) as FinanceData["current"]["upcomingTransactionsSummary"],
        pageSummary: (metrics["current.pageSummary"] ?? []) as FinanceData["current"]["pageSummary"],
        statementReference: statementReference,
      },
      v1: {
        cardOverviewUpcomingPayments: cardOverviewUpcomingPayments,
        cashFlowOverviewChartData: (metrics["v1.cashFlowOverviewChartData"] ??
          []) as FinanceData["v1"]["cashFlowOverviewChartData"],
        spendingBreakdownExpenses: (metrics["v1.spendingBreakdownExpenses"] ??
          []) as FinanceData["v1"]["spendingBreakdownExpenses"],
        cardOverviewSummary: cardOverviewSummary,
        incomeReliabilitySummary: (metrics["v1.incomeReliabilitySummary"] ??
          []) as FinanceData["v1"]["incomeReliabilitySummary"],
        kpisMonthlyCashFlowSummary: (metrics["v1.kpisMonthlyCashFlowSummary"] ??
          []) as FinanceData["v1"]["kpisMonthlyCashFlowSummary"],
        kpisNetWorthSummary: (metrics["v1.kpisNetWorthSummary"] ?? []) as FinanceData["v1"]["kpisNetWorthSummary"],
        kpisPrimaryAccountSummary: (metrics["v1.kpisPrimaryAccountSummary"] ??
          []) as FinanceData["v1"]["kpisPrimaryAccountSummary"],
        kpisSavingsRateSummary: (metrics["v1.kpisSavingsRateSummary"] ??
          []) as FinanceData["v1"]["kpisSavingsRateSummary"],
      },
    },
    input,
  );
}
export async function readFinance(input: Input) {
  return readSource(
    () => demoFinance(input),
    () => dbFinance(input),
  );
}
