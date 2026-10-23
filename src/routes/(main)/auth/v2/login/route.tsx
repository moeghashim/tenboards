import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "../../-components/login-form";
import { AuthFrame } from "../-components/auth-frame";

export const Route = createFileRoute("/(main)/auth/v2/login")({
  component: LoginV2,
});

function LoginV2() {
  return (
    <AuthFrame mode="login">
      <LoginForm />
    </AuthFrame>
  );
}
