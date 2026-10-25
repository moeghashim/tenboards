import type { ReactNode } from "react";

import { cn } from "cn";
import { BadgeCheck, CalendarDays, FileText, type LucideIcon, MessageSquare, Paperclip } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";

import { ownerTone, tagTones } from "./data";
import { priorityBadgeConfig } from "./task-priority";
import type { ColumnId, Task, TaskInsightLabel } from "./types";

const taskInsightIcons: Record<TaskInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

export function TaskCard({
  task,
  columnId,
  isOverlay = false,
  footer,
  taskKey,
}: {
  task: Pick<Task, "title" | "description" | "priority" | "dueDate" | "owner" | "insights"> &
    Partial<Pick<Task, "progress" | "team">>;
  footer?: ReactNode;
  taskKey?: string;
  columnId?: ColumnId;
  isOverlay?: boolean;
}) {
  const isDone = columnId === "shipped";
  const showBuildingDetails = columnId === "building" && typeof task.progress === "number";
  const owner = task.owner;
  const PriorityIcon = priorityBadgeConfig[task.priority].icon;

  return (
    <article
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-3 rounded-xl border p-3",
        isOverlay && "w-80 shadow-lg",
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-sm leading-5 font-medium break-words">{task.title}</h3>
          <Badge
            variant={priorityBadgeConfig[task.priority].variant}
            className={cn(
              "shrink-0 rounded-md border-transparent px-2 font-medium",
              priorityBadgeConfig[task.priority].className,
            )}
          >
            <PriorityIcon data-icon="inline-start" />
            {task.priority}
          </Badge>
        </div>
        {!taskKey && <p className="text-muted-foreground text-sm leading-5 break-words">{task.description}</p>}
      </div>

      {!showBuildingDetails ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Avatar size="sm" className={ownerTone} aria-label={owner.name}>
              <AvatarFallback className="text-xs">{getInitials(owner.name)}</AvatarFallback>
            </Avatar>

            <span className={taskKey ? "sr-only" : "text-muted-foreground text-sm"}>{owner.name}</span>
          </div>

          <div className="text-muted-foreground flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm">{task.dueDate}</span>
            <CalendarDays className="size-3" />
          </div>
        </div>
      ) : null}

      {showBuildingDetails ? (
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="leading-none">Progress</span>
              <span className="leading-none tabular-nums">{task.progress}%</span>
            </div>
            <Progress value={task.progress ?? null} aria-label={`${task.title} progress`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground text-sm">Owner</span>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground truncate text-sm">{owner.name}</span>
                <Avatar size="sm" className={ownerTone} aria-label={owner.name}>
                  <AvatarFallback className="text-xs">{getInitials(owner.name)}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground text-sm">Due date</span>
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="truncate text-sm">{task.dueDate}</span>
                <CalendarDays className="size-3" />
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground text-sm">Team</span>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-md border-transparent px-2 font-medium",
                  task.team ? tagTones[task.team] : undefined,
                )}
              >
                {task.team}
              </Badge>
            </div>
          </div>
        </div>
      ) : null}

      {(isDone || task.insights.some((i) => i.count > 0)) && <Separator />}

      <div className="flex flex-wrap items-center justify-between gap-2">
        {taskKey && <span className="text-muted-foreground text-xs">{taskKey}</span>}
        {isDone ? (
          <div className="text-success flex items-center gap-1 text-sm font-medium">
            <BadgeCheck className="size-4" />
            Done
          </div>
        ) : null}

        {!isDone ? (
          <div className="text-muted-foreground flex items-center gap-3 text-sm">
            {task.insights
              .filter((insight) => insight.count > 0)
              .map((insight) => {
                const Icon = taskInsightIcons[insight.label];

                return (
                  <span key={insight.label} className="flex items-center gap-1.5 text-sm">
                    <Icon className="size-3.5" />
                    {insight.count}
                    <span className="sr-only"> {insight.label.toLowerCase()}</span>
                  </span>
                );
              })}
          </div>
        ) : null}
      </div>
      {footer}
    </article>
  );
}
