import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";

export function DriversCoverageTriage() {
  const leverOptions = [
    {
      key: "deal",
      label: "+1 enterprise deal",
      value: "+$72,133 weighted",
      context: "32% of gap",
    },
    {
      key: "conversion",
      label: "+5pp conversion",
      value: "+$49,182/month",
      context: "22% of gap",
    },
    {
      key: "cycle",
      label: "-4d cycle",
      value: "+$90,167/day",
      context: "40% of gap",
    },
  ] as const;

  return (
    <Card>
      <SectionHeader title="Coverage Triage" description="Decision ladder for this forecast cycle" />
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive" className="rounded-md font-medium">
            At Risk
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            1.9x / 3.0x
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            Gap $222,930
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            4 deals • ETA 10d
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
              Owner: <span className="text-foreground font-medium">Leila Zhang</span>
            </span>
            <span className="text-muted-foreground">
              Focus: <span className="text-foreground">top gap-filling deals</span>
            </span>
            <span className="text-muted-foreground">
              Due: <span className="text-foreground">before next forecast call</span>
            </span>
          </div>
          <Button variant="secondary" size="sm" className="h-7 px-3 text-xs">
            Open top 5 deals
          </Button>
        </div>

        <div className="bg-muted space-y-1 rounded-md border border-dashed px-3 py-2.5">
          <p className="text-muted-foreground text-xs">
            Fastest path: <span className="text-foreground font-medium">-4d cycle</span> recovers 40% of gap.
          </p>
          <p className="text-muted-foreground text-xs">
            Priority sequence: <span className="text-foreground">cycle time</span> before net-new volume.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
