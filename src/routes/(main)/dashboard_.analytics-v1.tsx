import { createFileRoute, redirect } from "@tanstack/react-router";

import { authSearch } from "@/lib/auth/redirect";

export const Route = createFileRoute("/(main)/dashboard_/analytics-v1")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/dashboard/analytics",
      search: authSearch(location.search),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
