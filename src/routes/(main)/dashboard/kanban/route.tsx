import { createFileRoute, redirect } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { searchSchema } from "../projects/-components/project-search";
export const Route = createFileRoute("/(main)/dashboard/kanban")({
  beforeLoad: async ({ location }) => {
    const view = (location.search as Record<string, unknown>).view;
    await requireAppRoute({ location });
    throw redirect({
      to:
        view === "list" || view === "table"
          ? "/dashboard/projects/$projectId/list"
          : "/dashboard/projects/$projectId/board",
      params: { projectId: "sample-operations" },
      search: searchSchema.parse({
        limit: view === "list" || view === "table" ? 10 : 100,
      }),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
