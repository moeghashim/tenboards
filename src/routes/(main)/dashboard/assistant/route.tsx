import { createFileRoute } from "@tanstack/react-router";

import { getAssistantConfig } from "@/lib/assistant/server-functions";

import { Assistant } from "./-components/assistant";

export const Route = createFileRoute("/(main)/dashboard/assistant")({
  loader: () => getAssistantConfig(),
  component: AssistantPage,
});

function AssistantPage() {
  return <Assistant config={Route.useLoaderData()} />;
}
