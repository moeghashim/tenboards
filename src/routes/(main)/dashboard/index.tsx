import { createFileRoute, redirect } from "@tanstack/react-router";

import { APP_LANDING_ROUTE } from "@/navigation/landing";

export const Route = createFileRoute("/(main)/dashboard/")({
  beforeLoad: () => {
    throw redirect({ to: APP_LANDING_ROUTE, replace: true });
  },
});
