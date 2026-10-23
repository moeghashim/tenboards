import { Button } from "@/components/ui/button";

import { StatCard } from "../../../../-components/dashboard/cards";
export function PrimaryAccount() {
  return (
    <StatCard
      label="Primary Account"
      value="$12,450"
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
