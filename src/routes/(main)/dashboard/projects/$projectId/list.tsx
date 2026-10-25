import { createFileRoute, notFound, stripSearchParams } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { loadProjectTasks } from "../-components/project-functions";
import { type ProjectSearch, searchSchema } from "../-components/project-search";
import { ProjectTasks } from "../-components/project-tasks";
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/list")({
  beforeLoad: requireAppRoute,
  validateSearch: (search: Record<string, unknown>): ProjectSearch =>
    searchSchema.parse({ ...search, limit: search.limit ?? 10 }),
  search: { middlewares: [stripSearchParams<ProjectSearch>({ query: "", sort: "position", offset: 0, limit: 10 })] },
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const result = await loadProjectTasks({
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
      view="list"
      data={data}
      search={search}
      onSearch={(search) => void navigate({ search, replace: true })}
    />
  );
}
