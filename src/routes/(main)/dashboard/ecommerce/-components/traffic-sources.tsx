import { siEbay, siGoogle, siMeta, siShopify, siTiktok } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { CardContent } from "@/components/ui/card";

import { DashboardCard, SectionHeader } from "../../-components/dashboard/cards";

const trafficSources = [
  {
    name: "Meta",
    visits: "5,640",
    share: 38,
    change: "+18%",
    icon: siMeta,
  },
  {
    name: "Google",
    visits: "3,740",
    share: 25,
    change: "-6%",
    icon: siGoogle,
  },
  {
    name: "Shopify",
    visits: "2,960",
    share: 20,
    change: "+7%",
    icon: siShopify,
  },
  {
    name: "TikTok",
    visits: "1,340",
    share: 10,
    change: "+9%",
    icon: siTiktok,
  },
  {
    name: "eBay",
    visits: "1,080",
    share: 7,
    change: "-3%",
    icon: siEbay,
  },
] as const;

export function TrafficSources() {
  return (
    <DashboardCard className="h-full">
      <SectionHeader title="Traffic Sources" description="14.8K visits" />
      <CardContent className="flex flex-col gap-4">
        {trafficSources.map((source) => (
          <div key={source.name} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SimpleIcon icon={source.icon} className="size-3 fill-current" />
                {source.name}
              </div>
              <div className="text-muted-foreground text-xs">{source.visits} visits</div>
            </div>
            <div>
              <div className="mb-1 text-xs tabular-nums">{source.share}%</div>
              <div className="bg-muted h-2 rounded-sm" aria-hidden="true">
                <div className="bg-primary h-full rounded-sm" style={{ width: `${source.share}%` }} />
              </div>
            </div>
            <span className={source.change.startsWith("-") ? "text-danger text-xs" : "text-success text-xs"}>
              {source.change}
            </span>
          </div>
        ))}
      </CardContent>
    </DashboardCard>
  );
}
