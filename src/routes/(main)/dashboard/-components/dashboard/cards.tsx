import { type ComponentProps, type ReactNode, useId } from "react";

import { cn } from "cn";

import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardCard({
  density = "standard",
  className,
  ...props
}: ComponentProps<typeof Card> & { density?: "compact" | "standard" }) {
  return <Card {...props} size={density === "compact" ? "sm" : "default"} className={cn("min-w-0", className)} />;
}

export function SectionHeader({
  title,
  description,
  actions,
  level = 2,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  level?: 2 | 3;
  id?: string;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <CardHeader className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1 basis-40">
        <Heading id={id} className="text-base font-medium tracking-tight wrap-break-word">
          {title}
        </Heading>
        {description && <div className="text-muted-foreground mt-1 text-sm">{description}</div>}
      </div>
      {actions && <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>}
    </CardHeader>
  );
}

export function StatCard({
  label,
  value,
  help,
  trend,
  actions,
  icon,
  density = "standard",
  level = 2,
  className,
}: {
  level?: 2 | 3;
  label: string;
  value: ReactNode;
  help?: ReactNode;
  trend?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  density?: "compact" | "standard";
  className?: string;
}) {
  const id = useId();
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <DashboardCard density={density} className={className} role="group" aria-labelledby={id}>
      <CardHeader>
        {icon}
        <Heading id={id} className="text-muted-foreground text-sm font-medium wrap-break-word">
          {label}
        </Heading>
        {actions && <CardAction>{actions}</CardAction>}
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 text-2xl leading-tight font-medium tracking-tight wrap-break-word tabular-nums xl:text-3xl">
            {value}
          </div>
          {trend}
        </div>
        {help && <div className="text-muted-foreground text-sm">{help}</div>}
      </CardContent>
    </DashboardCard>
  );
}
