import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function ActionsManagerQueue() {
  const summary = useDashboardData().analyticsActionsManagerQueueSummary[0];

  const NEXT_INTERVENTIONS = useDashboardData().analyticsActionsManagerQueueNextInterventions;

  return (
    <Card className="h-full">
      <SectionHeader title="Manager Action Queue" description="Escalate, coach, and reforecast before commit call" />

      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Actionable deals" value={summary.value1} />
            <StatCard label="Revenue in play" value={formatCurrency(summary.value2, { noDecimals: true })} mono />
            <StatCard label="Owners engaged" value={summary.value3} />
            <StatCard label="Median risk" value={summary.value4} mono />
          </div>

          <div className="bg-muted space-y-2 rounded-md border px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">Intervention mix</p>
              <Badge variant="outline" className="h-5 px-2 text-xs tabular-nums">
                Escalate {formatCurrency(summary.value5, { noDecimals: true })}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="bg-background flex flex-wrap items-center justify-between rounded-md border px-2.5 py-1.5">
                <span className="text-xs">Escalate</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {summary.value6}
                  {formatCurrency(summary.value7, { noDecimals: true })}
                </span>
              </div>
              <div className="bg-background flex flex-wrap items-center justify-between rounded-md border px-2.5 py-1.5">
                <span className="text-xs">Coach</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {summary.value8}
                  {formatCurrency(summary.value9, { noDecimals: true })}
                </span>
              </div>
              <div className="bg-background flex flex-wrap items-center justify-between rounded-md border px-2.5 py-1.5">
                <span className="text-xs">Reforecast</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {summary.value10}
                  {formatCurrency(summary.value11, { noDecimals: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted space-y-2 rounded-md border px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">Manager focus</p>
              <span className="text-muted-foreground text-xs tabular-nums">This forecast cycle</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="bg-background flex flex-wrap items-center justify-between gap-2 rounded-md border px-2.5 py-1.5">
                <span>Coach queue</span>
                <span className="text-muted-foreground tabular-nums">
                  {summary.value12}
                  {formatCurrency(summary.value13, { noDecimals: true })}
                </span>
              </div>

              <div className="bg-background flex flex-wrap items-center justify-between gap-2 rounded-md border px-2.5 py-1.5">
                <span>Primary owner</span>
                <span className="text-muted-foreground tabular-nums">{summary.value14}</span>
              </div>

              <div className="bg-background flex flex-wrap items-center justify-between gap-2 rounded-md border px-2.5 py-1.5">
                <span>Stale pipeline</span>
                <span className="text-muted-foreground tabular-nums">
                  {summary.value15}
                  {formatCurrency(summary.value16, { noDecimals: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-muted-foreground text-xs">Next interventions</p>

            {NEXT_INTERVENTIONS.map((item) => (
              <div key={`${item.priority}-${item.dealId}`} className="space-y-1 rounded-md border px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.dealId}</span>
                  <Badge variant="outline" className="h-5 px-2 text-xs">
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {item.owner} · {item.risk} risk
                </p>
                <p className="text-xs">{item.recommendation}</p>
              </div>
            ))}
          </div>

          <div className="bg-muted flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2">
            <span className="text-muted-foreground text-xs">No-action monitor</span>
            <span className="text-xs font-medium tabular-nums">{summary.value17}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-muted rounded-md border px-2.5 py-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={mono ? "text-base font-semibold tabular-nums" : "text-base font-semibold"}>{value}</p>
    </div>
  );
}
