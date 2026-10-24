import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Task } from "@/server/data/projects.types";

import { displayDate, statusLabels } from "./project-search";
export function ProjectTaskDetail({ task }: { task: Task }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" />} aria-label={`Details for ${task.title}`}>
        Details
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-6 break-words">{task.title}</DialogTitle>
          <DialogDescription>{task.description || "No description provided."}</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Status</dt>
          <dd>{statusLabels[task.status]}</dd>
          <dt className="text-muted-foreground">Assignee</dt>
          <dd>{task.assignee?.name ?? "Unassigned"}</dd>
          <dt className="text-muted-foreground">Due</dt>
          <dd>{displayDate(task.dueDate)}</dd>
          <dt className="text-muted-foreground">Labels</dt>
          <dd className="break-words">{task.labels.join(", ") || "None"}</dd>
          <dt className="text-muted-foreground">Comments</dt>
          <dd>{task.commentCount}</dd>
          <dt className="text-muted-foreground">Source</dt>
          <dd className="break-all">
            {task.sourceKind}: {task.sourceId}
          </dd>
        </dl>
        <section className="space-y-2">
          <h3 className="font-medium">
            Subtasks · {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
          </h3>
          {task.subtasks.length ? (
            <ul className="space-y-2">
              {task.subtasks.map((s) => (
                <li key={s.id} className="flex gap-2">
                  <span className="text-muted-foreground">{s.done ? "Done" : "Open"}</span>
                  <span>{s.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No subtasks.</p>
          )}
        </section>
        <p className="text-muted-foreground text-xs">
          Read-only sample. Attachment and document counts are metadata, not downloads.
        </p>
      </DialogContent>
    </Dialog>
  );
}
