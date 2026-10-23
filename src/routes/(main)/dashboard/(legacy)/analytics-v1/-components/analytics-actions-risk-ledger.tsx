import * as React from "react";

import { type ColumnDef, type SortingState, useTable } from "@tanstack/react-table";

import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type DataTableFeatures, dataTableFeatures } from "@/lib/data-table-features";
import { formatCurrency } from "@/lib/utils";

import { DashboardCard as Card, SectionHeader } from "../../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

type LedgerPriority = "Escalate" | "Coach" | "Reforecast" | null;

type LedgerRow = {
  id: number;
  account: string;
  dealId: string;
  stage: string;
  blocker: string;
  owner: string;
  idleDays: number;
  closeVariance: string;
  priority: LedgerPriority;
  nextAction: string;
  riskScore: number;
};

const priorityTone: Record<Exclude<LedgerPriority, null>, string> = {
  Escalate: "border-danger/30 bg-danger/10 text-danger",
  Coach: "border-primary/35 bg-primary/10 text-primary",
  Reforecast: "border-warning/30 bg-warning/10 text-warning",
};

const ledgerColumns: ColumnDef<DataTableFeatures, LedgerRow>[] = [
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{row.original.account}</p>
        <p className="text-muted-foreground text-xs">
          {row.original.dealId} · {row.original.stage}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "blocker",
    header: "Blocker",
    cell: ({ row }) => <div className="max-w-44 text-xs whitespace-normal">{row.original.blocker}</div>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => <span className="text-xs">{row.original.owner}</span>,
  },
  {
    accessorKey: "idleDays",
    header: "Idle (days)",
    cell: ({ row }) => <span className="text-xs tabular-nums">{row.original.idleDays}d</span>,
  },
  {
    accessorKey: "closeVariance",
    header: "Close variance",
    cell: ({ row }) => <span className="text-xs tabular-nums">{row.original.closeVariance}</span>,
  },
  {
    accessorKey: "nextAction",
    header: "Next action",
    cell: ({ row }) => (
      <div className="flex max-w-64 flex-col gap-1 whitespace-normal">
        {row.original.priority ? (
          <Badge variant="outline" className={cn("text-xs", priorityTone[row.original.priority])}>
            {row.original.priority}
          </Badge>
        ) : null}
        <p className="text-xs">{row.original.nextAction}</p>
      </div>
    ),
  },
  {
    accessorKey: "riskScore",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 h-8 px-2 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Risk Ladder
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Badge
          variant="outline"
          className={cn(
            "min-w-12 justify-center font-medium tabular-nums",
            row.original.riskScore >= 80 && "border-danger/30 bg-danger/10 text-danger",
            row.original.riskScore >= 65 &&
              row.original.riskScore < 80 &&
              "border-warning/30 bg-warning/10 text-warning",
          )}
        >
          {row.original.riskScore}
        </Badge>
      </div>
    ),
  },
];

export function ActionsRiskLedger() {
  const summary = useDashboardData().analyticsActionsRiskLedgerSummary[0];

  const LEDGER_ROWS = useDashboardData().analyticsActionsRiskLedgerLedgerRows as LedgerRow[];

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "riskScore", desc: true }]);

  const table = useTable({
    features: dataTableFeatures,
    data: LEDGER_ROWS,
    columns: ledgerColumns,
    getRowId: (row) => String(row.id),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <Card className="min-w-0">
      <SectionHeader
        title="Revenue Risk Ledger"
        description="Accounts under pressure with blocker, next action, and owner responsibility."
        actions={
          <>
            <Badge variant="outline" className="font-medium tabular-nums">
              {LEDGER_ROWS.length} Accounts
            </Badge>
          </>
        }
      />

      <CardContent className="space-y-4">
        <div className="bg-muted sm:divide-border/60 grid gap-3 rounded-lg border p-3 text-sm sm:grid-cols-4 sm:divide-x">
          <LedgerStat label="Critical accounts" value={summary.value1} detail="Risk Ladder >= 80 (current window)" />
          <LedgerStat label="Escalations due" value={summary.value2} detail="Next 7 days" />
          <LedgerStat label="Median inactivity" value={summary.value3} detail="Current filter window" />
          <LedgerStat
            label="Overdue revenue"
            value={formatCurrency(summary.value4, { noDecimals: true })}
            detail="Close date already exceeded"
          />
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border">
          <Table className="min-w-[960px]">
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function LedgerStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="flex flex-col gap-1 px-0 sm:px-3 first:sm:pl-0 last:sm:pr-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-base font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{detail}</p>
    </div>
  );
}
