import { createFileRoute, Link } from "@tanstack/react-router";

import { Brand } from "@/components/brand/brand";
import { loadAuthRoute } from "@/lib/auth/auth-route";
import { authSearch } from "@/lib/auth/redirect";

import { AuthFlow } from "../../-components/auth-flow";
import { LoginForm } from "../../-components/login-form";
import { ProviderControls } from "../../-components/social-auth/provider-controls";

export const Route = createFileRoute("/(main)/auth/v1/login")({
  validateSearch: authSearch,
  beforeLoad: loadAuthRoute,
  component: LoginV1,
});

function LoginV1() {
  const { auth, destination } = Route.useRouteContext();
  const search = Route.useSearch();
  return (
    <AuthFlow auth={auth} destination={destination} oauthError={!!search.error}>
      <div className="flex min-h-dvh">
        <div className="bg-primary hidden lg:block lg:w-1/3">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="space-y-6">
              <Brand className="text-primary-foreground text-2xl" />
              <div className="space-y-2">
                <h2 className="text-primary-foreground text-3xl font-medium">Hello again</h2>
                <p className="text-primary-foreground text-sm">Login to continue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background flex w-full items-center justify-center px-6 py-8 lg:w-2/3">
          <div className="w-full max-w-sm space-y-6 py-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium">Login</h1>
              <div className="text-muted-foreground text-sm">
                {auth.mode === "auth"
                  ? "Welcome back. Sign in to continue."
                  : "Welcome back. Enter your details to try the demo."}
              </div>
            </div>
            <div className="space-y-4">
              <LoginForm />
              <ProviderControls />
              <p className="text-muted-foreground text-center text-xs">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/v1/register"
                  search={{ redirect: destination }}
                  className="text-primary focus-visible:outline-ring rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthFlow>
  );
}
