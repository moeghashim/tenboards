import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { DashboardCard as Card } from "../../-components/dashboard/cards";
import { useEcommerce } from "./ecommerce-context";

export function TopProducts() {
  const data = useEcommerce();
  const { products, summary } = data;
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)"];
  const categories = data.categories.map((category, index) => ({ ...category, color: colors[index % colors.length] }));
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-foreground text-sm font-medium">Top Products</CardTitle>
        <CardDescription className="text-foreground text-xl leading-none tracking-tight tabular-nums">
          {`${summary.topSalesShare}% of sales`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div aria-label="Sales by category" className="bg-muted flex h-2 gap-1 overflow-hidden" role="img">
            {categories.map((category) => (
              <div
                aria-hidden="true"
                key={category.name}
                className="rounded-md"
                style={{
                  backgroundColor: category.color,
                  width: `${category.share}%`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <div className="flex items-center gap-1" key={category.name}>
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-muted-foreground text-xs">
                  {category.name} {category.share}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-3">
          <div className="text-muted-foreground text-xs">Products</div>
          <div className="text-muted-foreground text-xs">Share</div>
          <div className="text-muted-foreground text-xs">Sales</div>

          {products.map((product) => (
            <div className="contents text-sm" key={product.name}>
              <div className="min-w-0">
                <div className="font-medium wrap-break-word">{product.name}</div>
                <div className="text-muted-foreground text-xs">{product.category}</div>
              </div>
              <div className="text-muted-foreground self-center tabular-nums">{product.share}</div>
              <div className="self-center font-medium tabular-nums">{product.sales}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
