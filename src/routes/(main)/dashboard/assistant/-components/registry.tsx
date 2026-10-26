import type { ReactNode } from "react";

import { createLibrary, defineComponent } from "@openuidev/lang-core";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";

import {
  chartAxis,
  chartCursor,
  chartGrid,
  chartSeries,
  DashboardCard,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  SectionHeader,
  StatCard,
  seriesConfig,
  useChartMotion,
} from "@/components/blocks";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ComponentName, descriptions, limits, schemas } from "@/lib/assistant/registry";

const element = z
  .object({
    type: z.literal("element"),
    typeName: z.enum(Object.keys(schemas) as [ComponentName, ...ComponentName[]]),
    props: z.record(z.string(), z.unknown()),
    partial: z.literal(false),
    statementId: z.string().optional(),
    hasDynamicProps: z.literal(false).optional(),
  })
  .strict();
export function validateEvaluatedProps(name: ComponentName, props: unknown) {
  let count = 0;
  function check(current: ComponentName, value: unknown, depth: number): unknown {
    if (++count > limits.nodes || depth > limits.depth) throw new Error("Invalid response.");
    const parsed = schemas[current].parse(value);
    if ("children" in parsed)
      for (const child of parsed.children) {
        const node = element.parse(child);
        check(node.typeName, node.props, depth + 1);
      }
    return parsed;
  }
  return check(name, props, 1);
}
function DataTable({
  columns,
  rows,
  label = "Response data table",
}: z.infer<typeof schemas.Table> & { label?: string }) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users scroll this bounded table region.
    <section className="max-w-full overflow-x-auto" tabIndex={0} aria-label={label}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, i) => (
              <TableHead className="h-8 px-3" key={`${i}-${column}`}>
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell className="px-3 py-2" key={j}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
function ResponseChart({ title, kind, labels, series }: z.infer<typeof schemas.Chart>) {
  const motion = useChartMotion();
  const config = seriesConfig(Object.fromEntries(series.map((item, index) => [`s${index}`, item.label])));
  const data = labels.map((label, index) => ({
    label,
    ...Object.fromEntries(series.map((item, n) => [`s${n}`, item.values[index]])),
  }));
  return (
    <DashboardCard density="compact" aria-label={title}>
      <SectionHeader title={title} level={3} />
      <CardContent className="space-y-3">
        <DashboardChart config={config} className="h-56 sm:h-64">
          {kind === "bar" ? (
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="label" {...chartAxis} />
              <YAxis {...chartAxis} />
              <Tooltip content={<DashboardTooltip />} cursor={chartCursor} {...motion} />
              <Legend content={<DashboardLegend config={config} />} />
              {series.map((_, i) => (
                <Bar key={`s${i}`} dataKey={`s${i}`} fill={chartSeries[i].color} {...motion} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data} accessibilityLayer>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="label" {...chartAxis} />
              <YAxis {...chartAxis} />
              <Tooltip content={<DashboardTooltip />} cursor={chartCursor} {...motion} />
              <Legend content={<DashboardLegend config={config} />} />
              {series.map((_, i) => (
                <Line
                  key={`s${i}`}
                  dataKey={`s${i}`}
                  stroke={chartSeries[i].color}
                  strokeDasharray={chartSeries[i].strokeDasharray}
                  strokeWidth={2}
                  dot
                  {...motion}
                />
              ))}
            </LineChart>
          )}
        </DashboardChart>
        <DataTable
          label={`${title} data`}
          columns={["Period", ...series.map((item) => item.label)]}
          rows={labels.map((label, i) => [label, ...series.map((item) => item.values[i])])}
        />
      </CardContent>
    </DashboardCard>
  );
}
const toneClasses = {
  neutral: "bg-muted text-foreground",
  success: "bg-success-surface text-success",
  warning: "bg-warning-surface text-warning",
  info: "bg-info-surface text-info",
};
function RegisteredNode({
  name,
  props,
  renderNode,
}: {
  name: ComponentName;
  props: unknown;
  renderNode: (node: unknown) => ReactNode;
}) {
  try {
    validateEvaluatedProps(name, props);
  } catch {
    return <p className="text-danger">This response block could not be displayed safely.</p>;
  }
  switch (name) {
    case "Stack": {
      const p = schemas.Stack.parse(props);
      return (
        <div className="min-w-0 space-y-5">
          {p.children.map((child, i) => (
            <div key={i} className="min-w-0">
              {renderNode(child)}
            </div>
          ))}
        </div>
      );
    }
    case "Text":
      return <p className="max-w-prose whitespace-pre-wrap break-words">{schemas.Text.parse(props).text}</p>;
    case "Card": {
      const p = schemas.Card.parse(props);
      return (
        <DashboardCard
          density="compact"
          className="[&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:ring-0 [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:py-0 [&_[data-slot=card]_[data-slot=card-content]]:px-0 [&_[data-slot=card]_[data-slot=card-header]]:px-0"
        >
          <SectionHeader title={p.title} level={3} />
          <CardContent className="space-y-4">
            {p.children.map((child, i) => (
              <div key={i} className="min-w-0">
                {renderNode(child)}
              </div>
            ))}
          </CardContent>
        </DashboardCard>
      );
    }
    case "Stat": {
      const p = schemas.Stat.parse(props);
      return <StatCard label={p.label} value={p.value} help={p.detail} level={3} density="compact" />;
    }
    case "Badge": {
      const p = schemas.Badge.parse(props);
      return <Badge className={toneClasses[p.tone]}>{p.label}</Badge>;
    }
    case "List":
      return (
        <ul className="list-disc space-y-2 pl-5">
          {schemas.List.parse(props).items.map((item, i) => (
            <li key={i} className="break-words">
              {item}
            </li>
          ))}
        </ul>
      );
    case "Table": {
      const p = schemas.Table.parse(props);
      return (
        <DashboardCard density="compact" className="overflow-hidden">
          <DataTable columns={p.columns} rows={p.rows} />
        </DashboardCard>
      );
    }
    case "Chart": {
      const p = schemas.Chart.parse(props);
      return <ResponseChart title={p.title} kind={p.kind} labels={p.labels} series={p.series} />;
    }
  }
}
export function getAssistantLibrary() {
  return createLibrary({
    id: "tenboards-assistant-v1",
    root: "Stack",
    components: Object.entries(schemas).map(([name, props]) =>
      defineComponent({
        name,
        props,
        description: descriptions[name as ComponentName],
        component: ({ props: values, renderNode }: { props: unknown; renderNode: (node: unknown) => ReactNode }) => (
          <RegisteredNode name={name as ComponentName} props={values} renderNode={renderNode} />
        ),
      }),
    ),
  });
}
