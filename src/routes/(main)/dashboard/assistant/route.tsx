import { createFileRoute } from "@tanstack/react-router";

import { Assistant } from "./-components/assistant";

export const Route = createFileRoute("/(main)/dashboard/assistant")({ component: Assistant });
