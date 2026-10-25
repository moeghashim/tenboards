import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CardContent } from "@/components/ui/card";
import { requireAppRoute } from "@/lib/auth/app-route";

import { DashboardCard, SectionHeader, StatCard } from "../../-components/dashboard/cards";
import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { displayDate, relativeDueDate, searchSchema } from "../-components/project-search";
import { loadProjectOverview } from "../-components/project-view-functions";
import { PersonAvatar, TaskStatusLabel } from "../-components/task-presentation";
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/overview")({
  beforeLoad: requireAppRoute,
  loader: async ({ params }) => {
    const d = await loadProjectOverview({ data: params });
    if (!d) throw notFound();
    return d;
  },
  component: Page,
  errorComponent: ProjectError,
  pendingComponent: ProjectPending,
});
function Page() {
  const { project, upcoming, activity } = Route.useLoaderData();
  return (
    <section className="space-y-5" aria-label="Project overview">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard label="Total tasks" value={project.metrics.total} help="Open + completed + canceled" />
        <StatCard label="Open tasks" value={project.metrics.open} />
        <StatCard label="Completed" value={project.metrics.completed} />
        <StatCard label="Canceled" value={project.metrics.canceled} />
        <StatCard label="Overdue" value={project.metrics.overdue} help="Included in open tasks" />
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div className="min-w-0 space-y-5">
          <DashboardCard>
            <SectionHeader
              title="Upcoming work"
              actions={
                <Link
                  className="text-primary text-sm underline underline-offset-4"
                  to="/dashboard/projects/$projectId/list"
                  params={{ projectId: project.id }}
                  search={searchSchema.parse({ limit: 10 })}
                >
                  View all tasks
                </Link>
              }
            />
            <CardContent>
              {upcoming.length ? (
                <ul className="divide-y">
                  {upcoming.map((task) => (
                    <li key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <Link
                          className="hover:text-primary font-medium break-words hover:underline"
                          to="/dashboard/projects/$projectId/list"
                          params={{ projectId: project.id }}
                          search={searchSchema.parse({ query: task.title, limit: 10 })}
                        >
                          {task.title}
                        </Link>
                        <p className="text-muted-foreground mt-1 text-xs">
                          <TaskStatusLabel status={task.status} />
                        </p>
                      </div>
                      <time
                        className="text-muted-foreground shrink-0 text-xs"
                        dateTime={task.dueDate ?? undefined}
                        title={displayDate(task.dueDate)}
                      >
                        {relativeDueDate(task.dueDate, project.sampleDate)}
                      </time>
                      <PersonAvatar person={task.assignee} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground py-4">No upcoming work in {project.name}.</p>
              )}
            </CardContent>
          </DashboardCard>
          <DashboardCard>
            <SectionHeader title="Recent activity" />
            <CardContent>
              {activity?.length ? (
                <ol className="divide-y">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <PersonAvatar person={project.members.find((m) => m.id === a.actorId) ?? null} />
                      <div className="min-w-0">
                        <p>{a.detail}</p>
                        <time className="text-muted-foreground mt-1 block text-xs" dateTime={a.occurredAt}>
                          {relativeDueDate(a.occurredAt.slice(0, 10), project.sampleDate)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No activity in this project.</p>
              )}
            </CardContent>
          </DashboardCard>
        </div>
        <DashboardCard>
          <SectionHeader
            title="Team"
            actions={<span className="text-muted-foreground text-sm">{project.members.length} members</span>}
          />
          <CardContent className="space-y-5">
            {project.members.length ? (
              <ul className="space-y-3">
                {project.members.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    <PersonAvatar person={member} />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-muted-foreground text-xs">{member.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No members yet.</p>
            )}
            <dl className="space-y-3 border-t pt-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted-foreground">Started</dt>
                <dd>{displayDate(project.startDate)}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted-foreground">Target date</dt>
                <dd>{displayDate(project.dueDate)}</dd>
              </div>
            </dl>
            <Link
              className="text-primary inline-block text-sm underline underline-offset-4"
              to="/dashboard/projects/$projectId/files"
              params={{ projectId: project.id }}
              search={{ view: "grid" }}
            >
              Browse project files
            </Link>
          </CardContent>
        </DashboardCard>
      </div>
    </section>
  );
}
