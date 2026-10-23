import { Quote } from "lucide-react";

import { useDashboardData } from "./data-context";

export function QuoteCard() {
  const quote = useDashboardData().quote;
  return (
    <section className="bg-card rounded-xl border p-4">
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground grid size-8 shrink-0 place-items-center">
          <Quote className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <blockquote className="text-base leading-snug font-medium tracking-tight">{quote.quote}</blockquote>
          <p className="text-muted-foreground text-sm">{quote.encouragement}</p>
        </div>
      </div>
    </section>
  );
}
