import { createServerFn } from "@tanstack/react-start";

import type { TaskInput } from "@/server/data/projects.types";
export const loadProjectOverview = createServerFn({ method: "GET" })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProject, readProjectTasks, readProjectActivity } = await import("@/server/data/projects");
    const { upcoming, requestDate, projectInput } = await import("@/server/data/projects.types");
    const { requestReference } = await import("@/server/request-reference.server");
    const input = projectInput.parse({ ...data, renderedAt: requestReference() }),
      project = await readProject(input);
    if (!project) return null;
    const batches = await Promise.all(
      (["backlog", "todo", "in-progress", "review"] as const).map((status) =>
        readProjectTasks({ ...input, status, dueFrom: project.sampleDate, sort: "dueDate", limit: 10 }),
      ),
    );
    return {
      project,
      upcoming: upcoming(
        batches.flatMap((b) => b?.items ?? []),
        requestDate(input.renderedAt),
      ).slice(0, 10),
      activity: await readProjectActivity({ ...input, limit: 10 }),
    };
  });
export const loadProjectTimeline = createServerFn({ method: "GET" })
  .validator((data: TaskInput) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectTimeline, readProject } = await import("@/server/data/projects");
    const { requestReference } = await import("@/server/request-reference.server");
    const renderedAt = requestReference();
    const project = await readProject({ projectId: data.projectId, renderedAt });
    if (!project) return null;
    const timeline = await readProjectTimeline({ ...data, renderedAt, timeZone: "UTC" });
    return timeline ? { ...timeline, project } : null;
  });
export const loadProjectFiles = createServerFn({ method: "GET" })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectFiles } = await import("@/server/data/projects");
    return readProjectFiles(data);
  });
