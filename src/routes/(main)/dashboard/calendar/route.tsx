import { createFileRoute } from "@tanstack/react-router";

import { Calendar } from "./-components/calendar";

export const Route = createFileRoute("/(main)/dashboard/calendar")({
  loader: () => ({ renderedAt: new Date().toISOString() }),
  component: Page,
});

function Page() {
  const { renderedAt } = Route.useLoaderData();
  return <Calendar renderedAt={renderedAt} />;
}
