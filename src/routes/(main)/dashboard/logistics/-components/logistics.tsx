import * as React from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { useDashboardData } from "./data-context";
import { presentShipments } from "./shipment-data";
import { ShipmentDetails } from "./shipment-details";
import { ShipmentList } from "./shipment-list";

export function Logistics() {
  const data = useDashboardData();
  const shipments = React.useMemo(() => presentShipments(data.shipments), [data.shipments]);
  const selectedTrigger = React.useRef<HTMLButtonElement | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = React.useState<string | null>(shipments[0]?.id ?? null);
  const selectedShipment = shipments.find((shipment) => shipment.id === selectedShipmentId) ?? shipments[0] ?? null;

  function handleSelectShipment(shipmentId: string, trigger: HTMLButtonElement) {
    selectedTrigger.current = trigger;
    setSelectedShipmentId(shipmentId);

    if (!window.matchMedia("(min-width: 1024px)").matches) {
      setDetailsOpen(true);
    }
  }

  return (
    <>
      <div
        data-content-padding="false"
        className="grid h-[calc(100dvh-var(--dashboard-header-height))] min-w-0 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)] lg:divide-x"
      >
        <div className="h-full overflow-hidden">
          <ShipmentList
            shipments={shipments}
            selectedShipmentId={selectedShipment?.id ?? null}
            onSelectShipment={handleSelectShipment}
          />
        </div>
        <div className="hidden h-full overflow-hidden lg:block">
          <ShipmentDetails shipment={selectedShipment} />
        </div>
      </div>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent
          side="right"
          finalFocus={selectedTrigger}
          className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none data-[side=right]:md:w-3/4"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{selectedShipment ? `Shipment ${selectedShipment.id}` : "Shipment details"}</SheetTitle>
            <SheetDescription>Selected shipment details and route map.</SheetDescription>
          </SheetHeader>
          <ShipmentDetails shipment={selectedShipment} />
        </SheetContent>
      </Sheet>
    </>
  );
}
