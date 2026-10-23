import { ChevronRight, Zap } from "lucide-react";
import { siClaude, siLinear, siResend } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { CardContent } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function UpcomingTransactions() {
  const summary = useDashboardData().upcomingTransactionsSummary[0];

  const transactions = useDashboardData().upcomingTransactionsTransactions.map((row) => ({
    ...row,
    icon: { siClaude, siResend, siLinear }[row.icon as "siClaude" | "siResend" | "siLinear"],
  }));

  return (
    <Card className="h-full">
      <SectionHeader title="Upcoming Bills & Payments" />
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline text-2xl leading-tight tracking-tight">
              <span className="font-normal">{summary.value1}</span>
              <span className="text-muted-foreground text-xl">{summary.value2}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-none">
              You have <span className="text-foreground font-medium">{summary.value3}</span> upcoming bills
            </p>
          </div>
          <div className="border-border bg-muted flex max-w-full items-center gap-2 rounded-md border px-2 py-1.5 text-sm">
            <Zap className="fill-primary text-primary size-4" />
            <span className="text-muted-foreground">
              Scheduled autopay: <span className="text-foreground font-medium">{summary.value4}</span>
            </span>
          </div>
        </div>

        <ItemGroup>
          {transactions.map((transaction) => (
            <Item key={transaction.id} variant="outline" size="xs">
              <ItemMedia>
                <div className="bg-background grid size-9 place-items-center rounded-md border">
                  <SimpleIcon icon={transaction.icon} />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{transaction.title}</ItemTitle>
                <ItemDescription>{transaction.date}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="text-muted-foreground size-5" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
