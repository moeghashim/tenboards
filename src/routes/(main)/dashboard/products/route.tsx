import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { PageHeader } from "../-components/app-pages/page-header";
import { AddProductDrawer } from "./-components/add-product-drawer";
import { CatalogContext } from "./-components/catalog-context";
import { Products } from "./-components/products";

const loadCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { readProducts } = await import("@/server/data/products");
  return readProducts();
});
export const Route = createFileRoute("/(main)/dashboard/products")({
  head: () => ({
    meta: [
      { title: "Open Source Product Management Dashboard with shadcn/ui" },
      {
        name: "description",
        content: "Manage an ecommerce product catalog with categories, inventory, availability, pricing, and sales.",
      },
    ],
    links: [{ rel: "canonical", href: "/dashboard/products" }],
  }),
  loader: () => loadCatalog(),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return (
    <CatalogContext value={data}>
      <div data-content-padding="false">
        <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col gap-4 md:gap-6">
          <PageHeader
            className="px-4 pt-4 md:px-6 md:pt-6"
            title="Products"
            description="Manage your catalog, inventory, pricing, and product availability."
            actions={<AddProductDrawer />}
          />
          <Products />
        </div>
      </div>
    </CatalogContext>
  );
}
