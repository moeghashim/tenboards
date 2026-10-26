import { createFileRoute, stripSearchParams } from "@tanstack/react-router";

import { FolderSearch } from "lucide-react";

import { PageHeader } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAppRoute } from "@/lib/auth/app-route";
import { projectStatuses } from "@/server/data/projects.types";

import { ProjectSelect, useSearchDraft } from "./-components/project-controls";
import { projectIndexSearch } from "./-components/project-index-search";
import { ProjectSummaryCard } from "./-components/project-summary-card";
import { WorkspaceError, WorkspacePending } from "./-components/workspace-boundaries";
import { loadProjectsIndex } from "./-components/workspace-functions";
export const Route = createFileRoute("/(main)/dashboard/projects/")({
  beforeLoad: requireAppRoute,
  validateSearch: (s: Record<string, unknown>): ReturnType<typeof projectIndexSearch.parse> =>
    projectIndexSearch.parse(s),
  search: { middlewares: [stripSearchParams<ReturnType<typeof projectIndexSearch.parse>>({ query: "" })] },
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loadProjectsIndex({ data: deps }),
  component: Page,
  errorComponent: WorkspaceError,
  pendingComponent: WorkspacePending,
});
function Page() {
  const { projects, total } = Route.useLoaderData(),
    search = Route.useSearch(),
    navigate = Route.useNavigate();
  const update = (next: Partial<typeof search>) => void navigate({ search: { ...search, ...next }, replace: true });
  const [query, setQuery] = useSearchDraft(search.query, (query) => update({ query }));
  return (
    <section className="min-w-0 space-y-5" aria-label="Projects index">
      <PageHeader title="Projects" description="Find your next task, check progress, and see what is coming up." />
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs" htmlFor="projects-search">
          Search projects
          <Input
            id="projects-search"
            value={query}
            maxLength={200}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or description"
          />
        </label>
        <ProjectSelect
          label="Project status"
          value={search.status ?? "all"}
          options={[
            { value: "all", label: "All statuses" },
            ...projectStatuses.map((value) => ({
              value,
              label: value[0].toUpperCase() + value.slice(1).replaceAll("-", " "),
            })),
          ]}
          onChange={(v) => update({ status: v === "all" ? undefined : (v as typeof search.status) })}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            update({ query: "", status: undefined });
          }}
        >
          Reset filters
        </Button>
      </div>
      <p role="status" className="text-muted-foreground text-sm">
        {projects.length} of {total} projects
      </p>
      {projects.length ? (
        <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectSummaryCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border py-12 text-center">
          <FolderSearch aria-hidden="true" className="text-muted-foreground size-7" />
          <h2 className="text-base font-medium">{total ? "No matching projects" : "No projects yet"}</h2>
          <p className="text-muted-foreground max-w-sm px-4">
            {total
              ? "Try another name or clear the filters to see all projects."
              : "Projects will appear here when they are available."}
          </p>
          {total > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                update({ query: "", status: undefined });
              }}
            >
              Show all projects
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
