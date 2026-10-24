import { createServerFn } from "@tanstack/react-start";

import { projectIndexSearch } from "./project-index-search";

export const loadWorkspaceHome = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { readWorkspaceHome } = await import("@/server/data/projects");
  const { requestReference } = await import("@/server/request-reference.server");
  return readWorkspaceHome({ renderedAt: requestReference() });
});
export const loadProjectsIndex = createServerFn({ method: "GET" })
  .validator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireSession } = await import("@/lib/auth/session.server");
    await requireSession();
    const input = projectIndexSearch.parse(data ?? {});
    const { readProjects } = await import("@/server/data/projects");
    const { requestReference } = await import("@/server/request-reference.server");
    const projects = await readProjects({ renderedAt: requestReference() });
    return {
      total: projects.length,
      projects: projects.filter(
        (p) =>
          (!input.status || p.status === input.status) &&
          `${p.name} ${p.description}`.toLowerCase().includes(input.query.toLowerCase()),
      ),
    };
  });
