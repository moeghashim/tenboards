import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { DataProvider, useDashboardData } from "./-components/data-context";
import { presentGroups } from "./-components/infrastructure-data";
import { InfrastructureHeader } from "./-components/infrastructure-header";
import { ProjectEnvironments } from "./-components/project-environments";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requireSession } = await import("@/lib/auth/session.server");
  await requireSession();
  const { readInfrastructure } = await import("@/server/data/infrastructure");
  return readInfrastructure();
});
export const Route = createFileRoute("/(main)/dashboard/infrastructure")({
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
  const data = useDashboardData();
  const infrastructureGroups = presentGroups(data.groups);
  return (
    <div className="flex flex-col gap-4">
      <InfrastructureHeader />

      <div className="flex flex-col gap-4">
        {infrastructureGroups.map((group) => (
          <ProjectEnvironments key={group.name} group={group} />
        ))}
      </div>
    </div>
  );
}
