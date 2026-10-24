import { createServerFn } from "@tanstack/react-start";

import type { TaskInput } from "@/server/data/projects.types";
export const loadProjectOverview = createServerFn({ method: "GET" })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProject, readProjectTasks, readProjectActivity } = await import("@/server/data/projects");
    const { upcoming, SAMPLE_DATE, projectInput } = await import("@/server/data/projects.types");
    const input = projectInput.parse(data),
      project = await readProject(input);
    if (!project) return null;
    const batches = await Promise.all(
      (["backlog", "todo", "in-progress", "review"] as const).map((status) =>
        readProjectTasks({ ...input, status, dueFrom: SAMPLE_DATE, sort: "dueDate", limit: 10 }),
      ),
    );
    return {
      project,
      upcoming: upcoming(batches.flatMap((b) => b?.items ?? [])).slice(0, 10),
      activity: await readProjectActivity({ ...input, limit: 10 }),
    };
  });
export const loadProjectTimeline = createServerFn({ method: "GET" })
  .validator((data: TaskInput) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectTimeline } = await import("@/server/data/projects");
    return readProjectTimeline({ ...data, renderedAt: new Date().toISOString(), timeZone: "UTC" });
  });
export const loadProjectFiles = createServerFn({ method: "GET" })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectFiles } = await import("@/server/data/projects");
    return readProjectFiles(data);
  });
