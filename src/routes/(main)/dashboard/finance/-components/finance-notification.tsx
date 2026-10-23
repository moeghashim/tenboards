import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

import { useDashboardData } from "./data-context";

export function FinanceNotification() {
  const summary = useDashboardData().financeNotificationSummary[0];

  return (
    <Item className="bg-card rounded-xl" variant="outline">
      <ItemMedia variant="icon">
        <TrendingUp />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <h2 className="text-sm font-medium">Credit score updated</h2>
        </ItemTitle>
        <ItemDescription>{summary.value1}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          View details
        </Button>
      </ItemActions>
    </Item>
  );
}
