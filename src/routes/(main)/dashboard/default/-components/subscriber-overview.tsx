import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { SectionHeader } from "../../-components/dashboard/cards";
import customersData from "./data.json";
import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

const customers = customersData as RecentCustomerRow[];

export function SubscriberOverview() {
  return (
    <Card>
      <SectionHeader
        title="18,426 Customers"
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
