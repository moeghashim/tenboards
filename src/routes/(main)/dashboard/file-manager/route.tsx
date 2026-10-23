import { createFileRoute, Link } from "@tanstack/react-router";

import { FolderPlus, Grid2X2, List, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { PageHeader } from "../-components/app-pages/page-header";
import { type FileManagerView, files, folders } from "./-components/data";
import { FileGridView } from "./-components/file-grid-view";
import { FileListView } from "./-components/file-list-view";
import { FileManagerToolbar } from "./-components/file-manager-toolbar";
import { FoldersSection } from "./-components/folders-section";

export const Route = createFileRoute("/(main)/dashboard/file-manager")({
  validateSearch: (search: Record<string, unknown>): { view: FileManagerView } => ({
    view: search.view === "list" ? "list" : "grid",
  }),
  component: Page,
});

function Page() {
  const { view: activeView } = Route.useSearch();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="My files"
        description="Organize, share, and find workspace files."
        actions={
          <>
            <Button variant="outline">
              <FolderPlus data-icon="inline-start" />
              New folder
            </Button>
            <Button>
              <Upload data-icon="inline-start" />
              Upload
            </Button>
          </>
        }
      />
      <FileManagerToolbar />
      <FoldersSection folders={folders} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">All files</h2>
          <ToggleGroup variant="outline" size="sm" spacing={0} value={[activeView]} aria-label="File view">
            <ToggleGroupItem
              value="grid"
              nativeButton={false}
              render={<Link from={Route.fullPath} search={(previous) => ({ ...previous, view: "grid" })} replace />}
            >
              <Grid2X2 />
              Grid View
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              nativeButton={false}
              render={<Link from={Route.fullPath} search={(previous) => ({ ...previous, view: "list" })} replace />}
            >
              <List />
              List View
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {activeView === "list" ? <FileListView files={files} /> : <FileGridView files={files} />}
      </div>
    </div>
  );
}
