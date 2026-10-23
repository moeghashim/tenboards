import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "../-components/app-pages/page-header";
import { tasks } from "./-components/data";
import { Tasks } from "./-components/tasks";

export const Route = createFileRoute("/(main)/dashboard/tasks")({
  component: Page,
});

function Page() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Tasks" description="Here's a list of your tasks for this month." />
      <Tasks data={tasks} />
    </div>
  );
}
