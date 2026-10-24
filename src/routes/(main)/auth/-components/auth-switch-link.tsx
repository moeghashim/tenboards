import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { useAuthFlow } from "./auth-flow";

export function AuthSwitchLink({ to, children }: { to: "/auth/v1/login" | "/auth/v1/register"; children: ReactNode }) {
  const { destination } = useAuthFlow();
  return (
    <Link
      to={to}
      search={{ redirect: destination }}
      className="text-primary focus-visible:outline-ring rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {children}
    </Link>
  );
}
