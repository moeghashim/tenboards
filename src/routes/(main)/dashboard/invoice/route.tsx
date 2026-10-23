import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PageHeader } from "../-components/app-pages/page-header";
import { Invoice } from "./-components/invoice";
import { InvoiceContext } from "./-components/invoice-context";

const loadInvoice = createServerFn({ method: "GET" }).handler(async () => {
  const { readInvoices } = await import("@/server/data/invoices");
  const data = await readInvoices({ renderedAt: new Date().toISOString() });
  if (!data.defaultValues) throw new Error("Invoice draft is unavailable. Check the seed and retry.");
  return { ...data, defaultValues: data.defaultValues };
});
export const Route = createFileRoute("/(main)/dashboard/invoice")({
  loader: () => loadInvoice(),
  component: Page,
});

function Page() {
  const { defaultValues, ...references } = Route.useLoaderData();
  return (
    <InvoiceContext value={references}>
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
    </InvoiceContext>
  );
}
