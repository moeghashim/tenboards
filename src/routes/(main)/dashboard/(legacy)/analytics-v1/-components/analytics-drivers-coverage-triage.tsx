import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function DriversCoverageTriage() {
  const assignment = useDashboardData().coverageAssignment[0];
  const summary = useDashboardData().analyticsDriversCoverageTriageSummary[0];

  const leverOptions = useDashboardData().analyticsDriversCoverageTriageLeverOptions;

  return (
    <Card>
      <SectionHeader title="Coverage Triage" description="Decision ladder for this forecast cycle" />
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive" className="rounded-md font-medium">
            {summary.status}
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            {summary.value1}
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            {summary.value2}
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            {summary.value3}
          </Badge>
        </div>

        <p className="text-muted-foreground text-xs">
          Coverage below target. Prioritize qualified volume and shorter cycle time.
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {leverOptions.map((lever) => (
            <div key={lever.key} className="bg-muted space-y-1 rounded-md border px-2.5 py-2">
              <p className="text-muted-foreground text-xs">{lever.label}</p>
              <p className="text-sm font-semibold tabular-nums">{lever.value}</p>
              <p className="text-muted-foreground text-xs">{lever.context}</p>
            </div>
          ))}
        </div>

        <div className="bg-muted flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              Owner: <span className="text-foreground font-medium">{assignment.owner}</span>
            </span>
            <span className="text-muted-foreground">
              Focus: <span className="text-foreground">{assignment.focus}</span>
            </span>
            <span className="text-muted-foreground">
              Due: <span className="text-foreground">{assignment.due}</span>
            </span>
          </div>
          <Button variant="secondary" size="sm" className="h-7 px-3 text-xs">
            Open top 5 deals
          </Button>
        </div>

        <div className="bg-muted space-y-1 rounded-md border border-dashed px-3 py-2.5">
          <p className="text-muted-foreground text-xs">
            Fastest path: <span className="text-foreground font-medium">{summary.value4}</span> {summary.value5}
          </p>
          <p className="text-muted-foreground text-xs">
            Priority sequence: <span className="text-foreground">cycle time</span> before net-new volume.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
