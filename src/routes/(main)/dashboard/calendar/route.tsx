import { createFileRoute, redirect } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { timelineSearch } from "../projects/-components/timeline-search";
export const Route = createFileRoute("/(main)/dashboard/calendar")({
  beforeLoad: async ({ location }) => {
    await requireAppRoute({ location });
    throw redirect({
      to: "/dashboard/projects/$projectId/timeline",
      params: { projectId: "sample-operations" },
      search: timelineSearch.parse({ mode: "calendar" }),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
