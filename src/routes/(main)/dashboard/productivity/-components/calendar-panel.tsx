import * as React from "react";

import { enGB } from "date-fns/locale";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { CardContent } from "@/components/ui/card";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";
import { createDemoDay, createDemoMonth } from "./demo-date";

// Keep the shared day styling while wiring DayPicker's keyboard focus at this usage site.
function ProductivityDayButton(props: React.ComponentProps<typeof CalendarDayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (props.modifiers.focused) ref.current?.focus();
  }, [props.modifiers.focused]);
  // The wrapper forwards remaining props to Button; its DayPicker prop type omits React 19's ref.
  const buttonProps = { ...props, locale: enGB, ref };
  return <CalendarDayButton {...buttonProps} />;
}

export function CalendarPanel() {
  const day = useDashboardData().day;
  const today = createDemoDay(day.date);
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => createDemoMonth(day.date));

  return (
    <Card className="w-full" density="compact">
      <SectionHeader title="Calendar" description={`Demo day · ${day.label}`} />
      <CardContent>
        <Calendar
          today={today}
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          locale={enGB}
          components={{ DayButton: ProductivityDayButton }}
          className="w-full p-0 [--cell-size:--spacing(9)]"
        />
      </CardContent>
    </Card>
  );
}
