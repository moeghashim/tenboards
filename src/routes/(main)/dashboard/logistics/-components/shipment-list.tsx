import { cn } from "cn";
import { Plane, Search, Ship, SlidersHorizontal, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Shipment } from "./shipment-data";
import { statusText } from "./shipment-status";

const modeIcons = {
  air: Plane,
  land: Truck,
  sea: Ship,
} as const;

type ShipmentCardProps = {
  active?: boolean;
  onSelectShipment: (shipmentId: Shipment["id"], trigger: HTMLButtonElement) => void;
  shipment: Shipment;
};

type ShipmentListProps = {
  onSelectShipment: (shipmentId: Shipment["id"], trigger: HTMLButtonElement) => void;
  selectedShipmentId: Shipment["id"] | null;
  shipments: Shipment[];
};

function ShipmentCard({ shipment, active, onSelectShipment }: ShipmentCardProps) {
  const Icon = modeIcons[shipment.mode];

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Select shipment ${shipment.id}`}
      onClick={(event) => {
        onSelectShipment(shipment.id, event.currentTarget);
      }}
      className={cn(
        "flex w-full flex-col gap-3 rounded-lg border p-3 text-left transition-colors",
        "hover:bg-muted/50 focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none",
        active && "border-primary bg-muted",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>#{shipment.id}</div>

        <div className="flex items-center gap-1">
          <span className={cn("text-xs font-medium", statusText[shipment.status])}>{shipment.status}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground rounded border px-1 py-0.5 text-xs">
            {shipment.origin.countryCode.toUpperCase()}
          </span>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs leading-none font-medium">{shipment.origin.country},</div>
            <div className="text-muted-foreground text-xs">{shipment.origin.display}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-right">
          <div className="flex flex-col gap-0.5">
            <div className="text-xs leading-none font-medium">{shipment.destination.country},</div>
            <div className="text-muted-foreground text-xs">{shipment.destination.display}</div>
          </div>
          <span className="text-muted-foreground rounded border px-1 py-0.5 text-xs">
            {shipment.destination.countryCode.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <span
          className="border-foreground h-px min-w-0 border-t border-dashed"
          style={{ flexGrow: shipment.progress, flexBasis: 0 }}
        />
        <Icon className={cn("size-3.5", shipment.mode === "air" && "rotate-45")} />
        <span
          className="border-border h-px min-w-0 border-t border-dashed"
          style={{ flexGrow: 100 - shipment.progress, flexBasis: 0 }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-muted-foreground text-xs leading-none">Cargo</div>
          <div className="text-sm tracking-tight wrap-break-word">{shipment.cargo}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground text-xs leading-none">ETA</div>
          <div className="text-sm tracking-tight tabular-nums">
            {shipment.eta}
            {shipment.etaMeta && (
              <span className="text-muted-foreground ml-1 text-xs font-normal">{shipment.etaMeta}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function ShipmentList({ shipments, selectedShipmentId, onSelectShipment }: ShipmentListProps) {
  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Shipments</CardTitle>
        <CardAction>
          <Button aria-label="Shipment filters" size="icon-sm" variant="ghost">
            <SlidersHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden px-0">
        <Tabs defaultValue="all">
          <TabsList className="h-auto w-full flex-wrap border-b px-3" variant="line">
            <TabsTrigger className="text-xs" value="all">
              All (156)
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="in-transit">
              In Transit (32)
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="delivered">
              Delivered (98)
            </TabsTrigger>
            <TabsTrigger className="text-xs" value="delayed">
              Delayed (9)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="px-4">
          <InputGroup className="h-8">
            <InputGroupInput className="h-8" aria-label="Search shipments" placeholder="Search shipments..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col gap-3 px-4 pb-4">
            {shipments.map((shipment) => (
              <ShipmentCard
                active={shipment.id === selectedShipmentId}
                key={shipment.id}
                shipment={shipment}
                onSelectShipment={onSelectShipment}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
