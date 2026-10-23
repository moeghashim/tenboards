import * as React from "react";

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { formatCurrency } from "@/lib/utils";

import {
  getInvoiceTotal,
  INVOICE_PAPER_HEIGHT,
  INVOICE_PAPER_SCALE,
  INVOICE_PAPER_WIDTH,
  type InvoiceFormValues,
} from "./data";
import { useInvoiceReferences } from "./invoice-context";
import { InvoicePaper } from "./invoice-paper";
import { PrintInvoice } from "./print-invoice";
import { useVisibleCenterPosition } from "./use-visible-center-position";

function handlePrint() {
  window.print();
}

export function InvoicePreview({ invoice }: { invoice: InvoiceFormValues }) {
  const { invoiceTaxOptions } = useInvoiceReferences();
  const paperRef = React.useRef<HTMLDivElement>(null);
  const [paperHeight, setPaperHeight] = React.useState(INVOICE_PAPER_HEIGHT);
  React.useEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;
    const observer = new ResizeObserver(() => setPaperHeight(paper.offsetHeight));
    observer.observe(paper);
    return () => observer.disconnect();
  }, []);
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: paperHeight,
    maxScale: INVOICE_PAPER_SCALE,
    width: INVOICE_PAPER_WIDTH,
  });

  return (
    <>
      <PrintInvoice invoice={invoice} />
      <div className="bg-card flex min-w-0 flex-col rounded-xl border">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="font-medium">Preview</h2>
            <p className="text-muted-foreground text-sm" aria-live="polite">
              Balance due{" "}
              <span data-invoice-total className="text-foreground font-medium tabular-nums">
                {formatCurrency(getInvoiceTotal(invoice, invoiceTaxOptions), {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>
          <ButtonGroup>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer data-icon="inline-start" />
              Print
            </Button>
            <Button type="button" variant="outline">
              <Download data-icon="inline-start" />
              Download PDF
            </Button>
          </ButtonGroup>
        </div>

        <div
          ref={previewBodyRef}
          className="bg-muted @container/preview relative min-h-[calc(100svh-15rem)] flex-1 overflow-hidden rounded-b-xl p-4"
        >
          {paperLayout === null ? (
            <div className="text-muted-foreground absolute inset-0 grid place-items-center text-sm">
              Loading Preview
            </div>
          ) : null}
          <div
            style={{
              height: paperLayout ? paperHeight * paperLayout.scale : INVOICE_PAPER_HEIGHT * INVOICE_PAPER_SCALE,
              top: paperLayout?.top ?? "50%",
              transform: paperLayout === null ? "translate(-50%, -50%)" : "translateX(-50%)",
              width: paperLayout ? INVOICE_PAPER_WIDTH * paperLayout.scale : INVOICE_PAPER_WIDTH * INVOICE_PAPER_SCALE,
            }}
            className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
            data-ready={paperLayout !== null}
          >
            <div
              ref={paperRef}
              style={{ transform: `scale(${paperLayout?.scale ?? INVOICE_PAPER_SCALE})` }}
              className="origin-top-left"
            >
              <InvoicePaper invoice={invoice} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
