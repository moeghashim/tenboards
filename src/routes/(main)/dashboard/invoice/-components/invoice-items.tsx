import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

import { getLineAmount, type InvoiceFormValues, type InvoiceLineItem } from "./data";

export function InvoiceItems() {
  const { control, register } = useFormContext<InvoiceFormValues>();
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "fieldKey",
  });
  const items = useWatch({ control, name: "items" }) ?? [];
  function handleDragEnd(event: DragEndEvent) {
    const { source } = event.operation;

    if (event.canceled || !isSortable(source) || source.initialIndex === source.index) {
      return;
    }

    move(source.initialIndex, source.index);
  }

  function handleAddItem() {
    append({ id: `item-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Invoice Items</h2>
        <Button type="button" variant="ghost" size="sm" onClick={handleAddItem}>
          <Plus data-icon="inline-start" />
          Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground hidden items-center gap-2 px-1 text-xs font-medium 2xl:grid 2xl:grid-cols-[24px_minmax(0,1fr)_64px_96px_96px_32px]">
          <span />
          <span>Description</span>
          <span className="px-2">Units</span>
          <span className="px-2">Unit cost</span>
          <span className="text-right">Line Total</span>
          <span />
        </div>

        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <SortableInvoiceItemRow
                key={field.id}
                id={field.id}
                index={index}
                item={items[index]}
                register={register}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </DragDropProvider>
      </div>
    </section>
  );
}

function SortableInvoiceItemRow({
  id,
  index,
  item,
  register,
  onRemove,
}: {
  id: string;
  index: number;
  item?: InvoiceLineItem;
  register: UseFormRegister<InvoiceFormValues>;
  onRemove: () => void;
}) {
  const { handleRef, isDragging, ref } = useSortable({
    id,
    index,
    type: "invoice-item",
    accept: "invoice-item",
    group: "invoice-items",
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <div
      ref={ref}
      data-invoice-item={id}
      className={cn(
        "grid min-w-0 grid-cols-[24px_minmax(0,0.8fr)_minmax(0,1fr)_32px] items-center gap-2 rounded-lg border p-3 2xl:grid-cols-[24px_minmax(0,1fr)_64px_96px_96px_32px]",
        isDragging && "relative z-10 opacity-50",
      )}
    >
      <Button
        ref={handleRef}
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground -ml-2 cursor-grab touch-none active:cursor-grabbing"
        aria-label={`Reorder item ${index + 1}`}
      >
        <GripVertical />
      </Button>
      <div className="min-w-0 max-2xl:col-span-3">
        <label htmlFor={`${id}-description`} className="text-muted-foreground mb-1 block text-xs 2xl:sr-only">
          Description
        </label>
        <Textarea
          id={`${id}-description`}
          rows={2}
          className="min-h-16 min-w-0 resize-y text-sm"
          aria-label={`Item ${index + 1} description`}
          {...register(`items.${index}.description` as const)}
        />
      </div>
      <div className="max-2xl:col-start-2 max-2xl:row-start-2">
        <label htmlFor={`${id}-quantity`} className="text-muted-foreground mb-1 block text-xs 2xl:sr-only">
          Units
        </label>
        <Input
          id={`${id}-quantity`}
          type="number"
          step="1"
          className="text-sm"
          aria-label={`Item ${index + 1} quantity`}
          {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
        />
      </div>
      <div className="max-2xl:col-start-3 max-2xl:row-start-2">
        <label htmlFor={`${id}-price`} className="text-muted-foreground mb-1 block text-xs 2xl:sr-only">
          Unit price
        </label>
        <Input
          id={`${id}-price`}
          type="number"
          step="0.01"
          className="text-sm"
          aria-label={`Item ${index + 1} unit price`}
          {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
        />
      </div>
      <div className="min-w-0 text-right text-sm font-medium max-2xl:col-span-3 max-2xl:col-start-2 max-2xl:row-start-3 max-2xl:flex max-2xl:items-center max-2xl:justify-between max-2xl:text-left">
        <span className="text-muted-foreground hidden max-2xl:inline">Line total</span>
        <span>{formatInvoiceCurrency(getLineAmount(item))}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="max-2xl:col-start-4 max-2xl:row-start-2 max-2xl:self-end"
        aria-label={`Remove item ${index + 1}`}
        onClick={onRemove}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

function formatInvoiceCurrency(value: number) {
  return formatCurrency(Number.isFinite(value) ? value : 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
