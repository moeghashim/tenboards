import type { ShipmentStatus } from "./shipment-data";
// One local presentation map keeps list and detail severity consistent.
export const statusText: Record<ShipmentStatus, string> = {
  Scheduled: "text-muted-foreground",
  "In Transit": "text-info",
  "Out for Delivery": "text-info",
  Delivered: "text-success",
  Delayed: "text-danger",
  "On Hold": "text-warning",
  "Customs Hold": "text-warning",
};
export const statusBadge: Record<ShipmentStatus, string> = {
  Scheduled: "border-border bg-muted text-muted-foreground",
  "In Transit": "border-info/30 bg-info-surface text-info",
  "Out for Delivery": "border-info/30 bg-info-surface text-info",
  Delivered: "border-success/30 bg-success-surface text-success",
  Delayed: "border-danger/30 bg-danger-surface text-danger",
  "On Hold": "border-warning/30 bg-warning-surface text-warning",
  "Customs Hold": "border-warning/30 bg-warning-surface text-warning",
};
