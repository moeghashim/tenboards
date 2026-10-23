import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/dashboard/coming-soon")({
  component: Page,
});

function Page() {
  return (
    <div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <h1 className="text-2xl font-medium">Coming soon</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        This page is under development and will be available in future updates.
      </p>
    </div>
  );
}
