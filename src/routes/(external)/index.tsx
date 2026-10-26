import { createFileRoute, redirect } from "@tanstack/react-router";

import { APP_LANDING_ROUTE } from "@/navigation/landing";

export const Route = createFileRoute("/(external)/")({
  beforeLoad: () => {
    throw redirect({ href: APP_LANDING_ROUTE, replace: true });
  },
});
