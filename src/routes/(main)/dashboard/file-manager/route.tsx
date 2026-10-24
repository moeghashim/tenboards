import { createFileRoute, redirect } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

export const Route = createFileRoute("/(main)/dashboard/file-manager")({
  beforeLoad: async ({ location }) => {
    const view = (location.search as Record<string, unknown>).view;
    await requireAppRoute({ location });
    throw redirect({
      to: "/dashboard/projects/$projectId/files",
      params: { projectId: "sample-operations" },
      search: { view: view === "list" ? "list" : "grid" },
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
