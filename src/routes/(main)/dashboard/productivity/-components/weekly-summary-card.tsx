import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";

export function WeeklySummaryCard() {
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
        <p className="text-muted-foreground">You’re doing great. Keep the momentum going.</p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">4 of 6 goals completed</div>
          <Progress aria-label="Weekly goals completed" value={66} />
        </div>
      </CardContent>
    </Card>
  );
}
