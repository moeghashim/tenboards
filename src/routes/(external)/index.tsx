import { createFileRoute } from "@tanstack/react-router";

import { Homepage } from "./-components/homepage";

const title = "tenboards — An agent-ready dashboard template";
const description =
  "An MIT-licensed dashboard template for Codex, Claude Code and you. Build with Agent Skills, page generators, public blocks and design guardrails. Explore the zero-config demo.";

export const Route = createFileRoute("/(external)/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Homepage,
});
