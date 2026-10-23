import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";

import { TaskCard } from "./task-card";
import type { ColumnId, Task } from "./types";

export function SortableTaskCard({ task, columnId, index }: { task: Task; columnId: ColumnId; index: number }) {
  const { isDragging, ref } = useSortable({
    id: task.id,
    index,
    type: "task",
    accept: "task",
    group: columnId,
    data: { type: "task", task, columnId },
  });

  return (
    <div
      ref={ref}
      data-task-id={task.id}
      className={cn(
        "focus-visible:outline-ring touch-none rounded-xl outline-none focus-visible:outline-3",
        isDragging && "opacity-30",
      )}
    >
      <TaskCard task={task} columnId={columnId} />
    </div>
  );
}
