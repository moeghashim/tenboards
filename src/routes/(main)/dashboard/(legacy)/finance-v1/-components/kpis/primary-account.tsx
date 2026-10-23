import { Button } from "@/components/ui/button";

import { StatCard } from "../../../../-components/dashboard/cards";
import { useDashboardData } from "../data-context";
export function PrimaryAccount() {
  const summary = useDashboardData().kpisPrimaryAccountSummary[0];

  return (
    <StatCard
      label="Primary Account"
      value={summary.value1}
      help={
        <>
          <p>Available balance</p>
          <div className="mt-3 flex gap-2">
            <Button className="flex-1" size="sm">
              Pay
            </Button>
            <Button className="flex-1" size="sm" variant="outline">
              Request
            </Button>
          </div>
        </>
      }
    />
  );
}
