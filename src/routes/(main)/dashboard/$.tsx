import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/dashboard/$")({
  component: DashboardNotFound,
});

function DashboardNotFound() {
  return (
    <div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <h1 className="text-2xl font-medium">Page not found.</h1>
      <p className="text-muted-foreground max-w-sm text-sm">This dashboard page does not exist.</p>
      <Link to="/dashboard/home" className="underline underline-offset-4">
        Return to Home
      </Link>
    </div>
  );
}
