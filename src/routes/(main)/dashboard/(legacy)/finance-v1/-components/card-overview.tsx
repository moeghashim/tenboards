import { Home, Receipt, Sparkles, Zap } from "lucide-react";
import { siApple, siMastercard } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { formatDemoDate } from "@/routes/(main)/dashboard/-components/finance-demo-dates";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function CardOverview() {
  const summary = useDashboardData().cardOverviewSummary[0];

  const upcomingPayments = useDashboardData().cardOverviewUpcomingPayments.map((row) => ({
    ...row,
    icon: { Home, Zap, Sparkles, Receipt }[row.icon as "Home" | "Zap" | "Sparkles" | "Receipt"],
  }));

  return (
    <Card>
      <SectionHeader
        title="My Card"
        description={`1 of 4 demo cards · Statement dated ${formatDemoDate(useDashboardData().statementDate)}`}
      />
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full place-items-center">
            <div className="bg-primary relative flex aspect-8/5 w-full max-w-100 flex-col justify-between overflow-hidden rounded-xl p-6">
              <div className="flex items-start justify-between">
                <SimpleIcon
                  icon={{ apple: siApple }[summary.brandIcon as "apple"]}
                  className="fill-primary-foreground size-5 sm:size-8"
                />
              </div>

              <div className="space-y-1">
                <p className="text-primary-foreground font-mono text-sm tracking-[0.15em] sm:text-lg">
                  {summary.value1}
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <p className="text-primary-foreground text-sm font-medium">{summary.value2}</p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-primary-foreground text-xs">Valid Thru</p>
                      <p className="text-primary-foreground font-mono text-xs">{summary.value3}</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground text-xs">CVV</p>
                      <p className="text-primary-foreground font-mono text-xs">•••</p>
                    </div>
                  </div>
                </div>
                <SimpleIcon
                  icon={{ mastercard: siMastercard }[summary.networkIcon as "mastercard"]}
                  className="fill-primary-foreground size-7 sm:size-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Card type</span>
              <span className="font-medium tabular-nums">{summary.cardType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Billing cycle</span>
              <span className="font-medium tabular-nums">{summary.value4}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Card Limit</span>
              <span className="font-medium tabular-nums">{summary.value5}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-medium tabular-nums">{summary.value6}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Button className="w-full" size="sm">
              Manage Card
            </Button>

            <Button className="w-full" variant="outline" size="sm">
              Add Card
            </Button>
          </div>
          <Separator />

          <div className="space-y-4">
            <h3 className="text-base font-medium">Upcoming Payments</h3>

            <div className="space-y-4">
              {upcomingPayments.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-2">
                  <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                    <transaction.icon className="text-muted-foreground size-5" />
                  </div>
                  <div className="flex w-full min-w-0 flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{transaction.title}</p>
                      <p className="text-muted-foreground text-xs">{transaction.date}</p>
                    </div>
                    <div>
                      <span className="text-danger text-sm leading-none font-medium tabular-nums">
                        −
                        {formatCurrency(transaction.amount, {
                          noDecimals: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" size="sm" variant="outline">
              View All Payments
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
