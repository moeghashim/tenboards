import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Kanban } from "./-components/kanban";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readKanban } = await import("@/server/data/kanban");
  return readKanban();
});

export const Route = createFileRoute("/(main)/dashboard/kanban")({
  validateSearch: (search: Record<string, unknown>): { view: "board" | "list" | "table" } => ({
    view: search.view === "list" || search.view === "table" ? search.view : "board",
  }),
  loader: () => loadData(),
  component: Page,
});

function Page() {
  const { board: initialBoard, columns } = Route.useLoaderData();
  return (
    <div data-content-padding="false">
      <Kanban initialBoard={initialBoard} columns={columns} />
    </div>
  );
}
