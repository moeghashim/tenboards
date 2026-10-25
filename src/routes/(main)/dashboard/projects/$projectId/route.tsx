import { createFileRoute, Link, notFound, Outlet, useNavigate } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { requireAppRoute } from "@/lib/auth/app-route";

import { PageHeader } from "../../-components/app-pages/page-header";
import { ProjectError, ProjectMissing, ProjectPending } from "../-components/project-boundaries";
import { ProjectSelect } from "../-components/project-controls";
import { loadProject } from "../-components/project-functions";
import { ProjectProgress } from "../-components/project-progress";
import { searchSchema } from "../-components/project-search";
import { MemberAvatars } from "../-components/task-presentation";
import { timelineSearch } from "../-components/timeline-search";
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
      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <ProjectSelect
            label="Project"
            value={project.id}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            onChange={(projectId) =>
              void navigate({ to: "/dashboard/projects/$projectId/overview", params: { projectId } })
            }
          />
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className={
              {
                planning: "bg-muted text-muted-foreground",
                active: "bg-info-surface text-info",
                "at-risk": "bg-warning-surface text-warning",
                complete: "bg-success-surface text-success",
              }[project.status]
            }
          >
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {project.status.replaceAll("-", " ")}
          </Badge>
          <span className="text-muted-foreground text-sm">{project.metrics.total} tasks</span>
          <MemberAvatars members={project.members} label="Project members" />
        </div>
        <div className="w-full sm:w-64">
          <ProjectProgress metrics={project.metrics} name={project.name} />
        </div>
      </div>
      <nav aria-label="Project views" className="flex flex-wrap gap-1 border-b pb-2">
        <Link
          to="/dashboard/projects/$projectId/overview"
          params={{ projectId: project.id }}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          Overview
        </Link>
        <Link
          to="/dashboard/projects/$projectId/board"
          params={{ projectId: project.id }}
          search={searchSchema.parse({})}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          Board
        </Link>
        <Link
          to="/dashboard/projects/$projectId/list"
          params={{ projectId: project.id }}
          search={searchSchema.parse({ limit: 10 })}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          List
        </Link>

        <Link
          to="/dashboard/projects/$projectId/timeline"
          params={{ projectId: project.id }}
          search={timelineSearch.parse({})}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          Timeline
        </Link>
        <Link
          to="/dashboard/projects/$projectId/files"
          params={{ projectId: project.id }}
          search={{ view: "grid" }}
          className="hover:bg-muted rounded-lg px-3 py-2"
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ className: "bg-muted font-medium", "aria-current": "page" }}
        >
          Files
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
