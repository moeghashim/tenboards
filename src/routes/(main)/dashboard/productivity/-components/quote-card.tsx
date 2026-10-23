import { Quote } from "lucide-react";

export function QuoteCard() {
  return (
    <section className="bg-card rounded-xl border p-4">
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground grid size-8 shrink-0 place-items-center">
          <Quote className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <blockquote className="text-base leading-snug font-medium tracking-tight">
            Small, consistent actions lead to big results.
          </blockquote>
          <p className="text-muted-foreground text-sm">Keep showing up. You&apos;ve got this.</p>
        </div>
      </div>
    </section>
  );
}
