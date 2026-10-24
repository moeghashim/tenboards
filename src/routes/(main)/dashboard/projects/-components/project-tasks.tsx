// biome-ignore-all lint/a11y/noNoninteractiveTabindex: This named overflow region needs keyboard scrolling.
import { useState } from "react";

import { getRouteApi } from "@tanstack/react-router";
import { type ColumnDef, useTable } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type DataTableFeatures, dataTableFeatures } from "@/lib/data-table-features";
import type { readProjectTasks } from "@/server/data/projects";
import { priorities, type Task, taskStatuses } from "@/server/data/projects.types";

import { TaskCard } from "../../kanban/-components/task-card";
import { displayDate, type ProjectSearch, statusLabels } from "./project-search";
import { ProjectTaskDetail } from "./project-task-detail";
import { TaskRows } from "./task-rows";

const shell = getRouteApi("/(main)/dashboard/projects/$projectId");
const titlePriority = { low: "Low", medium: "Medium", high: "High" } as const;
const columns: ColumnDef<DataTableFeatures, Task>[] = [
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => (
      <div className="max-w-96 min-w-64 space-y-1 whitespace-normal">
        <p className="font-medium break-words">{row.original.title}</p>
        <p className="text-muted-foreground text-xs">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="outline">{statusLabels[row.original.status]}</Badge>,
  },
  { accessorKey: "priority", header: "Priority", cell: ({ row }) => titlePriority[row.original.priority] },
  { id: "assignee", header: "Assignee", cell: ({ row }) => row.original.assignee?.name ?? "Unassigned" },
  { accessorKey: "dueDate", header: "Due date", cell: ({ row }) => displayDate(row.original.dueDate) },
  {
    id: "labels",
    header: "Labels",
    cell: ({ row }) => (
      <span className="block max-w-48 whitespace-normal">{row.original.labels.join(", ") || "None"}</span>
    ),
  },
  {
    id: "subtasks",
    header: "Subtasks",
    cell: ({ row }) => `${row.original.subtasks.filter((s) => s.done).length}/${row.original.subtasks.length}`,
  },
  { accessorKey: "commentCount", header: "Comments" },
  { id: "details", header: "Details", cell: ({ row }) => <ProjectTaskDetail task={row.original} /> },
];
const selectClass = "border-border-strong bg-background h-8 max-w-full rounded-lg border px-2 text-sm";
export function ProjectTasks({
  data,
  search,
  onSearch,
  view,
}: {
  data: NonNullable<Awaited<ReturnType<typeof readProjectTasks>>>;
  search: ProjectSearch;
  onSearch: (search: ProjectSearch) => void;
  view: "board" | "list";
}) {
  const { project } = shell.useLoaderData();
  const [query, setQuery] = useState(search.query),
    [label, setLabel] = useState(search.label ?? "");
  const table = useTable({
    features: dataTableFeatures,
    data: data.items,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: false,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
  });
  const update = (patch: Partial<ProjectSearch>) => onSearch({ ...search, offset: 0, ...patch });
  return (
    <section className="min-w-0 space-y-4" aria-label={`${view === "board" ? "Board" : "List"} tasks`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">{view === "board" ? "Board" : "List"}</h2>
        <p className="text-muted-foreground text-sm" role="status">
          {data.total} matching tasks · read-only sample
        </p>
      </div>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          update({ query, label: label || undefined });
        }}
      >
        <label htmlFor="project-task-query" className="flex min-w-40 flex-1 flex-col gap-1 text-xs">
          Search tasks
          <Input
            id="project-task-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title or description"
            maxLength={200}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Status
          <select
            className={selectClass}
            aria-label="Status"
            value={search.status ?? ""}
            onChange={(event) => update({ status: taskStatuses.find((s) => s === event.target.value) })}
          >
            <option value="">All statuses</option>
            {taskStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Assignee
          <select
            className={selectClass}
            aria-label="Assignee"
            value={search.assigneeId ?? ""}
            onChange={(event) => update({ assigneeId: event.target.value || undefined })}
          >
            <option value="">All members</option>
            <option value="unassigned">Unassigned</option>
            {project?.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Priority
          <select
            className={selectClass}
            aria-label="Priority"
            value={search.priority ?? ""}
            onChange={(event) => update({ priority: priorities.find((p) => p === event.target.value) })}
          >
            <option value="">All priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {titlePriority[p]}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="project-task-label" className="flex w-36 flex-col gap-1 text-xs">
          Label
          <Input
            id="project-task-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Exact label"
            maxLength={80}
          />
        </label>
        <Button type="submit" variant="outline">
          Apply search
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setQuery("");
            setLabel("");
            onSearch({
              query: "",
              status: undefined,
              priority: undefined,
              assigneeId: undefined,
              label: undefined,
              sort: "position",
              offset: 0,
              limit: view === "board" ? 100 : 10,
            });
          }}
        >
          Reset filters
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Sort
          <select
            className={selectClass}
            aria-label="Sort"
            value={search.sort}
            onChange={(event) => update({ sort: event.target.value as ProjectSearch["sort"] })}
          >
            <option value="position">Original order</option>
            <option value="title">Title A–Z</option>
            <option value="dueDate">Due date</option>
          </select>
        </label>
        <p className="text-muted-foreground text-xs">
          Deadline reference: June 20, 2026. Unknown dates stay unscheduled.
        </p>
      </div>
      {view === "board" ? (
        <section
          aria-label="Task status columns, scroll horizontally"
          tabIndex={0}
          className="max-w-full overflow-x-auto rounded-xl pb-3"
        >
          <div className="grid w-max grid-cols-6 gap-4">
            {taskStatuses.map((status) => {
              const tasks = data.items.filter((t) => t.status === status);
              return (
                <section
                  key={status}
                  aria-label={`${statusLabels[status]} column`}
                  className="bg-muted w-80 rounded-xl border"
                >
                  <header className="flex items-center justify-between gap-2 p-4">
                    <h3 className="font-medium">{statusLabels[status]}</h3>
                    <span className="text-muted-foreground text-xs">{tasks.length} in this batch</span>
                  </header>
                  <div className="relative max-h-[65dvh] space-y-3 overflow-y-auto px-3 pb-3">
                    {tasks.map((task) => (
                      <div key={task.id} data-task-id={task.id}>
                        <TaskCard
                          task={{
                            title: task.title,
                            description: task.description,
                            priority: titlePriority[task.priority],
                            dueDate: displayDate(task.dueDate),
                            owner: { name: task.assignee?.name ?? "Unassigned" },
                            insights: [
                              { label: "Comments", count: task.commentCount },
                              { label: "Attachments", count: task.attachmentCount },
                              { label: "Documents", count: task.documentCount },
                            ],
                          }}
                          footer={
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {task.labels.map((label) => (
                                  <Badge
                                    key={label}
                                    variant="outline"
                                    className="max-w-full break-words whitespace-normal"
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                                <span>
                                  {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
                                </span>
                                <ProjectTaskDetail task={task} />
                              </div>
                            </div>
                          }
                        />
                      </div>
                    ))}
                    {!tasks.length && (
                      <p className="text-muted-foreground p-3 text-sm">
                        No {statusLabels[status].toLowerCase()} tasks in this batch.
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="bg-card overflow-hidden rounded-xl border">
          <TaskRows
            table={table}
            caption="Project tasks"
            empty={
              <div className="sticky left-0 w-[calc(100vw-4rem)] p-6 text-center sm:w-auto">
                <p className="font-medium">No matching tasks</p>
                <p className="text-muted-foreground mt-1">Reset the filters or choose another project.</p>
              </div>
            }
          />
        </div>
      )}
      {!data.total && view === "board" && (
        <p className="text-muted-foreground">
          No matching tasks in {project?.name}. Reset filters or choose another project.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-muted-foreground text-sm">
          Showing {data.total ? data.offset + 1 : 0}–{data.offset + data.items.length} of {data.total}
          {data.hasMore ? " · More tasks in the next batch" : ""}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {view === "list" && (
            <label className="flex items-center gap-2 text-sm">
              Rows per page
              <select
                className={selectClass}
                aria-label="Rows per page"
                value={search.limit}
                onChange={(event) => update({ limit: Number(event.target.value) as ProjectSearch["limit"] })}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Button
            variant="outline"
            disabled={!data.offset}
            onClick={() => update({ offset: Math.max(0, data.offset - data.limit) })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!data.hasMore}
            onClick={() => update({ offset: data.offset + data.limit })}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
