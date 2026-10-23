import { createFileRoute } from "@tanstack/react-router";

import { RegisterForm } from "../../-components/register-form";
import { AuthFrame } from "../-components/auth-frame";

export const Route = createFileRoute("/(main)/auth/v2/register")({
  component: RegisterV2,
});

function RegisterV2() {
  return (
    <AuthFrame mode="register">
      <RegisterForm />
    </AuthFrame>
  );
}
