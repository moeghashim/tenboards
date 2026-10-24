import { createFileRoute, notFound } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { ProjectTimeline } from "../-components/project-timeline";
import { loadProjectTimeline } from "../-components/project-view-functions";
import { timelineSearch } from "../-components/timeline-search";
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/timeline")({
  beforeLoad: requireAppRoute,
  validateSearch: (s) => timelineSearch.parse(s),
  loaderDeps: ({ search }) => {
    const { mode: _, scale: __, periods: ___, start: ____, ...filters } = search;
    return filters;
  },
  loader: async ({ params, deps }) => {
    const filters = deps;
    const d = await loadProjectTimeline({
      data: { ...params, ...filters, assigneeId: filters.assigneeId === "unassigned" ? null : filters.assigneeId },
    });
    if (!d) throw notFound();
    return d;
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
    <ProjectTimeline
      key={projectId}
      data={data}
      search={search}
      onSearch={(s) => void navigate({ search: s, replace: true })}
    />
  );
}
