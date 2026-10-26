import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";

export const Route = createFileRoute("/(main)/dashboard/guardrail-probe")({
  component: GuardrailProbe,
});

function GuardrailProbe() {
  return <PageHeader title="Guardrail probe" description="A new page using the existing shell and blocks." />;
}
