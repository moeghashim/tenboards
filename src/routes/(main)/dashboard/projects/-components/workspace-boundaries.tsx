import type { ErrorComponentProps } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
export function WorkspaceError({ reset }: ErrorComponentProps) {
  return (
    <section role="alert" className="space-y-4 py-10">
      <h1 className="text-xl font-medium">Unable to load the workspace</h1>
      <p className="text-muted-foreground">The workspace could not be loaded. Try again.</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}
export function WorkspacePending() {
  return (
    <div role="status" className="space-y-4 py-6">
      <p>Loading workspace…</p>
      <div className="bg-muted h-12 rounded-lg" />
      <div className="bg-muted h-40 rounded-lg" />
    </div>
  );
}
