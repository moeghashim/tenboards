import { ChevronUp, Flame, type LucideIcon, Minus } from "lucide-react";

import type { TaskPriority } from "./types";

export const priorityBadgeConfig: Record<
  TaskPriority,
  { icon: LucideIcon; variant: "destructive" | "secondary"; className: string }
> = {
  High: {
    icon: Flame,
    variant: "secondary",
    className: "bg-danger-surface text-danger",
  },
  Low: {
    icon: Minus,
    variant: "secondary",
    className: "bg-muted text-muted-foreground",
  },
  Medium: {
    icon: ChevronUp,
    variant: "secondary",
    className: "bg-warning-surface text-warning",
  },
};
