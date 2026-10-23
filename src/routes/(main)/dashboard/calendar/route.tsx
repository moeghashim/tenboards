import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Calendar } from "./-components/calendar";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requestReference } = await import("@/server/request-reference.server");
  const { readCalendar } = await import("@/server/data/calendar");
  return readCalendar({ renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/dashboard/calendar")({
  loader: () => loadData(),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <Calendar {...data} />;
}
