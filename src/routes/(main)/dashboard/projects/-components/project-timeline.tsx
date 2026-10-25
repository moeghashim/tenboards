// biome-ignore-all lint/a11y/noNoninteractiveTabindex: Named chart and table regions support keyboard scrolling.
import { useEffect, useState } from "react";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { projectEvents } from "@/server/data/calendar.types";
import { addCivilDays, inclusiveDuration, taskStatuses } from "@/server/data/projects.types";

import { Calendar } from "../../calendar/-components/calendar";
import { ProjectSelect, useSearchDraft } from "./project-controls";
import { displayDate, statusLabels } from "./project-search";
import type { loadProjectTimeline } from "./project-view-functions";
import { eventDuration, scheduleRange, scheduleSpan, shiftMonths, spanPosition } from "./schedule";
import { TaskAssignee, TaskStatusLabel, taskKey } from "./task-presentation";
import type { TimelineSearch } from "./timeline-search";

type Data = NonNullable<Awaited<ReturnType<typeof loadProjectTimeline>>>;
const shortDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
const barTones = {
  backlog: "bg-muted text-muted-foreground border-border-strong",
  todo: "bg-info-surface text-info border-info",
  "in-progress": "bg-warning-surface text-warning border-warning",
  review: "bg-primary text-primary-foreground border-primary",
  done: "bg-success-surface text-success border-success",
  canceled: "bg-muted text-muted-foreground border-border-strong",
};
export function ProjectTimeline({
  data,
  search,
  onSearch,
}: {
  data: Data;
  search: TimelineSearch;
  onSearch: (s: TimelineSearch) => void;
}) {
  const [local, setLocal] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [today, setToday] = useState(data.renderedAt.slice(0, 10));
  const update = (patch: Partial<TimelineSearch>) => onSearch({ ...search, offset: 0, ...patch });
  const [query, setQuery] = useSearchDraft(search.query, (query) => update({ query }));
  useEffect(() => {
    setLocal(true);
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    const timer = setInterval(() => setToday(new Date().toISOString().slice(0, 10)), 60000);
    return () => {
      mq.removeEventListener("change", update);
      clearInterval(timer);
    };
  }, []);
  const mode = search.mode ?? (mobile ? "table" : "gantt");
  const rows = data.items.map((task) => ({ task, span: scheduleSpan(task) }));
  const activeStart = [today, data.project.startDate, ...rows.map((r) => r.span?.start)]
    .filter((s): s is string => !!s)
    .sort()[0];
  const activeEnd =
    [today, data.project.dueDate, ...rows.map((r) => r.span?.end)]
      .filter((s): s is string => !!s)
      .sort()
      .at(-1) ?? today;
  // Bound very old projects while keeping today in the initial viewport.
  const earliest = addCivilDays(today, -70);
  // biome-ignore lint/complexity/useMathMinMax: ISO civil dates compare lexically.
  const defaultStart = activeStart < earliest ? earliest : activeStart;
  const periods =
    search.periods ??
    Math.min(
      12,
      Math.max(1, Math.ceil(inclusiveDuration(defaultStart, activeEnd) / (search.scale === "weeks" ? 7 : 28))),
    );
  const range = scheduleRange(search.start ?? defaultStart, search.scale, periods);
  const visible = rows.filter((r) => r.span && spanPosition(r.span, range).visible);
  const unscheduled = rows.filter((r) => !r.span);
  const todayPosition =
    today >= range.start && today <= range.end
      ? ((inclusiveDuration(range.start, today) - 0.5) / range.days) * 100
      : null;
  const ticks = Array.from({ length: periods }, (_, i) =>
    search.scale === "months" ? shiftMonths(range.start, i) : addCivilDays(range.start, i * 7),
  );
  const templates = data.templates.filter(
    (t) => !search.query || t.title.toLowerCase().includes(search.query.toLowerCase()),
  );
  const events = projectEvents(
    templates,
    data.renderedAt,
    local ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  );
  const shift = (n: number) =>
    update({
      start:
        search.scale === "months" ? shiftMonths(range.start, periods * n) : addCivilDays(range.start, range.days * n),
    });
  return (
    <section className="min-w-0 space-y-4" aria-label="Project timeline">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-lg font-medium">Timeline</h2>
        <ToggleGroup
          aria-label="Timeline mode"
          value={[mode]}
          onValueChange={(values) => {
            if (values[0]) update({ mode: values[0] as TimelineSearch["mode"] });
          }}
          variant="outline"
          spacing={0}
        >
          <ToggleGroupItem value="gantt">Gantt</ToggleGroupItem>
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
          <ToggleGroupItem value="calendar">Calendar</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label htmlFor="schedule-query" className="flex min-w-48 flex-1 flex-col gap-1 text-xs">
          Search schedule
          <Input
            id="schedule-query"
            value={query}
            maxLength={200}
            placeholder="Find a task or event"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <ProjectSelect
          label="Schedule status"
          value={search.status ?? "all"}
          options={[
            { value: "all", label: "All statuses" },
            ...taskStatuses.map((value) => ({ value, label: statusLabels[value] })),
          ]}
          onChange={(value) => update({ status: taskStatuses.find((s) => s === value) })}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            update({ query: "", status: undefined, assigneeId: undefined, priority: undefined, label: undefined });
          }}
        >
          Reset filters
        </Button>
      </div>
      {mode !== "calendar" && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <span className="text-xs">Scale</span>
              <ToggleGroup
                aria-label="Schedule scale"
                value={[search.scale]}
                onValueChange={(values) => {
                  if (values[0]) update({ scale: values[0] as TimelineSearch["scale"] });
                }}
                variant="outline"
                spacing={0}
              >
                <ToggleGroupItem value="weeks">Weeks</ToggleGroupItem>
                <ToggleGroupItem value="months">Months</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <ProjectSelect
              label="Visible periods"
              value={String(periods)}
              options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
              onChange={(value) => update({ periods: Number(value) })}
            />
            <label htmlFor="schedule-start" className="flex flex-col gap-1 text-xs">
              Range start
              <Input
                id="schedule-start"
                type="date"
                aria-label="Schedule range start"
                value={range.start}
                onChange={(e) => {
                  if (e.target.value) update({ start: e.target.value });
                }}
              />
            </label>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" aria-label="Previous schedule range" onClick={() => shift(-1)}>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                onClick={() => update({ start: addCivilDays(today, -Math.min(7, Math.floor(range.days / 2))) })}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" aria-label="Next schedule range" onClick={() => shift(1)}>
                <ChevronRight />
              </Button>
            </div>
            <p className="text-muted-foreground pb-2 text-xs" role="status">
              {displayDate(range.start)} – {displayDate(range.end)} · {visible.length} scheduled
            </p>
          </div>
          {mode === "table" && (
            <section
              tabIndex={0}
              aria-label="Schedule table, scroll horizontally"
              className="bg-card relative max-h-[65dvh] max-w-full overflow-auto rounded-xl border"
            >
              <Table className="min-w-220">
                <TableCaption className="sr-only">Task schedule</TableCaption>
                <TableHeader>
                  <TableRow>
                    {["Task", "Status", "Assignee", "Start", "End", "Due", "Duration"].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map(({ task: t, span }) => (
                    <TableRow key={t.id} data-schedule-id={t.id}>
                      <TableCell className="max-w-96 min-w-56 whitespace-normal">
                        <p className="font-medium break-words">{t.title}</p>
                        <span className="text-muted-foreground text-xs">{taskKey(t)}</span>
                      </TableCell>
                      <TableCell>
                        <TaskStatusLabel status={t.status} />
                      </TableCell>
                      <TableCell>
                        <TaskAssignee person={t.assignee} />
                      </TableCell>
                      <TableCell>{displayDate(span?.start ?? null)}</TableCell>
                      <TableCell>{displayDate(span?.end ?? null)}</TableCell>
                      <TableCell>{displayDate(t.dueDate)}</TableCell>
                      <TableCell>{span?.duration} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )}
          {mode === "gantt" && (
            <section
              aria-label="Gantt chart, scroll horizontally"
              tabIndex={0}
              className="bg-card relative max-h-[65dvh] max-w-full overflow-auto rounded-xl border"
            >
              <div className="min-w-240" style={{ minWidth: Math.max(960, 320 + periods * 120) }}>
                <div className="bg-muted sticky top-0 z-10 grid grid-cols-[20rem_1fr] gap-3 border-b p-3 text-xs">
                  <span className="font-medium">Task</span>
                  <div className="relative min-h-8">
                    {ticks.map((t) => (
                      <span
                        key={t}
                        className="absolute whitespace-nowrap"
                        style={{ left: `${((inclusiveDuration(range.start, t) - 1) / range.days) * 100}%` }}
                      >
                        {displayDate(t)}
                      </span>
                    ))}
                    {todayPosition !== null && (
                      <span
                        className="text-primary absolute top-5 -translate-x-1/2 font-medium"
                        style={{ left: `${todayPosition}%` }}
                      >
                        Today
                      </span>
                    )}
                  </div>
                </div>
                {visible.map(({ task: t, span }) => {
                  if (!span) return null;
                  const pos = spanPosition(span, range);
                  return (
                    <div
                      data-schedule-id={t.id}
                      key={t.id}
                      className="grid grid-cols-[20rem_1fr] items-stretch gap-3 border-b px-3 last:border-0"
                    >
                      <div className="space-y-1 py-2.5 pr-3">
                        <p className="truncate font-medium" title={t.title}>
                          {t.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {taskKey(t)} · {shortDate(span.start)} – {shortDate(span.end)}
                        </p>
                      </div>
                      <div className="relative flex items-center">
                        {ticks.map((tick) => (
                          <span
                            key={tick}
                            aria-hidden="true"
                            className="border-border pointer-events-none absolute inset-y-0 border-l"
                            style={{ left: `${((inclusiveDuration(range.start, tick) - 1) / range.days) * 100}%` }}
                          />
                        ))}
                        {todayPosition !== null && (
                          <span
                            data-today-marker
                            aria-hidden="true"
                            className="border-primary pointer-events-none absolute inset-y-0 z-1 border-l-2"
                            style={{ left: `${todayPosition}%` }}
                          />
                        )}
                        <div
                          className={`relative z-2 flex min-h-7 items-center overflow-hidden rounded border px-2 text-xs ${barTones[t.status]}`}
                          style={{
                            marginLeft: `${(pos.offset / range.days) * 100}%`,
                            width: `${(pos.days / range.days) * 100}%`,
                          }}
                          role="img"
                          aria-label={`${t.title}, ${statusLabels[t.status]}, ${span.duration} days, due ${displayDate(t.dueDate)}${pos.continuesBefore ? ", continues before range" : ""}${pos.continuesAfter ? ", continues after range" : ""}`}
                        >
                          <span className="truncate">{statusLabels[t.status]}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {!visible.length && (
            <p className="text-muted-foreground py-3">
              No scheduled tasks in this range. Choose Today or adjust the dates.
            </p>
          )}
        </>
      )}
      {mode === "calendar" && (
        <section className="space-y-3" aria-label="Project calendar">
          <Calendar
            key={data.renderedAt}
            renderedAt={data.renderedAt}
            templates={templates}
            calendars={data.calendars}
            taskEvents={data.taskEvents}
            readOnly
          />
        </section>
      )}
      {!rows.length && (
        <p className="text-muted-foreground">No matching tasks. Reset filters or choose another project.</p>
      )}
      {unscheduled.length > 0 && (
        <Collapsible className="rounded-xl border">
          <CollapsibleTrigger className="hover:bg-muted flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left font-medium">
            Unscheduled ({unscheduled.length})<ChevronDown className="size-4" aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <section
              aria-label="Unscheduled tasks, scroll vertically"
              tabIndex={0}
              className="max-h-64 overflow-auto px-3"
            >
              <ul className="divide-y">
                {unscheduled.map(({ task: t }) => (
                  <li
                    key={t.id}
                    data-schedule-id={t.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-words">{t.title}</p>
                      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                        <span>{taskKey(t)}</span>
                        <TaskStatusLabel status={t.status} />
                      </div>
                    </div>
                    <TaskAssignee person={t.assignee} />
                  </li>
                ))}
              </ul>
            </section>
          </CollapsibleContent>
        </Collapsible>
      )}
      {mode !== "calendar" && (
        <Collapsible className="rounded-xl border">
          <CollapsibleTrigger className="hover:bg-muted flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left font-medium">
            Calendar events ({events.length})<ChevronDown className="size-4" aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {events.length ? (
              <section
                aria-label="Calendar event table, scroll horizontally"
                tabIndex={0}
                className="max-h-80 overflow-auto"
              >
                <Table className="min-w-180">
                  <TableCaption className="sr-only">Project event schedule</TableCaption>
                  <TableHeader>
                    <TableRow>
                      {["Event", "Start", "End", "Duration"].map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((e) => (
                      <TableRow key={e.id} data-event-id={e.id}>
                        <TableCell className="max-w-80 min-w-56 whitespace-normal">{e.title}</TableCell>
                        <TableCell>{e.start}</TableCell>
                        <TableCell>{e.end ?? "Not specified"}</TableCell>
                        <TableCell>{eventDuration(e)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            ) : (
              <p className="text-muted-foreground p-3">No matching calendar events.</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-muted-foreground text-sm">
          Showing {data.total ? data.offset + 1 : 0}–{data.offset + data.items.length} of {data.total} tasks
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!data.offset}
            onClick={() => update({ offset: Math.max(0, data.offset - data.limit) })}
          >
            Previous page
          </Button>
          <Button
            variant="outline"
            disabled={!data.hasMore}
            onClick={() => update({ offset: data.offset + data.limit })}
          >
            Next page
          </Button>
        </div>
      </div>
    </section>
  );
}
