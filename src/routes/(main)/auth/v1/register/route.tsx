import { createFileRoute } from "@tanstack/react-router";

import { Brand } from "@/components/brand/brand";
import { loadAuthRoute } from "@/lib/auth/auth-route";
import { authSearch } from "@/lib/auth/redirect";

import { AuthFlow } from "../../-components/auth-flow";
import { AuthSwitchLink } from "../../-components/auth-switch-link";
import { RegisterForm } from "../../-components/register-form";
import { ProviderControls } from "../../-components/social-auth/provider-controls";

export const Route = createFileRoute("/(main)/auth/v1/register")({
  validateSearch: authSearch,
  beforeLoad: loadAuthRoute,
  component: RegisterV1,
});

function RegisterV1() {
  const { auth, destination } = Route.useRouteContext();
  const search = Route.useSearch();
  return (
    <AuthFlow auth={auth} destination={destination} oauthError={!!search.error}>
      <div className="flex min-h-dvh">
        <div className="bg-background flex w-full items-center justify-center px-6 py-8 lg:w-2/3">
          <div className="w-full max-w-sm space-y-6 py-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium">Register</h1>
              <div className="text-muted-foreground text-sm">
                {auth.mode === "auth" ? "Create your sign-in account." : "Enter your details to explore the demo."}
              </div>
            </div>
            <div className="space-y-4">
              <RegisterForm />
              <ProviderControls />
              <p className="text-muted-foreground text-center text-xs">
                Already have an account? <AuthSwitchLink to="/auth/v1/login">Login</AuthSwitchLink>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary hidden lg:block lg:w-1/3">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="space-y-6">
              <Brand className="text-primary-foreground text-2xl" />
              <div className="space-y-2">
                <h2 className="text-primary-foreground text-3xl font-medium">Welcome!</h2>
                <p className="text-primary-foreground text-sm">You&apos;re in the right place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthFlow>
  );
}
