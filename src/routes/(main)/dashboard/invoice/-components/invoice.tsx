import { FormProvider, useForm, useWatch } from "react-hook-form";

import type { InvoiceFormValues } from "./data";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

export function Invoice({ defaultValues }: { defaultValues: InvoiceFormValues }) {
  const form = useForm<InvoiceFormValues>({
    defaultValues,
  });
  const invoice = useWatch({ control: form.control }) as InvoiceFormValues;

  return (
    <FormProvider {...form}>
      <form className="grid min-w-0 gap-4 xl:grid-cols-2" noValidate onSubmit={(event) => event.preventDefault()}>
        <InvoiceForm />
        <InvoicePreview invoice={invoice} />
      </form>
    </FormProvider>
  );
}
