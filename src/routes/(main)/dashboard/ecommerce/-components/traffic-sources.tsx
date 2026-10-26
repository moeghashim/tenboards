import { siEbay, siGoogle, siMeta, siShopify, siTiktok } from "simple-icons";

import { DashboardCard, SectionHeader } from "@/components/blocks";
import { SimpleIcon } from "@/components/simple-icon";
import { CardContent } from "@/components/ui/card";

import { useEcommerce } from "./ecommerce-context";

const icons = { siEbay, siGoogle, siMeta, siShopify, siTiktok };
export function TrafficSources() {
  const { trafficSources, summary } = useEcommerce();
  return (
    <DashboardCard className="h-full">
      <SectionHeader title="Traffic Sources" description={`${summary.sourceVisits / 1000}K visits`} />
      <CardContent className="flex flex-col gap-4">
        {trafficSources.map((source) => (
          <div key={source.name} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SimpleIcon icon={icons[source.icon]} className="size-3 fill-current" />
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
