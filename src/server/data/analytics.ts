import { asc } from "drizzle-orm";
import { z } from "zod";

import { current, v1 } from "../db/fixtures/analytics.ts";
import type { AnalyticsData } from "./analytics.types.ts";
import { projectAnalytics } from "./core-projectors.ts";
import { loadMetricCollections } from "./metric-collections.ts";
import { joinMetric, type MetricUnit } from "./metric-projection.ts";
import { readSource } from "./source.ts";

const inputSchema = z.object({
  variant: z.enum(["current", "v1"]),
  renderedAt: z.iso.datetime(),
  id: z.string().optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});
type Input = z.infer<typeof inputSchema>;
export async function demoAnalytics(input: Input): Promise<AnalyticsData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  return projectAnalytics(structuredClone({ current, v1, variant, renderedAt }), input);
}
export async function dbAnalytics(input: Input): Promise<AnalyticsData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  const { getDatabase } = await import("../db/client.server.ts");
  const s = await import("../db/core-entity-schema.ts");
  const db = getDatabase();
  const metrics = await loadMetricCollections("core-analytics");
  const coverageAssignment = (
    await db
      .select()
      .from(s.analyticsCoverageAssignments)
      .orderBy(asc(s.analyticsCoverageAssignments.position), asc(s.analyticsCoverageAssignments.id))
  ).map(({ id, owner, focus, due }) => ({ id, owner, focus, due }));
  const topPagesPages = (
    await db
      .select()
      .from(s.analyticsCurrentTopPagesPages)
      .orderBy(asc(s.analyticsCurrentTopPagesPages.position), asc(s.analyticsCurrentTopPagesPages.recordKey))
  ).map((row) => ({
    bounce: joinMetric(row.bounceTemplate, false, [
      {
        value: row.bounce,
        unit: row.bounceUnit as MetricUnit,
        currency: row.bounceUnit === "currency" ? "USD" : null,
        prefix: row.bouncePrefix,
        decimals: row.bounceDecimals,
        grouped: row.bounceGrouped,
        scale: row.bounceScale,
        leadingDecimal: row.bounceLeadingDecimal,
      },
    ]) as string,
    path: row.path,
    time: row.time,
    views: joinMetric(row.viewsTemplate, false, [
      {
        value: row.views,
        unit: row.viewsUnit as MetricUnit,
        currency: row.viewsUnit === "currency" ? "USD" : null,
        prefix: row.viewsPrefix,
        decimals: row.viewsDecimals,
        grouped: row.viewsGrouped,
        scale: row.viewsScale,
        leadingDecimal: row.viewsLeadingDecimal,
      },
    ]) as string,
  }));
  const topTrafficSourcesSourcesData = (
    await db
      .select()
      .from(s.analyticsCurrentTopTrafficSourcesSourcesData)
      .orderBy(
        asc(s.analyticsCurrentTopTrafficSourcesSourcesData.position),
        asc(s.analyticsCurrentTopTrafficSourcesSourcesData.recordKey),
      )
  ).map((row) => ({
    label: joinMetric(row.labelTemplate, false, [
      {
        value: row.label,
        unit: row.labelUnit as MetricUnit,
        currency: row.labelUnit === "currency" ? "USD" : null,
        prefix: row.labelPrefix,
        decimals: row.labelDecimals,
        grouped: row.labelGrouped,
        scale: row.labelScale,
        leadingDecimal: row.labelLeadingDecimal,
      },
    ]) as string,
    source: row.source,
    visitors: Number(row.visitors),
  }));
  const topTrafficSourcesCampaignsData = (
    await db
      .select()
      .from(s.analyticsCurrentTopTrafficSourcesCampaignsData)
      .orderBy(
        asc(s.analyticsCurrentTopTrafficSourcesCampaignsData.position),
        asc(s.analyticsCurrentTopTrafficSourcesCampaignsData.recordKey),
      )
  ).map((row) => ({
    label: joinMetric(row.labelTemplate, false, [
      {
        value: row.label,
        unit: row.labelUnit as MetricUnit,
        currency: row.labelUnit === "currency" ? "USD" : null,
        prefix: row.labelPrefix,
        decimals: row.labelDecimals,
        grouped: row.labelGrouped,
        scale: row.labelScale,
        leadingDecimal: row.labelLeadingDecimal,
      },
    ]) as string,
    source: row.source,
    visitors: Number(row.visitors),
  }));
  const topTrafficSourcesReferrersData = (
    await db
      .select()
      .from(s.analyticsCurrentTopTrafficSourcesReferrersData)
      .orderBy(
        asc(s.analyticsCurrentTopTrafficSourcesReferrersData.position),
        asc(s.analyticsCurrentTopTrafficSourcesReferrersData.recordKey),
      )
  ).map((row) => ({
    label: joinMetric(row.labelTemplate, false, [
      {
        value: row.label,
        unit: row.labelUnit as MetricUnit,
        currency: row.labelUnit === "currency" ? "USD" : null,
        prefix: row.labelPrefix,
        decimals: row.labelDecimals,
        grouped: row.labelGrouped,
        scale: row.labelScale,
        leadingDecimal: row.labelLeadingDecimal,
      },
    ]) as string,
    source: row.source,
    visitors: Number(row.visitors),
  }));
  const analyticsActionsRiskLedgerLedgerRows = (
    await db
      .select()
      .from(s.analyticsV1AnalyticsActionsRiskLedgerLedgerRows)
      .orderBy(
        asc(s.analyticsV1AnalyticsActionsRiskLedgerLedgerRows.position),
        asc(s.analyticsV1AnalyticsActionsRiskLedgerLedgerRows.recordKey),
      )
  ).map((row) => ({
    id: Number(row.id),
    account: row.account,
    dealId: row.dealId,
    stage: row.stage,
    blocker: row.blocker,
    owner: row.owner,
    idleDays: Number(row.idleDays),
    closeVariance: row.closeVariance,
    priority: row.priority,
    nextAction: row.nextAction,
    riskScore: Number(row.riskScore),
  }));
  const analyticsActionsManagerQueueNextInterventions = (
    await db
      .select()
      .from(s.analyticsV1AnalyticsActionsManagerQueueNextInterventions)
      .orderBy(
        asc(s.analyticsV1AnalyticsActionsManagerQueueNextInterventions.position),
        asc(s.analyticsV1AnalyticsActionsManagerQueueNextInterventions.recordKey),
      )
  ).map((row) => ({
    dealId: row.dealId,
    priority: row.priority,
    owner: row.owner,
    risk: Number(row.risk),
    recommendation: row.recommendation,
  }));
  const pageSummary = (
    await db
      .select()
      .from(s.analyticsCurrentPageSummary)
      .orderBy(asc(s.analyticsCurrentPageSummary.position), asc(s.analyticsCurrentPageSummary.recordKey))
  ).map((row) => ({
    value1: row.value1,
  }));
  const analyticsOverviewDateRange = (
    await db
      .select()
      .from(s.analyticsV1AnalyticsOverviewDateRange)
      .orderBy(
        asc(s.analyticsV1AnalyticsOverviewDateRange.position),
        asc(s.analyticsV1AnalyticsOverviewDateRange.recordKey),
      )
  ).map((row) => ({
    id: row.id,
    from: row.from,
    to: row.to,
  }));
  return projectAnalytics(
    {
      variant,
      renderedAt,
      current: {
        analyticsKpiStripMetrics: (metrics["current.analyticsKpiStripMetrics"] ??
          []) as AnalyticsData["current"]["analyticsKpiStripMetrics"],
        realtimeVisitorsRealtimeData: (metrics["current.realtimeVisitorsRealtimeData"] ??
          []) as AnalyticsData["current"]["realtimeVisitorsRealtimeData"],
        topPagesPages: topPagesPages,
        topTrafficSourcesSourcesData: topTrafficSourcesSourcesData,
        topTrafficSourcesCampaignsData: topTrafficSourcesCampaignsData,
        topTrafficSourcesReferrersData: topTrafficSourcesReferrersData,
        trafficQualityQualitySeries: (metrics["current.trafficQualityQualitySeries"] ??
          []) as AnalyticsData["current"]["trafficQualityQualitySeries"],
        realtimeVisitorsSummary: (metrics["current.realtimeVisitorsSummary"] ??
          []) as AnalyticsData["current"]["realtimeVisitorsSummary"],
        pageSummary: pageSummary,
      },
      v1: {
        coverageAssignment,
        analyticsOverviewRiskSummaryMetrics: (metrics["v1.analyticsOverviewRiskSummaryMetrics"] ??
          []) as AnalyticsData["v1"]["analyticsOverviewRiskSummaryMetrics"],
        analyticsDriversForecastTargetChartData: (metrics["v1.analyticsDriversForecastTargetChartData"] ??
          []) as AnalyticsData["v1"]["analyticsDriversForecastTargetChartData"],
        analyticsActionsRiskLedgerLedgerRows: analyticsActionsRiskLedgerLedgerRows,
        analyticsActionsManagerQueueNextInterventions: analyticsActionsManagerQueueNextInterventions,
        analyticsActionsManagerQueueSummary: (metrics["v1.analyticsActionsManagerQueueSummary"] ??
          []) as AnalyticsData["v1"]["analyticsActionsManagerQueueSummary"],
        analyticsActionsRiskLedgerSummary: (metrics["v1.analyticsActionsRiskLedgerSummary"] ??
          []) as AnalyticsData["v1"]["analyticsActionsRiskLedgerSummary"],
        analyticsDriversCoverageTriageSummary: (metrics["v1.analyticsDriversCoverageTriageSummary"] ??
          []) as AnalyticsData["v1"]["analyticsDriversCoverageTriageSummary"],
        analyticsDriversForecastTargetSummary: (metrics["v1.analyticsDriversForecastTargetSummary"] ??
          []) as AnalyticsData["v1"]["analyticsDriversForecastTargetSummary"],
        analyticsOverviewSummary: (metrics["v1.analyticsOverviewSummary"] ??
          []) as AnalyticsData["v1"]["analyticsOverviewSummary"],
        analyticsDriversCoverageTriageLeverOptions: (metrics["v1.analyticsDriversCoverageTriageLeverOptions"] ??
          []) as AnalyticsData["v1"]["analyticsDriversCoverageTriageLeverOptions"],
        analyticsOverviewRevenueModel: (metrics["v1.analyticsOverviewRevenueModel"] ??
          []) as AnalyticsData["v1"]["analyticsOverviewRevenueModel"],
        analyticsOverviewDateRange: analyticsOverviewDateRange,
      },
    },
    input,
  );
}
export async function readAnalytics(input: Input) {
  return readSource(
    () => demoAnalytics(input),
    () => dbAnalytics(input),
  );
}
