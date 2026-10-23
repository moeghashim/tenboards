import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Users } from "./-components/users";

const loadUsers = createServerFn({ method: "GET" }).handler(async () => {
  const { readUsers } = await import("@/server/data/users");
  return readUsers();
});

export const Route = createFileRoute("/(main)/dashboard/users")({
  loader: () => loadUsers(),
  component: Page,
});

function Page() {
  const users = Route.useLoaderData();
  return <Users users={users} />;
}
