import { createServerFn } from "@tanstack/react-start";

import type { TaskInput } from "@/server/data/projects.types";
export const loadProject = createServerFn({ method: "GET" })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProject, readProjects } = await import("@/server/data/projects");
    const { requestReference } = await import("@/server/request-reference.server");
    const renderedAt = requestReference();
    const project = await readProject({ ...data, renderedAt });
    return { project, projects: project ? await readProjects({ renderedAt }) : [] };
  });
export const loadProjectTasks = createServerFn({ method: "GET" })
  .validator((data: TaskInput) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectTasks } = await import("@/server/data/projects");
    const { requestReference } = await import("@/server/request-reference.server");
    return readProjectTasks({ ...data, renderedAt: requestReference() });
  });

// The Board consumes the complete match set; transport reads remain bounded.
export const loadProjectBoard = createServerFn({ method: "GET" })
  .validator((data: TaskInput) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const { readProjectTasks } = await import("@/server/data/projects");
    const renderedAt = new Date().toISOString();
    const input = { ...data, renderedAt, offset: 0, limit: 100 as const };
    const first = await readProjectTasks(input);
    if (!first) return null;
    const items = [...first.items];
    let page = first;
    while (page.hasMore) {
      const next = await readProjectTasks({ ...input, offset: page.offset + page.items.length });
      if (!next?.items.length) throw new Error("Project tasks changed while loading. Please retry.");
      items.push(...next.items);
      page = next;
    }
    return { ...first, items, hasMore: false };
  });
