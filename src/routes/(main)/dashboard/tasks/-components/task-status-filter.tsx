import type { ReactTable, RowData } from "@tanstack/react-table";

import { cn } from "cn";
import { ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { statuses } from "./data";

interface TaskStatusFilterProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function TaskStatusFilter<TData extends RowData>({ table }: TaskStatusFilterProps<TData>) {
  const column = table.getColumn("status");

  if (!column) {
    return null;
  }

  const statusColumn = column;
  const selectedValues = new Set(statusColumn.getFilterValue() as string[]);

  function updateFilter(value: string) {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }

    const filterValues = Array.from(selectedValues);
    statusColumn.setFilterValue(filterValues.length ? filterValues : undefined);
    table.setPageIndex(0);
  }

  function clearFilter() {
    statusColumn.setFilterValue(undefined);
    table.setPageIndex(0);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={cn("border-dashed", selectedValues.size > 0 && "bg-muted text-foreground border-solid")}
          />
        }
      >
        <ListFilter data-icon="inline-start" />
        Status{selectedValues.size > 0 && <span className="tabular-nums"> ({selectedValues.size})</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-50">
        <DropdownMenuGroup>
          {statuses.map((status) => {
            const isSelected = selectedValues.has(status.value);

            return (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={isSelected}
                onCheckedChange={() => updateFilter(status.value)}
                closeOnClick={false}
              >
                <status.icon className={cn("rounded-sm p-0.5", status.className)} />
                {status.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={clearFilter} className="justify-center text-center">
                <X />
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
