import { createFileRoute } from "@tanstack/react-router";

import { loadAuthRoute } from "@/lib/auth/auth-route";
import { authSearch } from "@/lib/auth/redirect";

import { AuthFlow } from "../../-components/auth-flow";
import { RegisterForm } from "../../-components/register-form";
import { AuthFrame } from "../-components/auth-frame";

export const Route = createFileRoute("/(main)/auth/v2/register")({
  validateSearch: authSearch,
  beforeLoad: loadAuthRoute,
  component: RegisterV2,
});

function RegisterV2() {
  const { auth, destination } = Route.useRouteContext();
  const search = Route.useSearch();
  return (
    <AuthFlow auth={auth} destination={destination} oauthError={!!search.error}>
      <AuthFrame mode="register">
        <RegisterForm />
      </AuthFrame>
    </AuthFlow>
  );
}
