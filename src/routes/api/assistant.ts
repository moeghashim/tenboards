import { createFileRoute } from "@tanstack/react-router";

import { handleAssistant } from "@/server/assistant/endpoint.server";
export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: ({ request }) => handleAssistant(request),
      GET: ({ request }) => handleAssistant(request),
      PUT: ({ request }) => handleAssistant(request),
      PATCH: ({ request }) => handleAssistant(request),
      DELETE: ({ request }) => handleAssistant(request),
      OPTIONS: ({ request }) => handleAssistant(request),
      HEAD: ({ request }) => handleAssistant(request),
    },
  },
});
