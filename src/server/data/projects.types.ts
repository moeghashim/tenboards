import { z } from "zod";

export const DEFAULT_PROJECT = "sample-operations";
export const SAMPLE_MEMBER = "board:jordan";
export const SAMPLE_DATE = "2026-06-20";
export const taskStatuses = ["backlog", "todo", "in-progress", "review", "done", "canceled"] as const;
export const projectStatuses = ["planning", "active", "at-risk", "complete"] as const;
export const priorities = ["low", "medium", "high"] as const;
export const boundedId = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-zA-Z0-9:_-]+$/);
export const civilDate = z.iso.date();
export const projectInput = z.object({ projectId: boundedId }).strict();
export const taskInput = projectInput.extend({
  id: boundedId.optional(),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(priorities).optional(),
  sort: z.enum(["position", "dueDate", "title"]).default("position"),
  assigneeId: boundedId.nullable().optional(),
  label: z.string().min(1).max(80).optional(),
  query: z.string().max(200).optional(),
  offset: z.number().int().min(0).max(100000).default(0),
  limit: z.union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)]).default(100),
});
export type TaskInput = z.input<typeof taskInput>;
export type TaskStatus = (typeof taskStatuses)[number];
export type Priority = (typeof priorities)[number];
export type Person = { id: string; name: string; initials: string };
export type Member = Person & { role: string; position: number };
export type Project = {
  id: string;
  name: string;
  description: string;
  status: (typeof projectStatuses)[number];
  startDate: string | null;
  dueDate: string | null;
  favorite: boolean;
  position: number;
};
export type ProjectTask = {
  id: string;
  projectId: string;
  sourceKind: "board" | "ledger" | "sample";
  sourceId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  dueDate: string | null;
  startDate: string | null;
  endDate: string | null;
  position: number;
  commentCount: number;
  attachmentCount: number;
  documentCount: number;
  legacyProgress: number | null;
};
export type Task = ProjectTask & {
  assignee: Person | null;
  labels: string[];
  subtasks: { id: string; title: string; done: boolean; position: number }[];
};
export type Metrics = {
  total: number;
  open: number;
  completed: number;
  canceled: number;
  overdue: number;
  progress: number;
};
export function taskMetrics(tasks: Pick<ProjectTask, "status" | "dueDate">[]): Metrics {
  const completed = tasks.filter((t) => t.status === "done").length;
  const canceled = tasks.filter((t) => t.status === "canceled").length;
  const open = tasks.filter(isOpen);
  return {
    total: tasks.length,
    open: open.length,
    completed,
    canceled,
    overdue: open.filter((t) => t.dueDate !== null && t.dueDate < SAMPLE_DATE).length,
    progress: tasks.length === canceled ? 0 : Math.round((100 * completed) / (tasks.length - canceled)),
  };
}
export function isOpen(task: { status: TaskStatus }) {
  return task.status !== "done" && task.status !== "canceled";
}
export function upcoming<T extends Pick<ProjectTask, "status" | "dueDate" | "id">>(tasks: T[]) {
  return tasks
    .filter((t) => isOpen(t) && t.dueDate !== null && t.dueDate >= SAMPLE_DATE)
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? "") || a.id.localeCompare(b.id));
}
// Civil arithmetic uses UTC calendar fields, never local elapsed hours across DST.
export function addCivilDays(date: string, days: number) {
  civilDate.parse(date);
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function inclusiveDuration(start: string, end: string) {
  civilDate.parse(start);
  civilDate.parse(end);
  if (end < start) throw new Error("End precedes start");
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1;
}
export function taskCalendarEvents(tasks: Task[]) {
  return tasks
    .filter((t) => t.startDate !== null)
    .map((t) => ({
      id: t.id,
      title: t.title,
      start: t.startDate as string,
      end: addCivilDays(t.endDate ?? (t.startDate as string), 1),
      allDay: true,
    }));
}
