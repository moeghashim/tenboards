import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { DataProvider } from "./-components/data-context";
import { Logistics } from "./-components/logistics";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readLogistics } = await import("@/server/data/logistics");
  return readLogistics();
});
export const Route = createFileRoute("/(main)/dashboard/logistics")({
  loader: () => loadData(),
  component: Page,
});

function Page() {
  return (
    <DataProvider data={Route.useLoaderData()}>
      <PageContent />
    </DataProvider>
  );
}
function PageContent() {
  return <Logistics />;
}
