import { Link } from "@tanstack/react-router";

import { ArrowUpRight, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

import { DashboardCard } from "../../-components/dashboard/cards";
import type { loadProject } from "./project-functions";
import { ProjectProgress } from "./project-progress";
import { displayDate } from "./project-search";
import { MemberAvatars } from "./task-presentation";
export type ProjectSummary = NonNullable<Awaited<ReturnType<typeof loadProject>>["project"]>;
export function ProjectStatus({ status }: { status: ProjectSummary["status"] }) {
  return (
    <Badge
      variant="secondary"
      className={
        {
          planning: "bg-muted text-muted-foreground",
          active: "bg-info-surface text-info",
          "at-risk": "bg-warning-surface text-warning",
          complete: "bg-success-surface text-success",
        }[status]
      }
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status.replaceAll("-", " ")}
    </Badge>
  );
}
export function ProjectSummaryCard({ project }: { project: ProjectSummary }) {
  return (
    <DashboardCard>
      <CardContent className="space-y-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              className="hover:text-primary text-base font-medium break-words hover:underline"
              to="/dashboard/projects/$projectId/overview"
              params={{ projectId: project.id }}
            >
              {project.name}
            </Link>
            <p className="text-muted-foreground mt-1 text-sm break-words">{project.description}</p>
          </div>
          <ArrowUpRight aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProjectStatus status={project.status} />
          <span className="text-muted-foreground text-xs">
            {project.metrics.open} open · {project.metrics.total} tasks
          </span>
        </div>
        <ProjectProgress metrics={project.metrics} name={project.name} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {project.dueDate ? displayDate(project.dueDate) : "No target date"}
          </span>
          {project.members.length ? (
            <MemberAvatars members={project.members} label={`${project.name} members`} limit={4} />
          ) : (
            <span className="text-muted-foreground text-xs">No members yet</span>
          )}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
