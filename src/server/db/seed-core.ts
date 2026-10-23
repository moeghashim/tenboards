import { splitMetric } from "../data/metric-projection.ts";
import type { getDatabase } from "./client.server.ts";
import * as s from "./core-entity-schema.ts";
import { seedMetricCollection } from "./seed-metrics.ts";

type Transaction = Parameters<Parameters<ReturnType<typeof getDatabase>["transaction"]>[0]>[0];

import { current as analyticsCurrent, v1 as analyticsV1 } from "./fixtures/analytics.ts";
import { current as crmCurrent, v1 as crmV1 } from "./fixtures/crm.ts";
import { current as defaultCurrent, v1 as defaultV1 } from "./fixtures/default.ts";
import { current as financeCurrent, v1 as financeV1 } from "./fixtures/finance.ts";
export async function seedCore(tx: Transaction) {
  for (const [position, item] of analyticsV1.coverageAssignment.entries()) {
    const row = { ...item, position };
    await tx
      .insert(s.analyticsCoverageAssignments)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsCoverageAssignments.id, set: row });
  }
  for (const [position, item] of defaultV1.reviewers.entries()) {
    const row = { ...item, position };
    await tx.insert(s.defaultReviewers).values(row).onConflictDoUpdate({ target: s.defaultReviewers.value, set: row });
  }

  await seedMetricCollection(
    tx,
    "core-default",
    "current.performanceOverviewChartValues",
    defaultCurrent.performanceOverviewChartValues,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-default",
    "v1.chartAreaInteractiveChartData",
    defaultV1.chartAreaInteractiveChartData,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-default",
    "v1.proposalSectionsTableColumnsChartData",
    defaultV1.proposalSectionsTableColumnsChartData,
    "count",
  );
  await seedMetricCollection(tx, "core-crm", "current.kpiCardsMetrics", crmCurrent.kpiCardsMetrics, "count");
  await seedMetricCollection(
    tx,
    "core-crm",
    "current.pipelineActivityPipelineChartValues",
    crmCurrent.pipelineActivityPipelineChartValues.map((value) => ({ value })),
    "count",
  );
  await seedMetricCollection(tx, "core-crm", "v1.crmConfigLeadsChartData", crmV1.crmConfigLeadsChartData, "count");
  await seedMetricCollection(
    tx,
    "core-crm",
    "v1.crmConfigProposalsChartData",
    crmV1.crmConfigProposalsChartData,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-crm",
    "v1.crmConfigRevenueChartData",
    crmV1.crmConfigRevenueChartData,
    "currency",
  );
  await seedMetricCollection(
    tx,
    "core-crm",
    "v1.crmConfigLeadsBySourceChartData",
    crmV1.crmConfigLeadsBySourceChartData,
    "count",
  );
  for (const [position, item] of crmV1.crmConfigProjectRevenueChartData.entries()) {
    const row = {
      recordKey: String(position),
      position,
      name: item.name,
      actual: String(item.actual),
      target: String(item.target),
      remaining: String(item.remaining),
    };
    await tx
      .insert(s.crmV1CrmConfigProjectRevenueChartData)
      .values(row)
      .onConflictDoUpdate({ target: s.crmV1CrmConfigProjectRevenueChartData.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-crm",
    "v1.crmConfigSalesPipelineChartData",
    crmV1.crmConfigSalesPipelineChartData,
    "count",
  );
  for (const [position, item] of crmV1.crmConfigRegionSalesData.entries()) {
    const growthFormat = splitMetric(item.growth);
    const growthPart = growthFormat.parts[0];
    if (!growthPart || growthFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(position),
      position,
      region: item.region,
      sales: String(item.sales),
      percentage: String(item.percentage),
      growth: growthPart.value,
      growthTemplate: growthFormat.template,
      growthPrefix: growthPart.prefix,
      growthDecimals: growthPart.decimals,
      growthGrouped: growthPart.grouped,
      growthScale: growthPart.scale,
      growthLeadingDecimal: growthPart.leadingDecimal,
      growthUnit: growthPart.unit,
      isPositive: item.isPositive,
    };
    await tx
      .insert(s.crmV1CrmConfigRegionSalesData)
      .values(row)
      .onConflictDoUpdate({ target: s.crmV1CrmConfigRegionSalesData.recordKey, set: row });
  }
  for (const [position, item] of crmV1.crmConfigActionItems.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      title: item.title,
      desc: item.desc,
      due: item.due,
      priority: item.priority,
      checked: item.checked,
    };
    await tx
      .insert(s.crmV1CrmConfigActionItems)
      .values(row)
      .onConflictDoUpdate({ target: s.crmV1CrmConfigActionItems.recordKey, set: row });
  }
  for (const [position, item] of crmV1.crmConfigRecentLeadsData.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: item.id,
      name: item.name,
      company: item.company,
      status: item.status,
      source: item.source,
      lastActivity: item.lastActivity,
    };
    await tx
      .insert(s.crmV1CrmConfigRecentLeadsData)
      .values(row)
      .onConflictDoUpdate({ target: s.crmV1CrmConfigRecentLeadsData.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-finance",
    "current.overviewKpisMetrics",
    financeCurrent.overviewKpisMetrics,
    "count",
  );
  for (const [position, item] of financeCurrent.balanceDistributionCardBalanceData.entries()) {
    const row = {
      recordKey: String(position),
      position,
      account: item.account,
      amount: String(item.amount),
      key: item.key,
      percentage: String(item.percentage),
    };
    await tx
      .insert(s.financeCurrentBalanceDistributionCardBalanceData)
      .values(row)
      .onConflictDoUpdate({ target: s.financeCurrentBalanceDistributionCardBalanceData.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-finance",
    "current.incomeBreakdownSources",
    financeCurrent.incomeBreakdownSources,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-finance",
    "current.transactionsOverviewCardChartData",
    financeCurrent.transactionsOverviewCardChartData,
    "currency",
  );
  for (const [position, item] of financeCurrent.upcomingTransactionsTransactions.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      title: item.title,
      date: item.date,
      icon: item.icon,
    };
    await tx
      .insert(s.financeCurrentUpcomingTransactionsTransactions)
      .values(row)
      .onConflictDoUpdate({ target: s.financeCurrentUpcomingTransactionsTransactions.recordKey, set: row });
  }
  for (const [position, item] of financeCurrent.walletWalletCards.entries()) {
    const balanceFormat = splitMetric(item.balance);
    const balancePart = balanceFormat.parts[0];
    if (!balancePart || balanceFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      bank: item.bank,
      last4: item.last4,
      balance: balancePart.value,
      balanceTemplate: balanceFormat.template,
      balancePrefix: balancePart.prefix,
      balanceDecimals: balancePart.decimals,
      balanceGrouped: balancePart.grouped,
      balanceScale: balancePart.scale,
      balanceLeadingDecimal: balancePart.leadingDecimal,
      balanceUnit: balancePart.unit,
      icon: item.icon,
    };
    await tx
      .insert(s.financeCurrentWalletWalletCards)
      .values(row)
      .onConflictDoUpdate({ target: s.financeCurrentWalletWalletCards.recordKey, set: row });
  }
  for (const [position, item] of financeCurrent.walletCryptoAssets.entries()) {
    const balanceFormat = splitMetric(item.balance);
    const balancePart = balanceFormat.parts[0];
    if (!balancePart || balanceFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const usdValueFormat = splitMetric(item.usdValue);
    const usdValuePart = usdValueFormat.parts[0];
    if (!usdValuePart || usdValueFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      name: item.name,
      vault: item.vault,
      balance: balancePart.value,
      balanceTemplate: balanceFormat.template,
      balancePrefix: balancePart.prefix,
      balanceDecimals: balancePart.decimals,
      balanceGrouped: balancePart.grouped,
      balanceScale: balancePart.scale,
      balanceLeadingDecimal: balancePart.leadingDecimal,
      balanceUnit: balancePart.unit,
      usdValue: usdValuePart.value,
      usdValueTemplate: usdValueFormat.template,
      usdValuePrefix: usdValuePart.prefix,
      usdValueDecimals: usdValuePart.decimals,
      usdValueGrouped: usdValuePart.grouped,
      usdValueScale: usdValuePart.scale,
      usdValueLeadingDecimal: usdValuePart.leadingDecimal,
      usdValueUnit: usdValuePart.unit,
      icon: item.icon,
    };
    await tx
      .insert(s.financeCurrentWalletCryptoAssets)
      .values(row)
      .onConflictDoUpdate({ target: s.financeCurrentWalletCryptoAssets.recordKey, set: row });
  }
  for (const [position, item] of financeCurrent.quickActionsContacts.entries()) {
    const row = { recordKey: String(item.id), position, id: String(item.id), initials: item.initials };
    await tx
      .insert(s.financeCurrentQuickActionsContacts)
      .values(row)
      .onConflictDoUpdate({ target: s.financeCurrentQuickActionsContacts.recordKey, set: row });
  }
  for (const [position, item] of financeV1.cardOverviewUpcomingPayments.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      icon: item.icon,
      title: item.title,
      amount: String(item.amount),
      date: item.date,
    };
    await tx
      .insert(s.financeV1CardOverviewUpcomingPayments)
      .values(row)
      .onConflictDoUpdate({ target: s.financeV1CardOverviewUpcomingPayments.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-finance",
    "v1.cashFlowOverviewChartData",
    financeV1.cashFlowOverviewChartData,
    "currency",
  );
  await seedMetricCollection(
    tx,
    "core-finance",
    "v1.spendingBreakdownExpenses",
    financeV1.spendingBreakdownExpenses,
    "currency",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "current.analyticsKpiStripMetrics",
    analyticsCurrent.analyticsKpiStripMetrics,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "current.realtimeVisitorsRealtimeData",
    analyticsCurrent.realtimeVisitorsRealtimeData,
    "count",
  );
  for (const [position, item] of analyticsCurrent.topPagesPages.entries()) {
    const bounceFormat = splitMetric(item.bounce);
    const bouncePart = bounceFormat.parts[0];
    if (!bouncePart || bounceFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const viewsFormat = splitMetric(item.views);
    const viewsPart = viewsFormat.parts[0];
    if (!viewsPart || viewsFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(position),
      position,
      bounce: bouncePart.value,
      bounceTemplate: bounceFormat.template,
      bouncePrefix: bouncePart.prefix,
      bounceDecimals: bouncePart.decimals,
      bounceGrouped: bouncePart.grouped,
      bounceScale: bouncePart.scale,
      bounceLeadingDecimal: bouncePart.leadingDecimal,
      bounceUnit: bouncePart.unit,
      path: item.path,
      time: item.time,
      views: viewsPart.value,
      viewsTemplate: viewsFormat.template,
      viewsPrefix: viewsPart.prefix,
      viewsDecimals: viewsPart.decimals,
      viewsGrouped: viewsPart.grouped,
      viewsScale: viewsPart.scale,
      viewsLeadingDecimal: viewsPart.leadingDecimal,
      viewsUnit: viewsPart.unit,
    };
    await tx
      .insert(s.analyticsCurrentTopPagesPages)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsCurrentTopPagesPages.recordKey, set: row });
  }
  for (const [position, item] of analyticsCurrent.topTrafficSourcesSourcesData.entries()) {
    const labelFormat = splitMetric(item.label);
    const labelPart = labelFormat.parts[0];
    if (!labelPart || labelFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(position),
      position,
      label: labelPart.value,
      labelTemplate: labelFormat.template,
      labelPrefix: labelPart.prefix,
      labelDecimals: labelPart.decimals,
      labelGrouped: labelPart.grouped,
      labelScale: labelPart.scale,
      labelLeadingDecimal: labelPart.leadingDecimal,
      labelUnit: labelPart.unit,
      source: item.source,
      visitors: String(item.visitors),
    };
    await tx
      .insert(s.analyticsCurrentTopTrafficSourcesSourcesData)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsCurrentTopTrafficSourcesSourcesData.recordKey, set: row });
  }
  for (const [position, item] of analyticsCurrent.topTrafficSourcesCampaignsData.entries()) {
    const labelFormat = splitMetric(item.label);
    const labelPart = labelFormat.parts[0];
    if (!labelPart || labelFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(position),
      position,
      label: labelPart.value,
      labelTemplate: labelFormat.template,
      labelPrefix: labelPart.prefix,
      labelDecimals: labelPart.decimals,
      labelGrouped: labelPart.grouped,
      labelScale: labelPart.scale,
      labelLeadingDecimal: labelPart.leadingDecimal,
      labelUnit: labelPart.unit,
      source: item.source,
      visitors: String(item.visitors),
    };
    await tx
      .insert(s.analyticsCurrentTopTrafficSourcesCampaignsData)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsCurrentTopTrafficSourcesCampaignsData.recordKey, set: row });
  }
  for (const [position, item] of analyticsCurrent.topTrafficSourcesReferrersData.entries()) {
    const labelFormat = splitMetric(item.label);
    const labelPart = labelFormat.parts[0];
    if (!labelPart || labelFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(position),
      position,
      label: labelPart.value,
      labelTemplate: labelFormat.template,
      labelPrefix: labelPart.prefix,
      labelDecimals: labelPart.decimals,
      labelGrouped: labelPart.grouped,
      labelScale: labelPart.scale,
      labelLeadingDecimal: labelPart.leadingDecimal,
      labelUnit: labelPart.unit,
      source: item.source,
      visitors: String(item.visitors),
    };
    await tx
      .insert(s.analyticsCurrentTopTrafficSourcesReferrersData)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsCurrentTopTrafficSourcesReferrersData.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-analytics",
    "current.trafficQualityQualitySeries",
    analyticsCurrent.trafficQualityQualitySeries,
    "percent",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsOverviewRiskSummaryMetrics",
    analyticsV1.analyticsOverviewRiskSummaryMetrics,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsDriversForecastTargetChartData",
    analyticsV1.analyticsDriversForecastTargetChartData,
    "percent",
  );
  for (const [position, item] of analyticsV1.analyticsActionsRiskLedgerLedgerRows.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      account: item.account,
      dealId: item.dealId,
      stage: item.stage,
      blocker: item.blocker,
      owner: item.owner,
      idleDays: String(item.idleDays),
      closeVariance: item.closeVariance,
      priority: item.priority,
      nextAction: item.nextAction,
      riskScore: String(item.riskScore),
    };
    await tx
      .insert(s.analyticsV1AnalyticsActionsRiskLedgerLedgerRows)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsV1AnalyticsActionsRiskLedgerLedgerRows.recordKey, set: row });
  }
  for (const [position, item] of analyticsV1.analyticsActionsManagerQueueNextInterventions.entries()) {
    const row = {
      recordKey: String(position),
      position,
      dealId: item.dealId,
      priority: item.priority,
      owner: item.owner,
      risk: String(item.risk),
      recommendation: item.recommendation,
    };
    await tx
      .insert(s.analyticsV1AnalyticsActionsManagerQueueNextInterventions)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsV1AnalyticsActionsManagerQueueNextInterventions.recordKey, set: row });
  }
  for (const [position, item] of defaultCurrent.recordsCustomers.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: item.id,
      name: item.name,
      email: item.email,
      plan: item.plan,
      status: item.status,
      billing: item.billing,
      joined: item.joined,
    };
    await tx
      .insert(s.defaultCurrentRecordsCustomers)
      .values(row)
      .onConflictDoUpdate({ target: s.defaultCurrentRecordsCustomers.recordKey, set: row });
  }
  for (const [position, item] of defaultV1.recordsProposals.entries()) {
    const row = {
      recordKey: String(item.id),
      position,
      id: String(item.id),
      header: item.header,
      type: item.type,
      status: item.status,
      target: item.target,
      limit: item.limit,
      reviewer: item.reviewer,
    };
    await tx
      .insert(s.defaultV1RecordsProposals)
      .values(row)
      .onConflictDoUpdate({ target: s.defaultV1RecordsProposals.recordKey, set: row });
  }
  for (const [position, item] of crmCurrent.recordsOpportunities.entries()) {
    const valueFormat = splitMetric(item.value);
    const valuePart = valueFormat.parts[0];
    if (!valuePart || valueFormat.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      recordKey: String(item.id),
      position,
      id: item.id,
      account: item.account,
      stage: item.stage,
      priority: String(item.priority),
      health: item.health,
      value: valuePart.value,
      valueTemplate: valueFormat.template,
      valuePrefix: valuePart.prefix,
      valueDecimals: valuePart.decimals,
      valueGrouped: valuePart.grouped,
      valueScale: valuePart.scale,
      valueLeadingDecimal: valuePart.leadingDecimal,
      valueUnit: valuePart.unit,
    };
    await tx
      .insert(s.crmCurrentRecordsOpportunities)
      .values(row)
      .onConflictDoUpdate({ target: s.crmCurrentRecordsOpportunities.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-default",
    "current.metricCardsSummary",
    defaultCurrent.metricCardsSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-default",
    "current.subscriberOverviewSummary",
    defaultCurrent.subscriberOverviewSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-default",
    "v1.proposalSectionsTableColumnsSummary",
    defaultV1.proposalSectionsTableColumnsSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-default",
    "v1.proposalSectionsTableTableSummary",
    defaultV1.proposalSectionsTableTableSummary,
    "count",
  );
  await seedMetricCollection(tx, "core-default", "v1.sectionCardsSummary", defaultV1.sectionCardsSummary, "count");
  await seedMetricCollection(
    tx,
    "core-crm",
    "current.pipelineActivitySummary",
    crmCurrent.pipelineActivitySummary,
    "count",
  );
  for (const [position, item] of crmCurrent.taskRemindersSummary.entries()) {
    const row = {
      recordKey: String(position),
      position,
      value1: item.value1,
      value2: item.value2,
      value3: item.value3,
      value4: item.value4,
      value5: item.value5,
      value6: item.value6,
    };
    await tx
      .insert(s.crmCurrentTaskRemindersSummary)
      .values(row)
      .onConflictDoUpdate({ target: s.crmCurrentTaskRemindersSummary.recordKey, set: row });
  }
  await seedMetricCollection(tx, "core-crm", "v1.insightCardsSummary", crmV1.insightCardsSummary, "count");
  await seedMetricCollection(tx, "core-crm", "v1.operationalCardsSummary", crmV1.operationalCardsSummary, "count");
  await seedMetricCollection(tx, "core-crm", "v1.overviewCardsSummary", crmV1.overviewCardsSummary, "count");
  await seedMetricCollection(
    tx,
    "core-finance",
    "current.financeNotificationSummary",
    financeCurrent.financeNotificationSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-finance",
    "current.upcomingTransactionsSummary",
    financeCurrent.upcomingTransactionsSummary,
    "currency",
  );
  await seedMetricCollection(tx, "core-finance", "current.pageSummary", financeCurrent.pageSummary, "count");
  for (const [position, item] of financeV1.cardOverviewSummary.entries()) {
    const value5Format = splitMetric(item.value5);
    const value5Part = value5Format.parts[0];
    if (!value5Part || value5Format.parts.length !== 1) throw new Error("Expected a scalar measure");
    const value6Format = splitMetric(item.value6);
    const value6Part = value6Format.parts[0];
    if (!value6Part || value6Format.parts.length !== 1) throw new Error("Expected a scalar measure");
    const row = {
      cardType: item.cardType,
      brandIcon: item.brandIcon,
      networkIcon: item.networkIcon,
      recordKey: String(position),
      position,
      value1: item.value1,
      value2: item.value2,
      value3: item.value3,
      value4: item.value4,
      value5: value5Part.value,
      value5Template: value5Format.template,
      value5Prefix: value5Part.prefix,
      value5Decimals: value5Part.decimals,
      value5Grouped: value5Part.grouped,
      value5Scale: value5Part.scale,
      value5LeadingDecimal: value5Part.leadingDecimal,
      value5Unit: value5Part.unit,
      value6: value6Part.value,
      value6Template: value6Format.template,
      value6Prefix: value6Part.prefix,
      value6Decimals: value6Part.decimals,
      value6Grouped: value6Part.grouped,
      value6Scale: value6Part.scale,
      value6LeadingDecimal: value6Part.leadingDecimal,
      value6Unit: value6Part.unit,
    };
    await tx
      .insert(s.financeV1CardOverviewSummary)
      .values(row)
      .onConflictDoUpdate({ target: s.financeV1CardOverviewSummary.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-finance",
    "v1.incomeReliabilitySummary",
    financeV1.incomeReliabilitySummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-finance",
    "v1.kpisMonthlyCashFlowSummary",
    financeV1.kpisMonthlyCashFlowSummary,
    "currency",
  );
  await seedMetricCollection(tx, "core-finance", "v1.kpisNetWorthSummary", financeV1.kpisNetWorthSummary, "count");
  await seedMetricCollection(
    tx,
    "core-finance",
    "v1.kpisPrimaryAccountSummary",
    financeV1.kpisPrimaryAccountSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-finance",
    "v1.kpisSavingsRateSummary",
    financeV1.kpisSavingsRateSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "current.realtimeVisitorsSummary",
    analyticsCurrent.realtimeVisitorsSummary,
    "count",
  );
  for (const [position, item] of analyticsCurrent.pageSummary.entries()) {
    const row = { recordKey: String(position), position, value1: item.value1 };
    await tx
      .insert(s.analyticsCurrentPageSummary)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsCurrentPageSummary.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsActionsManagerQueueSummary",
    analyticsV1.analyticsActionsManagerQueueSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsActionsRiskLedgerSummary",
    analyticsV1.analyticsActionsRiskLedgerSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsDriversCoverageTriageSummary",
    analyticsV1.analyticsDriversCoverageTriageSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsDriversForecastTargetSummary",
    analyticsV1.analyticsDriversForecastTargetSummary,
    "percent",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsOverviewSummary",
    analyticsV1.analyticsOverviewSummary,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsDriversCoverageTriageLeverOptions",
    analyticsV1.analyticsDriversCoverageTriageLeverOptions,
    "count",
  );
  await seedMetricCollection(
    tx,
    "core-analytics",
    "v1.analyticsOverviewRevenueModel",
    analyticsV1.analyticsOverviewRevenueModel,
    "currency",
    { frequency: "ratio", phase: "ratio", amplitude: "ratio", bias: "ratio" },
  );
  for (const [position, item] of analyticsV1.analyticsOverviewDateRange.entries()) {
    const row = { recordKey: String(item.id), position, id: item.id, from: item.from, to: item.to };
    await tx
      .insert(s.analyticsV1AnalyticsOverviewDateRange)
      .values(row)
      .onConflictDoUpdate({ target: s.analyticsV1AnalyticsOverviewDateRange.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-default",
    "current.performanceOverviewTiming",
    defaultCurrent.performanceOverviewTiming,
    "duration",
  );
  for (const [position, item] of defaultV1.chartAreaInteractiveReference.entries()) {
    const row = { recordKey: String(item.id), position, id: item.id, date: item.date };
    await tx
      .insert(s.defaultV1ChartAreaInteractiveReference)
      .values(row)
      .onConflictDoUpdate({ target: s.defaultV1ChartAreaInteractiveReference.recordKey, set: row });
  }
  await seedMetricCollection(
    tx,
    "core-crm",
    "current.pipelineActivityTotals",
    crmCurrent.pipelineActivityTotals,
    "count",
  );
  await seedMetricCollection(tx, "core-crm", "current.taskRemindersGoal", crmCurrent.taskRemindersGoal, "count");
  for (const [position, item] of financeCurrent.statementReference.entries()) {
    const row = { recordKey: String(item.id), position, id: item.id, date: item.date };
    await tx
      .insert(s.financeCurrentStatementReference)
      .values(row)
      .onConflictDoUpdate({ target: s.financeCurrentStatementReference.recordKey, set: row });
  }
}
