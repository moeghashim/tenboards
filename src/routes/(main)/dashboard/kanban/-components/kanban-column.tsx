import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";
import { GripVertical, MoreVertical, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SortableTaskCard } from "./sortable-task-card";
import { statusIcons } from "./task-status";
import type { Column, Task } from "./types";

interface KanbanColumnProps {
  column: Column;
  index: number;
  tasks: Task[];
}

export function KanbanColumn({ column, index, tasks }: KanbanColumnProps) {
  const StatusIcon = statusIcons[column.id];
  const columnSortable = useSortable({
    id: `column:${column.id}`,
    index,
    type: "column",
    accept: "column",
    group: "columns",
    data: { type: "column", columnId: column.id },
  });
  const taskDropTarget = useDroppable({
    id: column.id,
    type: "task-container",
    accept: "task",
    collisionPriority: CollisionPriority.Low,
    data: { type: "task-container", columnId: column.id },
  });

  return (
    <section
      ref={columnSortable.ref}
      data-column-id={column.id}
      aria-label={`${column.title} column`}
      className={cn(
        "bg-muted flex min-h-0 flex-col rounded-t-xl border transition-colors",
        (columnSortable.isDropTarget || taskDropTarget.isDropTarget) && "ring-primary ring-2 ring-inset",
        columnSortable.isDragging && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-0.5">
            <Button
              ref={columnSortable.handleRef}
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground -ml-2 cursor-grab active:cursor-grabbing"
              aria-label={`Drag ${column.title} column`}
            >
              <GripVertical />
            </Button>
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <StatusIcon className="text-muted-foreground size-4" aria-hidden="true" />
              {column.title}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-none tabular-nums">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>
        <div className="text-muted-foreground -mr-2 flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label={`Add task to ${column.title}`}>
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`${column.title} column actions`}>
            <MoreVertical />
          </Button>
        </div>
      </div>

      <div
        ref={taskDropTarget.ref}
        className="[&::-webkit-scrollbar-thumb]:bg-border-strong flex min-h-0 flex-1 scrollbar-thin [scrollbar-color:var(--border-strong)_transparent] flex-col gap-3 overflow-y-auto px-3 pb-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {tasks.length === 0 && <p className="text-muted-foreground p-3 text-sm">No tasks</p>}
        {tasks.map((task, taskIndex) => (
          <SortableTaskCard key={task.id} task={task} columnId={column.id} index={taskIndex} />
        ))}
      </div>
    </section>
  );
}
