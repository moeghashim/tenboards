// biome-ignore-all lint/a11y/noNoninteractiveTabindex: This named overflow region needs keyboard scrolling.

import { getRouteApi } from "@tanstack/react-router";
import { type ColumnDef, useTable } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type DataTableFeatures, dataTableFeatures } from "@/lib/data-table-features";
import type { readProjectTasks } from "@/server/data/projects";
import { priorities, type Task, taskStatuses } from "@/server/data/projects.types";

import { TaskCard } from "../../kanban/-components/task-card";
import { ProjectSelect, useSearchDraft } from "./project-controls";
import { displayDate, type ProjectSearch, statusLabels } from "./project-search";
import { ProjectTaskDetail } from "./project-task-detail";
import { TaskAssignee, TaskPriority, TaskStatusLabel, taskKey } from "./task-presentation";
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
        <p className="text-muted-foreground text-xs">{taskKey(row.original)}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TaskStatusLabel status={row.original.status} />,
  },
  { accessorKey: "priority", header: "Priority", cell: ({ row }) => <TaskPriority priority={row.original.priority} /> },
  { id: "assignee", header: "Assignee", cell: ({ row }) => <TaskAssignee person={row.original.assignee} /> },
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
    cell: ({ row }) =>
      row.original.subtasks.length
        ? `${row.original.subtasks.filter((s) => s.done).length}/${row.original.subtasks.length}`
        : "—",
  },
  { accessorKey: "commentCount", header: "Comments" },
  { id: "details", header: "Details", cell: ({ row }) => <ProjectTaskDetail task={row.original} /> },
];
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
  const update = (patch: Partial<ProjectSearch>) => onSearch({ ...search, offset: 0, ...patch });
  const [query, setQuery] = useSearchDraft(search.query, (query) => update({ query }));
  const [label, setLabel] = useSearchDraft(search.label ?? "", (label) => update({ label: label || undefined }));
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
  return (
    <section className="min-w-0 space-y-4" aria-label={`${view === "board" ? "Board" : "List"} tasks`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">{view === "board" ? "Board" : "List"}</h2>
        <p className="text-muted-foreground text-sm" role="status">
          {data.total} tasks
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
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
        <ProjectSelect
          label="Status"
          value={search.status ?? "all"}
          options={[
            { value: "all", label: "All statuses" },
            ...taskStatuses.map((value) => ({ value, label: statusLabels[value] })),
          ]}
          onChange={(value) => update({ status: taskStatuses.find((s) => s === value) })}
        />
        <ProjectSelect
          label="Assignee"
          value={search.assigneeId ?? "all"}
          options={[
            { value: "all", label: "All members" },
            { value: "unassigned", label: "Unassigned" },
            ...(project?.members ?? []).map((m) => ({ value: m.id, label: m.name })),
          ]}
          onChange={(value) => update({ assigneeId: value === "all" ? undefined : value })}
        />
        <ProjectSelect
          label="Priority"
          value={search.priority ?? "all"}
          options={[
            { value: "all", label: "All priorities" },
            ...priorities.map((value) => ({ value, label: titlePriority[value] })),
          ]}
          onChange={(value) => update({ priority: priorities.find((p) => p === value) })}
        />
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
        <ProjectSelect
          label="Sort"
          value={search.sort}
          options={[
            { value: "position", label: "Original order" },
            { value: "title", label: "Title A–Z" },
            { value: "dueDate", label: "Due date" },
          ]}
          onChange={(value) => update({ sort: value as ProjectSearch["sort"] })}
        />
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
                    <h3 className="font-medium">
                      <TaskStatusLabel status={status} />
                    </h3>
                    <span className="text-muted-foreground text-xs">{tasks.length}</span>
                  </header>
                  <div className="relative max-h-[65dvh] space-y-3 overflow-y-auto px-3 pb-3">
                    {tasks.map((task) => (
                      <div key={task.id} data-task-id={task.id}>
                        <TaskCard
                          taskKey={taskKey(task)}
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
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex min-w-0 flex-wrap gap-1">
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
                                {task.subtasks.length > 0 && (
                                  <span>
                                    {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
                                  </span>
                                )}
                                <ProjectTaskDetail task={task} />
                              </div>
                            </div>
                          }
                        />
                      </div>
                    ))}
                    {!tasks.length && (
                      <p className="text-muted-foreground p-3 text-sm">
                        No {statusLabels[status].toLowerCase()} tasks.
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
      {view === "list" && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-muted-foreground text-sm">
            Showing {data.total ? data.offset + 1 : 0}–{data.offset + data.items.length} of {data.total}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {view === "list" && (
              <ProjectSelect
                label="Rows per page"
                value={String(search.limit)}
                options={[10, 20, 50].map((n) => ({ value: String(n), label: String(n) }))}
                onChange={(value) => update({ limit: Number(value) as ProjectSearch["limit"] })}
              />
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
      )}
    </section>
  );
}
