import { useCallback, useMemo, useRef, useState } from "react";

import { useTable } from "@tanstack/react-table";

import { Search } from "lucide-react";

import { FilterSelect } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";
import { dataTableFeatures } from "@/lib/data-table-features";

import { useCatalog } from "./catalog-context";
import type { Product } from "./data";
import { ProductForm } from "./product-form";
import { createProductsColumns } from "./products-columns";
import { ProductsTable } from "./products-table";

export function Products() {
  const { categories, statuses, products: initialProducts } = useCatalog();
  const [products, setProducts] = useState(initialProducts);
  const [editor, setEditor] = useState<Product | null>(null);

  const editorTrigger = useRef<HTMLElement | null>(null);
  const editProduct = useCallback((product: Product) => {
    editorTrigger.current = document.querySelector<HTMLElement>(`button[data-product-id="${product.id}"]`);
    setEditor(product);
  }, []);
  const duplicateProduct = useCallback((product: Product) => {
    const id = crypto.randomUUID();
    setProducts((current) => [
      {
        ...product,
        id,
        name: `${product.name} (copy)`,
        sku: `COPY-${id.replaceAll("-", "")}`,
        status: "Draft",
        sold: 0,
      },
      ...current,
    ]);
    toast.add({ title: "Product duplicated as a draft.", type: "success" });
  }, []);
  const columns = useMemo(() => createProductsColumns(editProduct, duplicateProduct), [editProduct, duplicateProduct]);

  const table = useTable({
    features: dataTableFeatures,
    data: products,
    columns,
    initialState: {
      columnVisibility: { search: false },
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
    enableSorting: false,
  });

  const search = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const status = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";
  const category = (table.getColumn("category")?.getFilterValue() as string | undefined) ?? "All";

  function filterColumn(id: string, value: string) {
    table.getColumn(id)?.setFilterValue(!value || (id !== "search" && value === "All") ? undefined : value);
    table.setPageIndex(0);
  }

  function resetFilters() {
    table.resetColumnFilters();
    table.setPageIndex(0);
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 md:px-6">
        <InputGroup className="w-full sm:w-64">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            className="h-8"
            type="text"
            aria-label="Search products"
            placeholder="Search products…"
            value={search}
            onChange={(event) => filterColumn("search", event.target.value)}
          />
        </InputGroup>
        <div className="flex flex-wrap items-center gap-2">
          {(search || status !== "All" || category !== "All") && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          )}
          <FilterSelect
            label="Status"
            value={status}
            options={["All", ...statuses].map((value) => ({ value, label: value }))}
            onValueChange={(value) => filterColumn("status", value)}
          />
          <FilterSelect
            label="Category"
            value={category}
            options={["All", ...categories].map((value) => ({ value, label: value }))}
            onValueChange={(value) => filterColumn("category", value)}
          />
        </div>
      </div>
      <ProductsTable table={table} onReset={resetFilters} />

      {editor && (
        <ProductForm
          product={editor}
          returnFocus={editorTrigger}
          products={products}
          onClose={() => setEditor(null)}
          onSave={(product) => {
            setProducts((current) => current.map((p) => (p.id === product.id ? product : p)));
            setEditor(null);
            resetFilters();
            toast.add({ title: "Product saved in this demo session.", type: "success" });
          }}
        />
      )}
    </div>
  );
}
