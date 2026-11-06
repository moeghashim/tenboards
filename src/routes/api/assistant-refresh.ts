import { createFileRoute } from "@tanstack/react-router";

import { handleRefresh } from "@/server/assistant/refresh.server";
export const Route = createFileRoute("/api/assistant-refresh")({
  server: { handlers: { POST: ({ request }) => handleRefresh(request), GET: ({ request }) => handleRefresh(request) } },
});
