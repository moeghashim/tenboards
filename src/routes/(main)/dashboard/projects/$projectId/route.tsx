import { createFileRoute, Link, notFound, Outlet, useNavigate } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { PageHeader } from "../../-components/app-pages/page-header";
import { ProjectError, ProjectMissing, ProjectPending } from "../-components/project-boundaries";
import { loadProject } from "../-components/project-functions";
import { searchSchema } from "../-components/project-search";
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId")({
  beforeLoad: requireAppRoute,
  loader: async ({ params }) => {
    const result = await loadProject({ data: params });
    if (!result.project) throw notFound();
    return result;
  },
  component: ProjectShell,
  notFoundComponent: ProjectMissing,
  errorComponent: ProjectError,
  pendingComponent: ProjectPending,
});
function ProjectShell() {
  const { project, projects } = Route.useLoaderData(),
    navigate = useNavigate();
  if (!project) return null;
  return (
    <div className="min-w-0 space-y-5">
      <nav aria-label="Breadcrumb" className="text-muted-foreground flex items-center gap-2 text-sm">
        <Link to="/dashboard/default" className="hover:text-foreground">
          Workspace
        </Link>
        <span aria-hidden="true">/</span>
        <span>Projects</span>
      </nav>
      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <label className="flex items-center gap-2 text-sm">
            Project
            <select
              aria-label="Project"
              className="border-border-strong bg-background h-8 max-w-64 rounded-lg border px-2"
              value={project.id}
              onChange={(event) =>
                void navigate({
                  to: "/dashboard/projects/$projectId/board",
                  params: { projectId: event.target.value },
                  search: searchSchema.parse({}),
                })
              }
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        }
      />
      <p className="text-muted-foreground text-sm">
        <span className="text-foreground capitalize">{project.status.replaceAll("-", " ")}</span> ·{" "}
        {project.metrics.total} tasks · {project.metrics.completed} completed · {project.metrics.progress}% complete
      </p>
      <nav aria-label="Project views" className="flex flex-wrap gap-1 border-b pb-2">
        <Link
          to="/dashboard/projects/$projectId/board"
          params={{ projectId: project.id }}
          search={searchSchema.parse({})}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          Board
        </Link>
        <Link
          to="/dashboard/projects/$projectId/list"
          params={{ projectId: project.id }}
          search={searchSchema.parse({ limit: 10 })}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          List
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
