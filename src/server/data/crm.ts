import { asc } from "drizzle-orm";
import { z } from "zod";

import { current, v1 } from "../db/fixtures/crm.ts";
import { projectCrm } from "./core-projectors.ts";
import type { CrmData } from "./crm.types.ts";
import { loadMetricCollections } from "./metric-collections.ts";
import { joinMetric, type MetricUnit } from "./metric-projection.ts";
import { readSource } from "./source.ts";

const inputSchema = z.object({
  variant: z.enum(["current", "v1"]),
  renderedAt: z.iso.datetime(),
  id: z.string().optional(),
});
type Input = z.infer<typeof inputSchema>;
export async function demoCrm(input: Input): Promise<CrmData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  return projectCrm(structuredClone({ current, v1, variant, renderedAt }), input);
}
export async function dbCrm(input: Input): Promise<CrmData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  const { getDatabase } = await import("../db/client.server.ts");
  const s = await import("../db/core-entity-schema.ts");
  const db = getDatabase();
  const metrics = await loadMetricCollections("core-crm");
  const crmConfigProjectRevenueChartData = (
    await db
      .select()
      .from(s.crmV1CrmConfigProjectRevenueChartData)
      .orderBy(
        asc(s.crmV1CrmConfigProjectRevenueChartData.position),
        asc(s.crmV1CrmConfigProjectRevenueChartData.recordKey),
      )
  ).map((row) => ({
    name: row.name,
    actual: Number(row.actual),
    target: Number(row.target),
    remaining: Number(row.remaining),
  }));
  const crmConfigRegionSalesData = (
    await db
      .select()
      .from(s.crmV1CrmConfigRegionSalesData)
      .orderBy(asc(s.crmV1CrmConfigRegionSalesData.position), asc(s.crmV1CrmConfigRegionSalesData.recordKey))
  ).map((row) => ({
    region: row.region,
    sales: Number(row.sales),
    percentage: Number(row.percentage),
    growth: joinMetric(row.growthTemplate, false, [
      {
        value: row.growth,
        unit: row.growthUnit as MetricUnit,
        currency: row.growthUnit === "currency" ? "USD" : null,
        prefix: row.growthPrefix,
        decimals: row.growthDecimals,
        grouped: row.growthGrouped,
        scale: row.growthScale,
        leadingDecimal: row.growthLeadingDecimal,
      },
    ]) as string,
    isPositive: row.isPositive,
  }));
  const crmConfigActionItems = (
    await db
      .select()
      .from(s.crmV1CrmConfigActionItems)
      .orderBy(asc(s.crmV1CrmConfigActionItems.position), asc(s.crmV1CrmConfigActionItems.recordKey))
  ).map((row) => ({
    id: Number(row.id),
    title: row.title,
    desc: row.desc,
    due: row.due,
    priority: row.priority,
    checked: row.checked,
  }));
  const crmConfigRecentLeadsData = (
    await db
      .select()
      .from(s.crmV1CrmConfigRecentLeadsData)
      .orderBy(asc(s.crmV1CrmConfigRecentLeadsData.position), asc(s.crmV1CrmConfigRecentLeadsData.recordKey))
  ).map((row) => ({
    id: row.id,
    name: row.name,
    company: row.company,
    status: row.status,
    source: row.source,
    lastActivity: row.lastActivity,
  }));
  const recordsOpportunities = (
    await db
      .select()
      .from(s.crmCurrentRecordsOpportunities)
      .orderBy(asc(s.crmCurrentRecordsOpportunities.position), asc(s.crmCurrentRecordsOpportunities.recordKey))
  ).map((row) => ({
    id: row.id,
    account: row.account,
    stage: row.stage,
    priority: Number(row.priority),
    health: row.health,
    value: joinMetric(row.valueTemplate, false, [
      {
        value: row.value,
        unit: row.valueUnit as MetricUnit,
        currency: row.valueUnit === "currency" ? "USD" : null,
        prefix: row.valuePrefix,
        decimals: row.valueDecimals,
        grouped: row.valueGrouped,
        scale: row.valueScale,
        leadingDecimal: row.valueLeadingDecimal,
      },
    ]) as string,
  }));
  const taskRemindersSummary = (
    await db
      .select()
      .from(s.crmCurrentTaskRemindersSummary)
      .orderBy(asc(s.crmCurrentTaskRemindersSummary.position), asc(s.crmCurrentTaskRemindersSummary.recordKey))
  ).map((row) => ({
    value1: row.value1,
    value2: row.value2,
    value3: row.value3,
    value4: row.value4,
    value5: row.value5,
    value6: row.value6,
  }));
  return projectCrm(
    {
      variant,
      renderedAt,
      current: {
        kpiCardsMetrics: (metrics["current.kpiCardsMetrics"] ?? []) as CrmData["current"]["kpiCardsMetrics"],
        pipelineActivityPipelineChartValues: (metrics["current.pipelineActivityPipelineChartValues"] ?? []).map((row) =>
          Number(row.value),
        ) as CrmData["current"]["pipelineActivityPipelineChartValues"],
        recordsOpportunities: recordsOpportunities,
        pipelineActivitySummary: (metrics["current.pipelineActivitySummary"] ??
          []) as CrmData["current"]["pipelineActivitySummary"],
        taskRemindersSummary: taskRemindersSummary,
        pipelineActivityTotals: (metrics["current.pipelineActivityTotals"] ??
          []) as CrmData["current"]["pipelineActivityTotals"],
        taskRemindersGoal: (metrics["current.taskRemindersGoal"] ?? []) as CrmData["current"]["taskRemindersGoal"],
      },
      v1: {
        crmConfigLeadsChartData: (metrics["v1.crmConfigLeadsChartData"] ??
          []) as CrmData["v1"]["crmConfigLeadsChartData"],
        crmConfigProposalsChartData: (metrics["v1.crmConfigProposalsChartData"] ??
          []) as CrmData["v1"]["crmConfigProposalsChartData"],
        crmConfigRevenueChartData: (metrics["v1.crmConfigRevenueChartData"] ??
          []) as CrmData["v1"]["crmConfigRevenueChartData"],
        crmConfigLeadsBySourceChartData: (metrics["v1.crmConfigLeadsBySourceChartData"] ??
          []) as CrmData["v1"]["crmConfigLeadsBySourceChartData"],
        crmConfigProjectRevenueChartData: crmConfigProjectRevenueChartData,
        crmConfigSalesPipelineChartData: (metrics["v1.crmConfigSalesPipelineChartData"] ??
          []) as CrmData["v1"]["crmConfigSalesPipelineChartData"],
        crmConfigRegionSalesData: crmConfigRegionSalesData,
        crmConfigActionItems: crmConfigActionItems,
        crmConfigRecentLeadsData: crmConfigRecentLeadsData,
        insightCardsSummary: (metrics["v1.insightCardsSummary"] ?? []) as CrmData["v1"]["insightCardsSummary"],
        operationalCardsSummary: (metrics["v1.operationalCardsSummary"] ??
          []) as CrmData["v1"]["operationalCardsSummary"],
        overviewCardsSummary: (metrics["v1.overviewCardsSummary"] ?? []) as CrmData["v1"]["overviewCardsSummary"],
      },
    },
    input,
  );
}
export async function readCrm(input: Input) {
  return readSource(
    () => demoCrm(input),
    () => dbCrm(input),
  );
}
