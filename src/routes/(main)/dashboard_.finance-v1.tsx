import { createFileRoute, redirect } from "@tanstack/react-router";

import { authSearch } from "@/lib/auth/redirect";

export const Route = createFileRoute("/(main)/dashboard_/finance-v1")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/dashboard/finance",
      search: authSearch(location.search),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
