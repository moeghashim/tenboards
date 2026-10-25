import { type ErrorComponentProps, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
export function ProjectMissing() {
  return (
    <section className="space-y-4 py-10">
      <h1 className="text-2xl font-medium">Project not found</h1>
      <p className="text-muted-foreground">Check the project address. No project was substituted.</p>
      <Link to="/dashboard/default" className="text-primary underline underline-offset-4">
        Return to dashboard
      </Link>
    </section>
  );
}
export function ProjectError({ reset }: ErrorComponentProps) {
  return (
    <section role="alert" className="space-y-4 py-10">
      <h2 className="text-lg font-medium">Unable to load this project</h2>
      <p className="text-muted-foreground">The project data could not be loaded. Try again.</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}
export function ProjectPending() {
  return (
    <div role="status" className="space-y-4 py-6">
      <p>Loading project…</p>
      <div className="bg-muted h-12 rounded-lg" />
      <div className="bg-muted h-40 rounded-lg" />
    </div>
  );
}
