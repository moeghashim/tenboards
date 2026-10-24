import * as React from "react";

import { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { differenceInCalendarDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, XIcon } from "lucide-react";

import { EventCalendarViews } from "@/components/calendar/event-calendar-views";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CalendarData, projectEvents } from "@/server/data/calendar.types";

const views = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];

const plugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, multiMonthPlugin];

export function Calendar({ renderedAt, templates, calendars }: CalendarData) {
  const [local, setLocal] = React.useState(false);
  const hydrated = React.useRef<boolean>(false);
  const now = React.useCallback(() => (hydrated.current ? new Date() : new Date(renderedAt)), [renderedAt]);
  React.useEffect(() => {
    hydrated.current = true;
    setLocal(true);
  }, []);
  const demoEvents = React.useMemo(
    () => projectEvents(templates, renderedAt, local ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"),
    [renderedAt, local, templates],
  );
  const controller = useCalendarController();
  const [eventCount, setEventCount] = React.useState(0);
  const [selectedCalendar, setSelectedCalendar] = React.useState(calendars[0].value);
  const [dateInfo, setDateInfo] = React.useState(() => {
    const initial = new Date(renderedAt);

    return {
      title: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(initial),
      days: new Date(Date.UTC(initial.getUTCFullYear(), initial.getUTCMonth() + 1, 0)).getUTCDate(),
    };
  });
  const title = dateInfo.title;
  const days = dateInfo.days;

  return (
    <div className="bg-card text-card-foreground flex min-w-0 flex-col overflow-hidden rounded-xl border">
      <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 shrink-0 flex-col gap-1">
          <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">
            {days} days · {eventCount} events · {local ? "Local time" : "UTC"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedCalendar}
            onValueChange={(value) => {
              if (value !== null) setSelectedCalendar(value);
            }}
            items={calendars}
          >
            <SelectTrigger aria-label="Calendar" className="w-full sm:w-auto">
              <CalendarIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.value} value={calendar.value}>
                    {calendar.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ButtonGroup>
            <Button size="icon" aria-label="Previous period" variant="outline" onClick={() => controller.prev()}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => controller.today()}>
              Today
            </Button>
            <Button size="icon" aria-label="Next period" variant="outline" onClick={() => controller.next()}>
              <ChevronRight />
            </Button>
          </ButtonGroup>
          <Select
            value={controller.view?.type ?? views[0].value}
            onValueChange={(value) => {
              if (value !== null) controller.changeView(value);
            }}
            items={views}
          >
            <SelectTrigger aria-label="Calendar view">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {views.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <Plus />
            Add event
          </Button>
        </div>
      </div>

      <section className="overflow-x-auto" aria-label="Calendar grid, scroll horizontally on small screens">
        <div className={controller.view?.type === "timeGridDay" ? "min-w-0" : "min-w-175"}>
          <EventCalendarViews
            timeZone={local ? "local" : "UTC"}
            now={now}
            initialDate={renderedAt}
            height={680}
            dayMaxEvents={2}
            eventClass={(info) => `outline-ring ${info.isSelected ? "outline-3" : "focus-visible:outline-3"}`}
            dayCellTopContent={(info) => (
              <span
                className={
                  info.isToday ? "bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5 font-medium" : undefined
                }
              >
                {info.text}
                {info.isToday && <span className="sr-only"> Today</span>}
              </span>
            )}
            dayHeaderContent={(info) => (
              <span
                className={info.isToday ? "bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5" : undefined}
              >
                {info.text}
                {info.isToday && <span className="sr-only"> Today</span>}
              </span>
            )}
            tableBodyClass="bg-card"
            backgroundEventClass="bg-muted border border-primary"
            backgroundEventTitleClass="p-1 text-xs text-muted-foreground"
            blockEventTitleClass="whitespace-normal break-words"
            moreLinkClass="text-primary outline-ring focus-visible:outline-3"
            popoverCloseClass="absolute end-1 top-1 rounded-sm p-1 hover:bg-accent focus-visible:outline-3 outline-ring"
            popoverClass="m-1 max-w-80 overflow-hidden rounded-lg border bg-popover text-popover-foreground"
            views={{
              dayGrid: {
                rowEventInnerClass: "flex items-center py-1 text-xs",
                listItemEventInnerClass: "flex items-start gap-1 py-1 text-xs",
                listItemEventTitleClass: "min-w-0 whitespace-normal break-words font-medium",
                rowMoreLinkClass: "mx-1 mb-1 rounded-sm border border-primary px-1 text-primary",
                rowMoreLinkInnerClass: "p-0.5 text-xs",
              },
              timeGrid: { columnEventInnerClass: "flex flex-col p-1 text-xs" },
            }}
            controller={controller}
            initialView={views[0].value}
            plugins={[...plugins]}
            popoverCloseContent={() => <XIcon className="text-muted-foreground group-hover:text-foreground size-5" />}
            events={demoEvents}
            nowIndicator
            datesSet={(info) => {
              setDateInfo({
                title: info.view.title,
                days: differenceInCalendarDays(info.view.currentEnd, info.view.currentStart),
              });
              setEventCount(
                demoEvents.filter((event) => {
                  const start = new Date(event.start);

                  return start >= info.start && start < info.end;
                }).length,
              );
            }}
          />
        </div>
      </section>
    </div>
  );
}
