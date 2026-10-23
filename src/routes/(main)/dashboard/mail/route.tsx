import { createFileRoute, Link } from "@tanstack/react-router";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(main)/dashboard/mail")({
  component: Page,
});

function Page() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base leading-tight font-medium">Mail preview</h1>
          <p className="text-muted-foreground text-sm">
            This iframe shows the standalone mail screen. Open it in full screen for a better view.
          </p>
        </div>
        <Button
          render={<Link to="/mail" target="_blank" rel="noreferrer" aria-label="Open mail in new tab" />}
          nativeButton={false}
          variant="ghost"
          size="icon-sm"
        >
          <ExternalLink />
        </Button>
      </div>

      <iframe src="/mail" title="Mail preview" className="bg-card min-h-0 w-full flex-1 rounded-xl border" />
    </div>
  );
}
