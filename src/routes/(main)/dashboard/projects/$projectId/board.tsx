import { createFileRoute, notFound, stripSearchParams } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { loadProjectBoard } from "../-components/project-functions";
import { type ProjectSearch, searchSchema } from "../-components/project-search";
import { ProjectTasks } from "../-components/project-tasks";
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/board")({
  beforeLoad: requireAppRoute,
  validateSearch: (search: Record<string, unknown>): ProjectSearch =>
    searchSchema.parse({ ...search, offset: 0, limit: 100 }),
  search: { middlewares: [stripSearchParams<ProjectSearch>({ query: "", sort: "position", offset: 0, limit: 100 })] },
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const result = await loadProjectBoard({
      data: {
        projectId: params.projectId,
        ...deps,
        assigneeId: deps.assigneeId === "unassigned" ? null : deps.assigneeId,
      },
    });
    if (!result) throw notFound();
    return result;
  },
  component: Page,
  errorComponent: ProjectError,
  pendingComponent: ProjectPending,
});
function Page() {
  const data = Route.useLoaderData(),
    search = Route.useSearch(),
    navigate = Route.useNavigate(),
    { projectId } = Route.useParams();
  return (
    <ProjectTasks
      key={projectId}
      view="board"
      data={data}
      search={search}
      onSearch={(search) => void navigate({ search, replace: true })}
    />
  );
}
