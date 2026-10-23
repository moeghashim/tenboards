import { createFileRoute, Link } from "@tanstack/react-router";

import { Brand } from "@/components/brand/brand";

import { RegisterForm } from "../../-components/register-form";
import { GoogleButton } from "../../-components/social-auth/google-button";

export const Route = createFileRoute("/(main)/auth/v1/register")({
  component: RegisterV1,
});

function RegisterV1() {
  return (
    <div className="flex min-h-dvh">
      <div className="bg-background flex w-full items-center justify-center px-6 py-8 lg:w-2/3">
        <div className="w-full max-w-sm space-y-6 py-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium">Register</h1>
            <div className="text-muted-foreground text-sm">Enter your details to explore the demo.</div>
          </div>
          <div className="space-y-4">
            <RegisterForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-muted-foreground text-center text-xs">
              Already have an account?{" "}
              <Link
                to="/auth/v1/login"
                className="text-primary focus-visible:outline-ring rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Login
              </Link>
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
  );
}
