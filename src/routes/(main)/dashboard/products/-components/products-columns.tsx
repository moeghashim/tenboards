import { type ColumnDef, Subscribe } from "@tanstack/react-table";

import { cn } from "cn";
import { Copy, MoreHorizontal, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { currency, number, type Product, type ProductStatus } from "./data";

const statusColors: Record<ProductStatus, string> = {
  Active: "bg-success-surface text-success",
  Draft: "bg-muted text-muted-foreground",
  Archived: "bg-muted text-muted-foreground",
};

export function createProductsColumns(
  onEdit: (product: Product) => void,
  onDuplicate: (product: Product) => void,
): ColumnDef<DataTableFeatures, Product>[] {
  return [
    {
      id: "select",
      size: 56,
      minSize: 56,
      maxSize: 56,
      header: ({ table }) => (
        <Subscribe
          source={table.store}
          selector={() => ({
            checked:
              table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && ("indeterminate" as const)),
            disabled: !table.getRowModel().rows.length,
          })}
        >
          {({ checked, disabled }) => (
            <Checkbox
              className="mx-auto"
              aria-label="Select all products on this page"
              checked={checked === true}
              indeterminate={checked === "indeterminate"}
              disabled={disabled}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
            />
          )}
        </Subscribe>
      ),
      cell: ({ row }) => (
        <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
          {(checked) => (
            <Checkbox
              className="mx-auto"
              aria-label={`Select ${row.original.name}`}
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(value === true)}
            />
          )}
        </Subscribe>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "search",
      accessorFn: (product) => `${product.name} ${product.sku} ${product.category}`,
      filterFn: "includesString",
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <button
          type="button"
          data-product-id={row.original.id}
          onClick={() => onEdit(row.original)}
          className="hover:text-primary focus-visible:ring-ring w-56 rounded-sm text-left [overflow-wrap:anywhere] whitespace-normal outline-none focus-visible:ring-2"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="text-muted-foreground block max-w-72 font-mono text-xs break-all whitespace-normal">
          {row.original.sku}
        </span>
      ),
    },
    { accessorKey: "category", header: "Category", filterFn: "equalsString" },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge variant="secondary" className={cn("rounded-md", statusColors[row.original.status])}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "stock",
      header: "Inventory",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={cn("rounded-md tabular-nums", {
            "bg-danger-surface text-danger": row.original.stock === 0,
            "bg-warning-surface text-warning": row.original.stock > 0 && row.original.stock <= 10,
            "bg-muted text-muted-foreground": row.original.stock > 10,
          })}
        >
          {row.original.stock === 0 && "Out of stock"}
          {row.original.stock > 0 && (
            <>
              {number.format(row.original.stock)} in stock
              {row.original.stock <= 10 && " · Low stock"}
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="tabular-nums">{currency.format(row.original.price)}</span>,
    },
    {
      accessorKey: "sold",
      header: "Units sold",
      cell: ({ row }) => <span className="tabular-nums">{number.format(row.original.sold)}</span>,
    },
    {
      id: "actions",
      size: 56,
      minSize: 56,
      maxSize: 56,
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.name}`} />}
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Pencil />
                  Edit product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onDuplicate(row.original);
                    row.table.resetColumnFilters();
                    row.table.setPageIndex(0);
                  }}
                >
                  <Copy />
                  Duplicate
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
