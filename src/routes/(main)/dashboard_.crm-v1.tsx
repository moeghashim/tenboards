import { createFileRoute, redirect } from "@tanstack/react-router";

import { authSearch } from "@/lib/auth/redirect";

export const Route = createFileRoute("/(main)/dashboard_/crm-v1")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/dashboard/crm",
      search: authSearch(location.search),
      hash: location.hash,
      statusCode: 308,
      replace: true,
    });
  },
});
