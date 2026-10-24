import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { displayDate, searchSchema, statusLabels } from "../-components/project-search";
import { loadProjectOverview } from "../-components/project-view-functions";
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
    <section className="space-y-6" aria-label="Project overview">
      <h2 className="text-lg font-medium">Overview</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y py-4 lg:grid-cols-4">
        {[
          ["Open tasks", project.metrics.open],
          ["Completed", project.metrics.completed],
          ["Canceled", project.metrics.canceled],
          ["Overdue", project.metrics.overdue],
          ["Start", displayDate(project.startDate)],
          ["Due", displayDate(project.dueDate)],
          ["Progress", `${project.metrics.progress}%`],
          ["Members", project.members.length],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground text-xs">{label}</dt>
            <dd className="mt-1 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-muted-foreground text-xs">
        Deadline reference: June 20, 2026. Progress excludes canceled work. Membership is sample metadata.
      </p>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium">Upcoming work</h3>
            <Link
              className="text-primary underline underline-offset-4"
              to="/dashboard/projects/$projectId/list"
              params={{ projectId: project.id }}
              search={searchSchema.parse({ limit: 10 })}
            >
              View all tasks
            </Link>
          </div>
          {upcoming.length ? (
            <ul className="divide-y">
              {upcoming.map((t) => (
                <li key={t.id} className="flex flex-wrap justify-between gap-2 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-words">{t.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {statusLabels[t.status]} · {t.assignee?.name ?? "Unassigned"}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">{displayDate(t.dueDate)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No upcoming dated work in {project.name}.</p>
          )}
          <Link
            className="text-primary inline-block underline underline-offset-4"
            to="/dashboard/projects/$projectId/files"
            params={{ projectId: project.id }}
            search={{ view: "grid" }}
          >
            Browse project files
          </Link>
        </section>
        <section className="space-y-3">
          <h3 className="font-medium">Sample members</h3>
          {project.members.length ? (
            <ul className="space-y-3">
              {project.members.map((m) => (
                <li key={m.id}>
                  <p>{m.name}</p>
                  <p className="text-muted-foreground text-xs">{m.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No sample members.</p>
          )}
        </section>
      </div>
      <section className="space-y-3">
        <h3 className="font-medium">Recent sample activity</h3>
        {activity?.length ? (
          <ol className="divide-y">
            {activity.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2 py-3">
                <span>{a.detail}</span>
                <time className="text-muted-foreground text-xs" dateTime={a.occurredAt}>
                  {a.occurredAt.slice(0, 10)}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">No activity in this project.</p>
        )}
      </section>
    </section>
  );
}
