import { cn } from "cn";
import { AlertTriangleIcon, Copy, Plane, Ship, Star, Truck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Shipment } from "./shipment-data";
import { ShipmentRouteMap } from "./shipment-route-map";
import { statusBadge, statusText } from "./shipment-status";

const modeIcons = {
  air: Plane,
  land: Truck,
  sea: Ship,
} as const;

type ShipmentDetailsProps = {
  shipment: Shipment | null;
};

function getContactLabel(mode: Shipment["mode"]) {
  if (mode === "land") {
    return "Call Driver";
  }

  if (mode === "air") {
    return "Call Airline Support";
  }

  return "Call Captain";
}

function getTransportNumberLabel(mode: Shipment["mode"]) {
  if (mode === "land") {
    return "Vehicle number";
  }

  if (mode === "air") {
    return "Flight number";
  }

  return "Vessel number";
}

function EmptyShipmentOverview() {
  return (
    <div className="text-muted-foreground grid min-h-48 place-items-center rounded-lg border border-dashed text-sm">
      Select a shipment to view details.
    </div>
  );
}

function ShipmentOverview({ shipment }: { shipment: Shipment }) {
  const ContactIcon = modeIcons[shipment.mode];
  const contactLabel = getContactLabel(shipment.mode);
  const transportNumberLabel = getTransportNumberLabel(shipment.mode);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium tracking-tight tabular-nums sm:text-xl">#{shipment.id}</h1>
          <Button variant="ghost" size="icon-sm" aria-label="Copy shipment ID">
            <Copy />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Badge variant="outline" className={cn("gap-1.5", statusBadge[shipment.status])}>
            <span className={cn("size-1.5 rounded-full bg-current", statusText[shipment.status])} />
            {shipment.status}
          </Badge>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground tabular-nums">{shipment.progress}% complete</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-foreground tabular-nums">
            ETA: {shipment.eta} {shipment.etaMeta}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-9 after:rounded-sm">
            <AvatarFallback className="rounded-sm">{shipment.customer.initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="text-sm leading-none font-medium">{shipment.customer.name}</div>
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="text-xs leading-none tracking-tight tabular-nums">{shipment.customer.id}</span>{" "}
              <Copy className="size-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge variant="secondary">
            <Star />
            {shipment.customer.tier}
          </Badge>
          <div className="text-muted-foreground text-xs leading-none">{shipment.customer.tierLabel}</div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-medium">Cargo details</h2>

          <Button variant="outline" size="sm">
            <ContactIcon data-icon="inline-start" />
            {contactLabel}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 xl:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-1 md:col-span-1 md:gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">Cargo</div>
            <div className="text-sm leading-none wrap-break-word">{shipment.cargo}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">Total weight</div>
            <div className="text-sm leading-none">{shipment.weight}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">Transport mode</div>
            <div className="text-sm leading-none capitalize">
              {shipment.mode} · {shipment.routeType}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">{transportNumberLabel}</div>
            <div className="text-sm leading-none">{shipment.transportNumber}</div>
          </div>

          <div className="flex flex-col gap-2 md:text-right">
            <div className="text-muted-foreground text-xs leading-none md:text-sm">Status</div>
            <div className="text-sm leading-none">{shipment.progress}% complete</div>
          </div>
        </div>
      </div>

      <Separator />

      <Alert className="border-warning/30 bg-warning-surface text-warning">
        <AlertTriangleIcon />
        <AlertTitle>{shipment.handling.label}</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="text-warning leading-snug">{shipment.handling.note}</div>

          <Separator className="bg-warning/30" />

          <div className="flex flex-wrap gap-2">
            {shipment.handling.tags.map(({ icon: TagIcon, label }) => (
              <Badge
                className="bg-warning-surface text-warning border-warning/30 rounded-sm"
                key={label}
                variant="outline"
              >
                <TagIcon data-icon="inline-start" />
                {label}
              </Badge>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  if (!shipment) {
    return (
      <div className="grid h-full min-h-0 grid-rows-[minmax(160px,32vh)_1fr] overflow-hidden lg:grid-rows-[minmax(200px,40vh)_1fr]">
        <div className="min-h-0 overflow-hidden">
          <ShipmentRouteMap shipment={null} />
        </div>
        <div className="min-h-0 overflow-hidden p-4">
          <EmptyShipmentOverview />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(160px,32vh)_1fr] overflow-hidden lg:grid-rows-[minmax(200px,40vh)_1fr]">
      <div className="min-h-0 overflow-hidden">
        <ShipmentRouteMap shipment={shipment} />
      </div>
      <div className="min-h-0 overflow-hidden">
        <div className="h-full min-h-0 py-2">
          <Tabs defaultValue="overview" className="h-full gap-0">
            <TabsList
              className="h-auto w-full flex-wrap justify-start gap-2 border-b px-4 **:data-[slot=tabs-trigger]:text-xs sm:gap-4 sm:**:data-[slot=tabs-trigger]:text-sm"
              variant="line"
            >
              <TabsTrigger className="text-muted-foreground flex-none" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="text-muted-foreground flex-none" value="route">
                Route
              </TabsTrigger>
              <TabsTrigger className="text-muted-foreground flex-none" value="cargo">
                Cargo
              </TabsTrigger>
              <TabsTrigger className="text-muted-foreground flex-none" value="documents">
                Documents
              </TabsTrigger>
              <TabsTrigger className="text-muted-foreground flex-none" value="activity">
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent className="min-h-0 overflow-auto p-4" value="overview">
              <ShipmentOverview shipment={shipment} />
            </TabsContent>
            <TabsContent className="p-4" value="route">
              <div className="text-muted-foreground grid h-full place-items-center rounded-md border border-dashed text-sm">
                Route view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="cargo">
              <div className="text-muted-foreground grid h-full place-items-center rounded-md border border-dashed text-sm">
                Cargo view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="documents">
              <div className="text-muted-foreground grid h-full place-items-center rounded-md border border-dashed text-sm">
                Documents view coming soon.
              </div>
            </TabsContent>
            <TabsContent className="p-4" value="activity">
              <div className="text-muted-foreground grid h-full place-items-center rounded-md border border-dashed text-sm">
                Activity view coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
