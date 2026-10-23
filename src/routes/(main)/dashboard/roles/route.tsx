import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Roles } from "./-components/roles";

const loadRoles = createServerFn({ method: "GET" }).handler(async () => {
  const { readRoles } = await import("@/server/data/roles");
  return readRoles();
});

export const Route = createFileRoute("/(main)/dashboard/roles")({
  loader: () => loadRoles(),
  component: Page,
});

function Page() {
  const roles = Route.useLoaderData();
  return <Roles roles={roles} />;
}
