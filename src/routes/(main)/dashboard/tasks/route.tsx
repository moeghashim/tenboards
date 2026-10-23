import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { PageHeader } from "../-components/app-pages/page-header";
import { Tasks } from "./-components/tasks";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readTasks } = await import("@/server/data/tasks");
  return readTasks();
});

export const Route = createFileRoute("/(main)/dashboard/tasks")({
  loader: () => loadData(),
  component: Page,
});

function Page() {
  const tasks = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Tasks" description="Here's a list of your tasks for this month." />
      <Tasks data={tasks} />
    </div>
  );
}
