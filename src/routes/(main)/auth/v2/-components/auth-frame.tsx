import type { ReactNode } from "react";

import { getRouteApi, Link } from "@tanstack/react-router";

import { Globe } from "lucide-react";

import { GoogleButton } from "../../-components/social-auth/google-button";

const route = getRouteApi("/(main)/auth/v2");

export function AuthFrame({ mode, children }: { mode: "login" | "register"; children: ReactNode }) {
  const { copyright } = route.useLoaderData();
  const login = mode === "login";
  return (
    <div className="flex min-h-dvh flex-1 flex-col gap-8 px-6 py-6 sm:px-10">
      <nav aria-label="Account" className="text-muted-foreground text-right text-sm">
        {login ? "Don't have an account? " : "Already have an account? "}
        <Link
          className="text-foreground focus-visible:outline-ring rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
          to={login ? "/auth/v2/register" : "/auth/v2/login"}
        >
          {login ? "Register" : "Login"}
        </Link>
      </nav>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium">{login ? "Login to your account" : "Create your account"}</h1>
          <p className="text-muted-foreground text-sm">
            {login ? "Enter your details to try the demo." : "Enter your details to explore the demo."}
          </p>
        </div>
        <div className="space-y-4">
          <GoogleButton className="w-full" variant="outline" />
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="bg-border h-px flex-1" />
            Or continue with
            <span className="bg-border h-px flex-1" />
          </div>
          {children}
        </div>
      </div>
      <footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xs">
        <span>{copyright}</span>
        <span className="flex items-center gap-1">
          <Globe aria-hidden="true" className="size-4" />
          ENG
        </span>
      </footer>
    </div>
  );
}
