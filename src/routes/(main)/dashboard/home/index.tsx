import { useEffect, useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";

import { CardContent } from "@/components/ui/card";
import { requireAppRoute } from "@/lib/auth/app-route";
import type { Task } from "@/server/data/projects.types";

import { PageHeader } from "../-components/app-pages/page-header";
import { DashboardCard, SectionHeader, StatCard } from "../-components/dashboard/cards";
import { displayDate, relativeDueDate, searchSchema } from "../projects/-components/project-search";
import { ProjectSummaryCard } from "../projects/-components/project-summary-card";
import { PersonAvatar, TaskStatusLabel, taskKey } from "../projects/-components/task-presentation";
import { WorkspaceError, WorkspacePending } from "../projects/-components/workspace-boundaries";
import { loadWorkspaceHome } from "../projects/-components/workspace-functions";
export const Route = createFileRoute("/(main)/dashboard/home/")({
  beforeLoad: requireAppRoute,
  loader: () => loadWorkspaceHome(),
  component: Page,
  errorComponent: WorkspaceError,
  pendingComponent: WorkspacePending,
});
type Home = Awaited<ReturnType<typeof loadWorkspaceHome>>;
function WorkList({
  title,
  description,
  tasks,
  total,
  home,
  className,
}: {
  title: string;
  description?: string;
  tasks: Task[];
  total: number;
  home: Home;
  className?: string;
}) {
  return (
    <DashboardCard className={className}>
      <SectionHeader
        title={title}
        description={description}
        actions={
          <span role="status" className="text-muted-foreground text-xs">
            {tasks.length} of {total}
          </span>
        }
      />
      <CardContent>
        {tasks.length ? (
          <ul className="divide-y">
            {tasks.map((task) => {
              const project = home.projects.find((p) => p.id === task.projectId);
              return (
                <li key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <Link
                      className="hover:text-primary font-medium break-words hover:underline"
                      to="/dashboard/projects/$projectId/list"
                      params={{ projectId: task.projectId }}
                      search={searchSchema.parse({ query: task.title, limit: 10 })}
                    >
                      {task.title}
                    </Link>
                    <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span>
                        {taskKey(task)} · {project?.name ?? "Project"}
                      </span>
                      <TaskStatusLabel status={task.status} />
                    </p>
                  </div>
                  <time
                    className="text-muted-foreground shrink-0 text-xs"
                    dateTime={task.dueDate ?? undefined}
                    title={displayDate(task.dueDate)}
                  >
                    {relativeDueDate(task.dueDate, home.sampleDate)}
                  </time>
                  <PersonAvatar person={task.assignee} />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4">
            {title === "My tasks" ? "No open tasks assigned to this member." : "No upcoming deadlines."}
          </p>
        )}
      </CardContent>
    </DashboardCard>
  );
}
function Page() {
  const home = Route.useLoaderData();
  const [local, setLocal] = useState(false);
  useEffect(() => setLocal(true), []);
  const date = new Date(home.renderedAt);
  const hour = local ? date.getHours() : date.getUTCHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  const member = home.projects.flatMap((p) => p.members).find((m) => m.id === home.sampleMember);
  return (
    <section className="min-w-0 space-y-5" aria-label="Workspace home">
      <PageHeader
        title={greeting}
        description="A clear view of your workspace, from today's tasks to the next milestone."
        actions={
          <Link
            className="text-primary text-sm underline underline-offset-4"
            to="/dashboard/projects"
            search={{ query: "" }}
          >
            Browse projects
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Open tasks" value={home.metrics.open} />
        <StatCard label="Overdue" value={home.metrics.overdue} />
        <StatCard label="Completed" value={home.metrics.completed} />
        <StatCard label="Active projects" value={home.activeProjects} />
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <WorkList
          className="xl:col-start-1 xl:row-start-1"
          title="My tasks"
          description={`${member?.name ?? "Sample member"} · sample member`}
          tasks={home.myTasks}
          total={home.myTaskTotal}
          home={home}
        />
        <WorkList
          className="xl:col-start-2 xl:row-span-2 xl:row-start-1"
          title="Upcoming deadlines"
          tasks={home.upcoming}
          total={home.upcomingTotal}
          home={home}
        />
        <section className="space-y-3 xl:col-span-2 xl:row-start-3" aria-labelledby="home-project-progress">
          <div className="flex items-center justify-between gap-3">
            <h2 id="home-project-progress" className="text-base font-medium">
              Project progress
            </h2>
            <span className="text-muted-foreground text-sm">{home.projects.length} projects</span>
          </div>
          {home.projects.length ? (
            <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {home.projects.map((project) => (
                <ProjectSummaryCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects yet.</p>
          )}
        </section>
        <DashboardCard className="xl:col-start-1 xl:row-start-2">
          <SectionHeader title="Recent activity" />
          <CardContent>
            {home.activity.length ? (
              <ol className="divide-y">
                {home.activity.map((a) => {
                  const project = home.projects.find((p) => p.id === a.projectId);
                  return (
                    <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <PersonAvatar person={project?.members.find((m) => m.id === a.actorId) ?? null} />
                      <div className="min-w-0 flex-1">
                        <p>{a.detail}</p>
                        <Link
                          className="text-muted-foreground mt-1 inline-block text-xs underline underline-offset-4"
                          to="/dashboard/projects/$projectId/overview"
                          params={{ projectId: a.projectId }}
                        >
                          {project?.name ?? "View project"}
                        </Link>
                      </div>
                      <time className="text-muted-foreground text-xs" dateTime={a.occurredAt}>
                        {relativeDueDate(a.occurredAt.slice(0, 10), home.sampleDate)}
                      </time>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
          </CardContent>
        </DashboardCard>
      </div>
    </section>
  );
}
