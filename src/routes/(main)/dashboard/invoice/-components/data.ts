export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTaxOption {
  id: string;
  name: string;
  rate: number;
}

export type InvoiceDiscountType = "fixed" | "percent";

export const INVOICE_PAPER_WIDTH = 816;
export const INVOICE_PAPER_HEIGHT = 1056;
export const INVOICE_PAPER_SCALE = 0.6;

export interface InvoiceFromDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  addressLines: string[];
  taxId: string;
  paymentAccountName: string;
  routingNumber: string;
  issuerName: string;
}

export interface InvoiceToDetails {
  id: string;
  name: string;
  email: string;
  addressLines: string[];
  taxId: string;
}

export interface InvoiceFormValues {
  referenceNumber: string;
  issuedDate: string;
  paymentDueDate: string;
  from: InvoiceFromDetails;
  to: InvoiceToDetails;
  taxId: string;
  discountType: InvoiceDiscountType;
  discountValue: number;
  items: InvoiceLineItem[];
}

const defaultClient: InvoiceToDetails = {
  id: "aiy-cap",
  name: "Cedar Works",
  email: "billing@cedar.example.com",
  addressLines: ["One BKC, Bandra Kurla Complex", "Mumbai, Maharashtra 400051"],
  taxId: "GSTIN-27AAICA9102K1Z7",
};

// Draft defaults use the request's UTC civil date. Edited dates stay literal YYYY-MM-DD values.
export function createDefaultInvoiceValues(renderedAt: string): InvoiceFormValues {
  const issued = new Date(renderedAt);
  const due = new Date(renderedAt);
  due.setUTCDate(due.getUTCDate() + 14);
  return {
    referenceNumber: "FL-0425",
    issuedDate: issued.toISOString().slice(0, 10),
    paymentDueDate: due.toISOString().slice(0, 10),
    from: {
      name: "Northwind Studio",
      email: "hello@northwind.example.com",
      phone: "+1-512-555-0184",
      website: "northwind.example.com",
      addressLines: ["214 Pixel Avenue", "Austin, TX 78701"],
      taxId: "NW-1029384756",
      paymentAccountName: "Mercury Business",
      routingNumber: "084009519",
      issuerName: "Jordan Lee",
    },
    to: defaultClient,
    taxId: "vat",
    discountType: "fixed",
    discountValue: 40,
    items: [
      {
        id: "hosting",
        description: "Cloud hosting services",
        quantity: 1,
        unitPrice: 3500,
      },
      {
        id: "analytics",
        description: "Data analytics report",
        quantity: 2,
        unitPrice: 750,
      },
      {
        id: "support",
        description: "Technical support retainer",
        quantity: 1,
        unitPrice: 400,
      },
    ],
  };
}

export const invoiceTaxOptions: InvoiceTaxOption[] = [
  {
    id: "gst",
    name: "GST",
    rate: 18,
  },
  {
    id: "vat",
    name: "VAT",
    rate: 12,
  },
  {
    id: "service-tax",
    name: "Service Tax",
    rate: 10,
  },
  {
    id: "none",
    name: "No Tax",
    rate: 0,
  },
];

export const invoiceClients: InvoiceToDetails[] = [
  {
    id: "bright-enterprises",
    name: "Bright Enterprises",
    email: "billing@bright.example.com",
    addressLines: ["450 Park Avenue South", "New York, NY 10016", "United States"],
    taxId: "US-EIN-84-2938475",
  },
  defaultClient,
  {
    id: "northline-gmbh",
    name: "Northline GmbH",
    email: "ap@northline.example.com",
    addressLines: ["Kastanienallee 32", "10435 Berlin", "Germany"],
    taxId: "DE-VAT-219384756",
  },
];

export function getLineAmount(item?: InvoiceLineItem) {
  if (!item) return 0;

  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;

  return quantity * unitPrice;
}

export function getInvoiceItems(invoice: InvoiceFormValues) {
  return invoice.items;
}

export function getInvoiceSubtotal(invoice: InvoiceFormValues) {
  return getInvoiceItems(invoice).reduce((subtotal, item) => subtotal + getLineAmount(item), 0);
}

export function getInvoiceTaxOption(invoice: InvoiceFormValues) {
  return invoiceTaxOptions.find((taxOption) => taxOption.id === invoice.taxId) ?? invoiceTaxOptions[0];
}

export function getInvoiceTax(invoice: InvoiceFormValues) {
  const taxRate = getInvoiceTaxOption(invoice).rate;

  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) * (taxRate / 100);
}

export function getInvoiceDiscount(invoice: InvoiceFormValues) {
  const subtotal = getInvoiceSubtotal(invoice);
  const discountValue = Number.isFinite(invoice.discountValue) ? invoice.discountValue : 0;
  const discount = invoice.discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;

  return Math.min(Math.max(discount, 0), subtotal);
}

export function getInvoiceTotal(invoice: InvoiceFormValues) {
  return Math.max(getInvoiceSubtotal(invoice) - getInvoiceDiscount(invoice), 0) + getInvoiceTax(invoice);
}
