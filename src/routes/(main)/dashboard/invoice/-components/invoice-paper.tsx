import { formatCurrency } from "@/lib/utils";

import {
  getInvoiceDiscount,
  getInvoiceItems,
  getInvoiceSubtotal,
  getInvoiceTax,
  getInvoiceTaxOption,
  getInvoiceTotal,
  getLineAmount,
  INVOICE_PAPER_HEIGHT,
  INVOICE_PAPER_WIDTH,
  type InvoiceFormValues,
} from "./data";
import { useInvoiceReferences } from "./invoice-context";

export function InvoicePaper({ invoice }: { invoice: InvoiceFormValues }) {
  const { invoiceTaxOptions } = useInvoiceReferences();
  const taxOption = getInvoiceTaxOption(invoice, invoiceTaxOptions);
  const discountValue = Number.isFinite(invoice.discountValue) ? invoice.discountValue : 0;
  const discountLabel = invoice.discountType === "percent" ? `Discount ${discountValue}%` : "Discount";

  return (
    <article
      style={{ width: INVOICE_PAPER_WIDTH, minHeight: INVOICE_PAPER_HEIGHT }}
      data-print-paper
      className="relative flex flex-col gap-8 bg-white px-12 py-10 font-sans [overflow-wrap:anywhere] text-neutral-950"
    >
      <header className="flex flex-col gap-6">
        <div className="grid grid-cols-2 items-start gap-8">
          <svg className="size-12" viewBox="0 0 48 48" aria-hidden="true">
            <rect width="20" height="20" rx="3" fill="currentColor" />
            <rect x="28" width="20" height="20" rx="3" fill="currentColor" />
            <rect y="28" width="20" height="20" rx="3" fill="currentColor" />
            <rect x="28" y="28" width="20" height="20" rx="3" fill="currentColor" />
          </svg>
          <h2 className="text-3xl font-medium tracking-tight">Invoice</h2>
        </div>

        <section className="grid grid-cols-2 gap-8 text-sm leading-relaxed">
          <div>
            <p>Reference: {invoice.referenceNumber}</p>
            <p>Issued: {invoice.issuedDate}</p>
            <p>Payment due: {invoice.paymentDueDate}</p>
          </div>
          <div>
            <p>Payment account</p>
            <p>{invoice.from.paymentAccountName}</p>
            <p>Routing no. {invoice.from.routingNumber}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-8 text-sm leading-relaxed">
          <div>
            <p className="mb-2 font-medium">From</p>
            <p>{invoice.from.name}</p>
            {invoice.from.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>Tax ID: {invoice.from.taxId}</p>
          </div>
          <div>
            <p className="mb-2 font-medium">Bill to</p>
            <p>{invoice.to.name}</p>
            {invoice.to.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>Tax ID: {invoice.to.taxId}</p>
          </div>
        </section>
      </header>

      <div className="flex flex-col gap-5">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] bg-neutral-100 px-3 py-3 font-medium">
            <span>Description</span>
            <span className="text-right">Units</span>
            <span className="text-right">Unit cost</span>
            <span className="text-right">Line total</span>
          </div>
          {getInvoiceItems(invoice).map((item) => (
            <div
              key={item.id}
              className="grid break-inside-avoid grid-cols-[minmax(0,1fr)_74px_116px_116px] border-b border-neutral-300 px-3 py-3"
            >
              <span className="min-w-0 pr-3 break-words whitespace-pre-line">{item.description}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{formatInvoiceCurrency(item.unitPrice)}</span>
              <span className="text-right">{formatInvoiceCurrency(getLineAmount(item))}</span>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-8 text-sm leading-relaxed">
          <section className="col-start-2 break-inside-avoid space-y-2">
            <div>
              <div className="flex justify-between gap-8">
                <span>Net amount</span>
                <span>{formatInvoiceCurrency(getInvoiceSubtotal(invoice))}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>{discountLabel}</span>
                <span>{formatInvoiceCurrency(getInvoiceDiscount(invoice))}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>
                  {taxOption.name} {taxOption.rate}%
                </span>
                <span>{formatInvoiceCurrency(getInvoiceTax(invoice, invoiceTaxOptions))}</span>
              </div>
            </div>
            <div className="border-y-2 border-current py-3">
              <div className="flex justify-between gap-8">
                <span className="font-medium">Balance due</span>
                <span className="font-semibold">
                  {formatInvoiceCurrency(getInvoiceTotal(invoice, invoiceTaxOptions))}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-auto grid grid-cols-2 gap-8 pt-6 text-sm leading-relaxed text-neutral-600">
        <div>
          <p>{invoice.from.email}</p>
          <p>{invoice.from.phone}</p>
          <p>{invoice.from.website}</p>
        </div>
        <div>
          <p>Prepared for prompt processing.</p>
          <p>Issued by {invoice.from.issuerName}</p>
        </div>
      </footer>
    </article>
  );
}

function formatInvoiceCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
