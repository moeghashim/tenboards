import { createContext, type ReactNode, useContext, useRef, useState } from "react";

import { authClient, authError, finishSignIn } from "@/lib/auth/client";
import { authDestination, authErrorCallback } from "@/lib/auth/redirect";
import type { AuthState } from "@/lib/auth/types";

const FlowContext = createContext<{
  auth: AuthState;
  destination: string;
  pending: boolean;
  error: string;
  submit: (
    action: () => Promise<{ error: { code?: string; status?: number } | null }>,
    navigate?: boolean,
  ) => Promise<void>;
} | null>(null);
export function AuthFlow({
  auth,
  destination,
  oauthError,
  children,
}: {
  auth: AuthState;
  destination: string;
  oauthError?: boolean;
  children: ReactNode;
}) {
  const submitting = useRef<boolean>(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(
    oauthError ? "Provider sign-in was not completed. Try again or use email and password." : "",
  );
  async function submit(action: () => Promise<{ error: { code?: string; status?: number } | null }>, navigate = true) {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      const result = await action();
      if (result.error) setError(authError(result.error));
      else if (navigate) finishSignIn(destination);
    } catch {
      setError(authError());
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return <FlowContext.Provider value={{ auth, destination, pending, error, submit }}>{children}</FlowContext.Provider>;
}
export function useAuthFlow() {
  const flow = useContext(FlowContext);
  if (!flow) throw new Error("Auth flow context is missing.");
  return flow;
}
export function AuthFeedback() {
  const { pending, error } = useAuthFlow();
  return (
    <>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <span role="status" className="sr-only">
        {pending ? "Submitting. Please wait." : ""}
      </span>
    </>
  );
}
export function useProviderSignIn() {
  const flow = useAuthFlow();
  return (provider: "google" | "github") => {
    if (flow.auth.mode === "demo") return;
    return flow.submit(
      () =>
        authClient.signIn.social({
          provider,
          callbackURL: authDestination(flow.destination),
          errorCallbackURL: authErrorCallback(window.location.pathname, flow.destination),
        }),
      false,
    );
  };
}
