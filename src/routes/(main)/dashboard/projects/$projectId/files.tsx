import { useState } from "react";

import { createFileRoute, getRouteApi, notFound, stripSearchParams } from "@tanstack/react-router";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { requireAppRoute } from "@/lib/auth/app-route";

import { fileKindLabels } from "../-components/file-manager/data";
import { FileGridView } from "../-components/file-manager/file-grid-view";
import { FileListView } from "../-components/file-manager/file-list-view";
import { FoldersSection } from "../-components/file-manager/folders-section";
import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { ProjectSelect } from "../-components/project-controls";
import { loadProjectFiles } from "../-components/project-view-functions";

const shell = getRouteApi("/(main)/dashboard/projects/$projectId");
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/files")({
  beforeLoad: requireAppRoute,
  validateSearch: (s: Record<string, unknown>): { view: "grid" | "list" } =>
    z.object({ view: z.enum(["grid", "list"]).catch("grid") }).parse(s),
  search: { middlewares: [stripSearchParams<{ view: "grid" | "list" }>({ view: "grid" })] },
  loader: async ({ params }) => {
    const d = await loadProjectFiles({ data: params });
    if (!d) throw notFound();
    return d;
  },
  component: Page,
  errorComponent: ProjectError,
  pendingComponent: ProjectPending,
});
function Page() {
  const { projectId } = Route.useParams();
  return <Files key={projectId} />;
}
function Files() {
  const data = Route.useLoaderData(),
    { view } = Route.useSearch(),
    navigate = Route.useNavigate(),
    { project } = shell.useLoaderData();
  const [query, setQuery] = useState(""),
    [kind, setKind] = useState("");
  const files = data.files.filter(
    (f) => (!kind || f.kind === kind) && f.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="space-y-5" aria-label="Project files">
      <h2 className="text-lg font-medium">Files</h2>
      <div className="flex flex-wrap items-end gap-3">
        <label htmlFor="project-file-query" className="flex min-w-48 flex-1 flex-col gap-1 text-xs">
          Search files
          <Input
            id="project-file-query"
            placeholder="File name"
            aria-label="Search files"
            value={query}
            maxLength={200}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <ProjectSelect
          label="File type"
          value={kind || "all"}
          options={[
            { value: "all", label: "All types" },
            ...Object.entries(fileKindLabels).map(([value, label]) => ({ value, label })),
          ]}
          onChange={(value) => setKind(value === "all" ? "" : value)}
        />
        <ToggleGroup
          aria-label="File display"
          value={[view]}
          variant="outline"
          spacing={0}
          onValueChange={(values) => {
            if (values[0]) void navigate({ search: { view: values[0] as "grid" | "list" }, replace: true });
          }}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {!query && !kind && <FoldersSection folders={data.folders} />}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{query || kind ? "Search results" : "All files"}</h3>
        <p className="text-muted-foreground text-sm" role="status">
          {files.length} {files.length === 1 ? "file" : "files"}
        </p>
      </div>
      {files.length > 0 && (view === "grid" ? <FileGridView files={files} /> : <FileListView files={files} />)}
      {!files.length && (
        <p className="text-muted-foreground">
          No matching files in {project?.name}. Clear search or choose another file type.
        </p>
      )}
      {data.files.length < data.total && (
        <p className="text-muted-foreground">
          Showing the first {data.files.length} of {data.total} files.
        </p>
      )}
    </section>
  );
}
