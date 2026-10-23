import { createFileRoute } from "@tanstack/react-router";

import { Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PageHeader } from "../-components/app-pages/page-header";
import { createDefaultInvoiceValues } from "./-components/data";
import { Invoice } from "./-components/invoice";

export const Route = createFileRoute("/(main)/dashboard/invoice")({
  loader: () => ({ defaultValues: createDefaultInvoiceValues(new Date().toISOString()) }),
  component: Page,
});

function Page() {
  const { defaultValues } = Route.useLoaderData();
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <PageHeader
        title="Create New Invoice"
        description="Add invoice details and review the preview."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline">
              <Save data-icon="inline-start" />
              Save as Draft
            </Button>
            <Button type="button">
              <Send data-icon="inline-start" />
              Send Invoice
            </Button>
          </div>
        }
      />

      <Invoice defaultValues={defaultValues} />
    </div>
  );
}
