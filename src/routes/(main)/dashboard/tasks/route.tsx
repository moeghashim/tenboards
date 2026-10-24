import { createFileRoute, redirect } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { searchSchema } from "../projects/-components/project-search";
export const Route = createFileRoute("/(main)/dashboard/tasks")({
  beforeLoad: async ({ location }) => {
    await requireAppRoute({ location });
    throw redirect({
      to: "/dashboard/projects/$projectId/list",
      params: { projectId: "sample-operations" },
      search: searchSchema.parse({ limit: 10 }),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
