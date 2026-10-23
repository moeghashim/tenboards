import type { TaskTeam } from "./types";
export const tagTones: Record<TaskTeam, string> = {
  Backend: "bg-muted text-muted-foreground",
  Data: "bg-muted text-muted-foreground",
  Design: "bg-muted text-muted-foreground",
  Docs: "bg-muted text-muted-foreground",
  "Finance Ops": "bg-muted text-muted-foreground",
  Platform: "bg-muted text-muted-foreground",
  Product: "bg-muted text-muted-foreground",
  QA: "bg-muted text-muted-foreground",
  Security: "bg-muted text-muted-foreground",
};

export const ownerTone =
  "[&_[data-slot=avatar-fallback]]:bg-muted [&_[data-slot=avatar-fallback]]:text-muted-foreground";
