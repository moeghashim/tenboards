import { useState } from "react";

import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { requireAppRoute } from "@/lib/auth/app-route";

import { fileKindLabels } from "../../file-manager/-components/data";
import { FileGridView } from "../../file-manager/-components/file-grid-view";
import { FileListView } from "../../file-manager/-components/file-list-view";
import { FoldersSection } from "../../file-manager/-components/folders-section";
import { ProjectError, ProjectPending } from "../-components/project-boundaries";
import { loadProjectFiles } from "../-components/project-view-functions";

const shell = getRouteApi("/(main)/dashboard/projects/$projectId");
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/files")({
  beforeLoad: requireAppRoute,
  validateSearch: (s) => z.object({ view: z.enum(["grid", "list"]).catch("grid") }).parse(s),
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
      <p className="text-muted-foreground text-sm">
        Read-only sample metadata. Shared and starred labels are sample attributes. No files are uploaded, downloaded or
        shared here.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <label htmlFor="project-file-query" className="flex min-w-48 flex-1 flex-col gap-1 text-xs">
          Search files
          <Input
            id="project-file-query"
            aria-label="Search files"
            value={query}
            maxLength={200}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          File type
          <select
            aria-label="File type"
            className="border-border-strong bg-background h-8 rounded-lg border px-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">All types</option>
            {Object.entries(fileKindLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Display
          <select
            aria-label="File display"
            className="border-border-strong bg-background h-8 rounded-lg border px-2 text-sm"
            value={view}
            onChange={(e) => void navigate({ search: { view: e.target.value as "grid" | "list" }, replace: true })}
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </label>
      </div>
      <FoldersSection folders={data.folders} readOnly />
      <p className="text-muted-foreground text-xs">
        Folders show sample summary counts and sizes. No file-folder membership is asserted; all loaded files are shown
        at project root.
      </p>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Files at project root</h3>
        <p className="text-muted-foreground text-sm" role="status">
          {files.length} matching · {data.files.length} loaded / {data.total} total
        </p>
      </div>
      {files.length > 0 &&
        (view === "grid" ? <FileGridView files={files} readOnly /> : <FileListView files={files} readOnly />)}
      {!files.length && (
        <p className="text-muted-foreground">
          No matching files in {project?.name}. Clear search or choose another file type.
        </p>
      )}
      {data.files.length < data.total && (
        <p className="text-muted-foreground">
          This sample view shows the first {data.files.length} files. Additional metadata is not loaded.
        </p>
      )}
    </section>
  );
}
