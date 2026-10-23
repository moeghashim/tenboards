import { CardContent } from "@/components/ui/card";

import { DashboardCard, SectionHeader } from "../../-components/dashboard/cards";

const sources = [
  { label: "Primary salary", share: 68, value: "$4,560.00" },
  { label: "Freelance projects", share: 21, value: "$1,412.00" },
  { label: "Dividends and interest", share: 11, value: "$765.00" },
];
export function IncomeBreakdown() {
  return (
    <DashboardCard>
      <SectionHeader title="Income sources" />
      <CardContent className="space-y-3">
        {sources.map((source) => (
          <div key={source.label} className="space-y-1">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span>
                {source.label} · {source.share}%
              </span>
              <span className="font-medium tabular-nums">{source.value}</span>
            </div>
            <div aria-hidden="true" className="bg-muted h-1.5 rounded-sm">
              <div className="bg-primary h-full rounded-sm" style={{ width: `${source.share}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </DashboardCard>
  );
}
