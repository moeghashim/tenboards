import type { ReactNode } from "react";

import { createLibrary, defineComponent } from "@openuidev/lang-core";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ComponentName, descriptions, limits, schemas } from "@/lib/assistant/registry";
import { chartAxis, chartGrid, chartSeries, DashboardChart, seriesConfig, useChartMotion } from "@/lib/charts/theme";

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
function DataTable({ columns, rows }: z.infer<typeof schemas.Table>) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users scroll this bounded table region.
    <section className="max-w-full overflow-x-auto rounded-lg border" tabIndex={0} aria-label="Response data table">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, i) => (
              <TableHead key={`${i}-${column}`}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
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
    <section className="min-w-0 space-y-3" aria-label={title}>
      <h3 className="font-medium">{title}</h3>
      <DashboardChart config={config} className="h-56 sm:h-64">
        {kind === "bar" ? (
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="label" {...chartAxis} />
            <YAxis {...chartAxis} />
            {series.map((item, i) => (
              <Bar key={item.label} dataKey={`s${i}`} fill={chartSeries[i].color} {...motion} />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="label" {...chartAxis} />
            <YAxis {...chartAxis} />
            {series.map((item, i) => (
              <Line
                key={item.label}
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
        columns={["Period", ...series.map((item) => item.label)]}
        rows={labels.map((label, i) => [label, ...series.map((item) => item.values[i])])}
      />
    </section>
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
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>{p.title}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {p.children.map((child, i) => (
              <div key={i}>{renderNode(child)}</div>
            ))}
          </CardContent>
        </Card>
      );
    }
    case "Stat": {
      const p = schemas.Stat.parse(props);
      return (
        <dl className="space-y-1">
          <dt className="text-muted-foreground">{p.label}</dt>
          <dd className="text-2xl font-medium tabular-nums">{p.value}</dd>
          <dd className="text-muted-foreground text-xs">{p.detail}</dd>
        </dl>
      );
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
      return <DataTable columns={p.columns} rows={p.rows} />;
    }
    case "Chart": {
      const p = schemas.Chart.parse(props);
      return <ResponseChart title={p.title} kind={p.kind} labels={p.labels} series={p.series} />;
    }
  }
}
export const assistantLibrary = createLibrary({
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
