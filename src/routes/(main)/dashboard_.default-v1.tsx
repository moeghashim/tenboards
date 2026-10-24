import { createFileRoute, redirect } from "@tanstack/react-router";

import { authSearch } from "@/lib/auth/redirect";

export const Route = createFileRoute("/(main)/dashboard_/default-v1")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/dashboard/default",
      search: authSearch(location.search),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
