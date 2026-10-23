import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { CustomerReviews } from "./-components/customer-reviews";
import { EcommerceContext } from "./-components/ecommerce-context";
import { Inventory } from "./-components/inventory";
import { KpiStrip } from "./-components/kpi-strip";
import { RecentOrders } from "./-components/recent-orders";
import { StoreTraffic } from "./-components/store-traffic";
import { TopProducts } from "./-components/top-products";
import { TrafficSources } from "./-components/traffic-sources";

const loadEcommerce = createServerFn({ method: "GET" }).handler(async () => {
  const { readEcommerce } = await import("@/server/data/ecommerce");
  return readEcommerce();
});
export const Route = createFileRoute("/(main)/dashboard/ecommerce")({
  loader: () => loadEcommerce(),
  component: Page,
});

const ecommercePeriodItems = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "year-to-date", label: "Year to Date" },
] as const;

const ecommerceChannelItems = [
  { value: "all-channels", label: "All Channels" },
  { value: "online-store", label: "Online Store" },
  { value: "marketplace", label: "Marketplace" },
  { value: "social", label: "Social" },
  { value: "retail", label: "Retail" },
] as const;

function Page() {
  const data = Route.useLoaderData();
  const reportDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data.reportDate}T12:00:00Z`));
  return (
    <EcommerceContext value={data}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl leading-tight font-medium tracking-tight">Store Overview</h1>
            <p className="text-muted-foreground text-sm">{`Demo report · ${reportDate} · UTC`}</p>
          </div>

          <div className="flex flex-wrap items-end justify-start gap-2 lg:w-fit">
            <Select defaultValue="this-month" items={ecommercePeriodItems}>
              <SelectTrigger className="w-34" aria-label="Store period" id="ecommerce-period" size="sm">
                <SelectValue placeholder="This Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ecommercePeriodItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select defaultValue="all-channels" items={ecommerceChannelItems}>
              <SelectTrigger className="w-40" aria-label="Sales channel" id="ecommerce-channel" size="sm">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ecommerceChannelItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" />

            <Button aria-label="Store settings" size="icon-sm" variant="outline">
              <Settings2 />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <KpiStrip />
          <div className="min-w-0 xl:col-span-5">
            <StoreTraffic />
          </div>
          <div className="min-w-0 xl:col-span-7">
            <TrafficSources />
          </div>
          <div className="min-w-0 xl:col-span-4">
            <TopProducts />
          </div>
          <div className="min-w-0 xl:col-span-4">
            <Inventory />
          </div>
          <div className="min-w-0 xl:col-span-4">
            <CustomerReviews />
          </div>
          <div className="min-w-0 xl:col-span-12">
            <RecentOrders />
          </div>
        </div>
      </div>
    </EcommerceContext>
  );
}
