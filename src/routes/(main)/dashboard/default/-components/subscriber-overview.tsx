import { Download } from "lucide-react";

import { SectionHeader } from "@/components/blocks";
import { Button } from "@/components/ui/button";
// biome-ignore lint/style/noRestrictedImports: Existing specialized card layout preserves its density/size semantics; DashboardCard migration needs separate visual review.
import { Card, CardContent } from "@/components/ui/card";

import { useDashboardData } from "./data-context";
import { RecentCustomersTable } from "./recent-customers-table/table";

export function SubscriberOverview() {
  const summary = useDashboardData().subscriberOverviewSummary[0];

  const customers = useDashboardData().recordsCustomers;
  return (
    <Card>
      <SectionHeader
        title={summary.value1}
        description="Recent customer records with plan, billing, status, and signup activity."
        actions={
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
        }
      />

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
