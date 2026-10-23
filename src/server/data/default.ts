import { asc } from "drizzle-orm";
import { z } from "zod";

import { current, v1 } from "../db/fixtures/default.ts";
import { projectDefault } from "./core-projectors.ts";
import type { DefaultData } from "./default.types.ts";
import { loadMetricCollections } from "./metric-collections.ts";
import { readSource } from "./source.ts";

const inputSchema = z.object({
  variant: z.enum(["current", "v1"]),
  renderedAt: z.iso.datetime(),
  id: z.string().optional(),
  range: z.enum(["90d", "30d", "7d"]).optional(),
});
type Input = z.infer<typeof inputSchema>;
export async function demoDefault(input: Input): Promise<DefaultData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  return projectDefault(structuredClone({ current, v1, variant, renderedAt }), input);
}
export async function dbDefault(input: Input): Promise<DefaultData> {
  const { variant, renderedAt } = inputSchema.parse(input);
  const { getDatabase } = await import("../db/client.server.ts");
  const s = await import("../db/core-entity-schema.ts");
  const db = getDatabase();
  const metrics = await loadMetricCollections("core-default");
  const reviewers = (
    await db.select().from(s.defaultReviewers).orderBy(asc(s.defaultReviewers.position), asc(s.defaultReviewers.value))
  ).map(({ value, label }) => ({ value, label }));
  const recordsCustomers = (
    await db
      .select()
      .from(s.defaultCurrentRecordsCustomers)
      .orderBy(asc(s.defaultCurrentRecordsCustomers.position), asc(s.defaultCurrentRecordsCustomers.recordKey))
  ).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    plan: row.plan,
    status: row.status,
    billing: row.billing,
    joined: row.joined,
  }));
  const recordsProposals = (
    await db
      .select()
      .from(s.defaultV1RecordsProposals)
      .orderBy(asc(s.defaultV1RecordsProposals.position), asc(s.defaultV1RecordsProposals.recordKey))
  ).map((row) => ({
    id: Number(row.id),
    header: row.header,
    type: row.type,
    status: row.status,
    target: row.target,
    limit: row.limit,
    reviewer: row.reviewer,
  }));
  const chartAreaInteractiveReference = (
    await db
      .select()
      .from(s.defaultV1ChartAreaInteractiveReference)
      .orderBy(
        asc(s.defaultV1ChartAreaInteractiveReference.position),
        asc(s.defaultV1ChartAreaInteractiveReference.recordKey),
      )
  ).map((row) => ({
    id: row.id,
    date: row.date,
  }));
  return projectDefault(
    {
      variant,
      renderedAt,
      current: {
        performanceOverviewChartValues: (metrics["current.performanceOverviewChartValues"] ??
          []) as DefaultData["current"]["performanceOverviewChartValues"],
        recordsCustomers: recordsCustomers,
        metricCardsSummary: (metrics["current.metricCardsSummary"] ??
          []) as DefaultData["current"]["metricCardsSummary"],
        subscriberOverviewSummary: (metrics["current.subscriberOverviewSummary"] ??
          []) as DefaultData["current"]["subscriberOverviewSummary"],
        performanceOverviewTiming: (metrics["current.performanceOverviewTiming"] ??
          []) as DefaultData["current"]["performanceOverviewTiming"],
      },
      v1: {
        reviewers,
        chartAreaInteractiveChartData: (metrics["v1.chartAreaInteractiveChartData"] ??
          []) as DefaultData["v1"]["chartAreaInteractiveChartData"],
        proposalSectionsTableColumnsChartData: (metrics["v1.proposalSectionsTableColumnsChartData"] ??
          []) as DefaultData["v1"]["proposalSectionsTableColumnsChartData"],
        recordsProposals: recordsProposals,
        proposalSectionsTableColumnsSummary: (metrics["v1.proposalSectionsTableColumnsSummary"] ??
          []) as DefaultData["v1"]["proposalSectionsTableColumnsSummary"],
        proposalSectionsTableTableSummary: (metrics["v1.proposalSectionsTableTableSummary"] ??
          []) as DefaultData["v1"]["proposalSectionsTableTableSummary"],
        sectionCardsSummary: (metrics["v1.sectionCardsSummary"] ?? []) as DefaultData["v1"]["sectionCardsSummary"],
        chartAreaInteractiveReference: chartAreaInteractiveReference,
      },
    },
    input,
  );
}
export async function readDefault(input: Input) {
  return readSource(
    () => demoDefault(input),
    () => dbDefault(input),
  );
}
