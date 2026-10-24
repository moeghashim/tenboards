import { createServerFn } from "@tanstack/react-start";

import type { TaskInput } from "@/server/data/projects.types";
export const loadProject = createServerFn({ method: "GET" })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProject, readProjects } = await import("@/server/data/projects");
    const renderedAt = new Date().toISOString();
    const project = await readProject({ ...data, renderedAt });
    return { project, projects: project ? await readProjects({ renderedAt }) : [] };
  });
export const loadProjectTasks = createServerFn({ method: "GET" })
  .validator((data: TaskInput) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectTasks } = await import("@/server/data/projects");
    return readProjectTasks(data);
  });
