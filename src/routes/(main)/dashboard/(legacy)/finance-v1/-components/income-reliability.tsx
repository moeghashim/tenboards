import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function IncomeReliability() {
  const summary = useDashboardData().incomeReliabilitySummary[0];

  return (
    <Card>
      <SectionHeader title="Income Reliability" description="How consistent your income has been recently." />
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-0.5">
          <p className="text-xl font-medium">{summary.value1}</p>
          <p className="text-muted-foreground text-xs">Based on last 6 months of income</p>
        </div>
        <Separator />
        <div className="flex flex-wrap justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-sm font-medium tabular-nums">Fixed Income</p>
            <p className="text-muted-foreground text-xs">{summary.value2}</p>
          </div>
          <p className="text-sm font-medium tabular-nums">{formatCurrency(summary.value3, { noDecimals: true })}</p>
        </div>
        <Separator />
        <div className="flex flex-wrap justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-sm font-medium tabular-nums">Variable Income</p>
            <p className="text-muted-foreground text-xs">Fluctuating sources</p>
          </div>
          <p className="text-sm font-medium tabular-nums">{formatCurrency(summary.value4, { noDecimals: true })}</p>
        </div>
        <Separator />
        <p className="text-muted-foreground text-xs">
          Consistency trend: <span className="text-success font-medium">{summary.value5}</span>
        </p>
      </CardContent>
    </Card>
  );
}
