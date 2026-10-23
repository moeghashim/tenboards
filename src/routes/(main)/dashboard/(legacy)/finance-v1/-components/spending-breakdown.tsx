import { CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function SpendingBreakdown() {
  const expenses = useDashboardData().spendingBreakdownExpenses;

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  return (
    <Card>
      <SectionHeader title="Spending Breakdown" description="Expense distribution by category." />
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-2xl font-medium">{formatCurrency(total, { noDecimals: true })}</div>
        </div>

        <div className="space-y-2">
          {expenses.map((item) => {
            const pct = Math.round((item.amount / total) * 100);
            return (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between gap-2 text-sm">
                  <span>{item.label}</span>
                  <span className="tabular-nums">{pct}%</span>
                </div>
                <div aria-hidden="true" className="bg-muted h-1.5 rounded-sm">
                  <div className="bg-primary h-full rounded-sm" style={{ width: `${(item.amount / total) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
