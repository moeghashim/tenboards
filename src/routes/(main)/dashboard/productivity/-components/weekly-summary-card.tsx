import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function WeeklySummaryCard() {
  const goals = useDashboardData().goals;
  return (
    <Card>
      <SectionHeader
        title="This Week"
        actions={
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all
          </Button>
        }
      />
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">{goals.encouragement}</p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">{`${goals.completed} of ${goals.total} goals completed`}</div>
          <Progress aria-label="Weekly goals completed" value={goals.progress} />
        </div>
      </CardContent>
    </Card>
  );
}
