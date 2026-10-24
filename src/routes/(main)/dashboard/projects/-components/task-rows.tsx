import type { ReactNode } from "react";

import type { ReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataTableFeatures } from "@/lib/data-table-features";

// Shared rendering seam: legacy Tasks retains its selection/toolbar; Projects supplies read-only columns.
export function TaskRows<T extends { id: string }>({
  table,
  empty,
  caption = "Tasks",
}: {
  table: ReactTable<DataTableFeatures, T>;
  empty: ReactNode;
  caption?: string;
}) {
  return (
    <Table aria-label={caption} className="min-w-200 **:data-[slot=table-cell]:px-4 **:data-[slot=table-head]:px-4">
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id} className="hover:bg-transparent">
            {group.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan} className="text-muted-foreground h-11 font-medium">
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-task-id={row.id}
              className="border-border hover:bg-muted"
              data-state={table.state.rowSelection[row.id] && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-2 align-middle">
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 p-0">
              {empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
