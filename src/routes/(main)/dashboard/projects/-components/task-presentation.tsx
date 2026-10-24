import { ChevronUp, Flame, Minus, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Person, Priority, Task, TaskStatus } from "@/server/data/projects.types";

import { statusLabels } from "./project-search";

export const statusTones: Record<TaskStatus, string> = {
  backlog: "bg-muted-foreground",
  todo: "bg-info",
  "in-progress": "bg-warning",
  review: "bg-primary",
  done: "bg-success",
  canceled: "bg-muted-foreground",
};
export function TaskStatusLabel({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${statusTones[status]}`} />
      {statusLabels[status]}
    </span>
  );
}
export function TaskPriority({ priority }: { priority: Priority }) {
  const Icon = { high: Flame, medium: ChevronUp, low: Minus }[priority];
  const tone = {
    high: "bg-danger-surface text-danger",
    medium: "bg-warning-surface text-warning",
    low: "bg-muted text-muted-foreground",
  }[priority];
  return (
    <Badge variant="secondary" className={tone}>
      <Icon aria-hidden="true" data-icon="inline-start" />
      {priority[0].toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
export function PersonAvatar({ person }: { person: Person | null }) {
  return (
    <Avatar size="sm" aria-label={person?.name ?? "Unassigned"}>
      <AvatarFallback>{person?.initials ?? <UserRound className="size-3.5" aria-hidden="true" />}</AvatarFallback>
    </Avatar>
  );
}
export function TaskAssignee({ person }: { person: Person | null }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <PersonAvatar person={person} />
      <span>{person?.name ?? "Unassigned"}</span>
    </span>
  );
}
export function taskKey(task: Pick<Task, "projectId" | "position" | "sourceId">) {
  const prefixes: Record<string, string> = { "sample-operations": "OPS", "sample-docs": "DOC" };
  const prefix = prefixes[task.projectId] ?? "TASK";
  return `${prefix}-${task.position + 100}`;
}
