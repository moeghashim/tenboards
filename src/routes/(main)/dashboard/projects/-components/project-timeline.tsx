// biome-ignore-all lint/a11y/noNoninteractiveTabindex: Named chart and table scroll regions support keyboard scrolling.
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projectEvents } from "@/server/data/calendar.types";
import { addCivilDays, inclusiveDuration, taskStatuses } from "@/server/data/projects.types";

import { Calendar } from "../../calendar/-components/calendar";
import { displayDate, statusLabels } from "./project-search";
import type { loadProjectTimeline } from "./project-view-functions";
import { eventDuration, localCivilDay, scheduleRange, scheduleSpan, shiftMonths, spanPosition } from "./schedule";
import type { TimelineSearch } from "./timeline-search";

type Data = NonNullable<Awaited<ReturnType<typeof loadProjectTimeline>>>;
const selectClass = "border-border-strong bg-background h-8 rounded-lg border px-2 text-sm";
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
  const [mobile, setMobile] = useState(false),
    [today, setToday] = useState(data.renderedAt.slice(0, 10)),
    [query, setQuery] = useState(search.query);
  useEffect(() => {
    setLocal(true);
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    const clock = () => setToday(localCivilDay(new Date()));
    clock();
    const timer = setInterval(clock, 60000);
    return () => {
      mq.removeEventListener("change", update);
      clearInterval(timer);
    };
  }, []);
  const mode = search.mode ?? (mobile ? "table" : "gantt"),
    range = scheduleRange(search.start, search.scale, search.periods),
    rows = data.items
      .map((task) => ({ task, span: scheduleSpan(task) }))
      .sort((a, b) => Number(!a.span) - Number(!b.span));
  const templates = data.templates.filter(
    (t) => !search.query || t.title.toLowerCase().includes(search.query.toLowerCase()),
  );
  const events = projectEvents(
    templates,
    data.renderedAt,
    local ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  );
  const update = (patch: Partial<TimelineSearch>) => onSearch({ ...search, offset: 0, ...patch });
  const shift = (n: number) =>
    update({
      start:
        search.scale === "months"
          ? shiftMonths(range.start, search.periods * n)
          : addCivilDays(range.start, range.days * n),
    });
  const ticks = Array.from({ length: search.periods }, (_, i) =>
    search.scale === "months" ? shiftMonths(range.start, i) : addCivilDays(range.start, i * 7),
  );
  return (
    <section className="min-w-0 space-y-4" aria-label="Project timeline">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">Timeline</h2>
        <label className="flex items-center gap-2">
          Mode
          <select
            aria-label="Timeline mode"
            className={selectClass}
            value={mode}
            onChange={(e) => update({ mode: e.target.value as TimelineSearch["mode"] })}
          >
            <option value="gantt">Gantt</option>
            <option value="table">Table</option>
            <option value="calendar">Calendar</option>
          </select>
        </label>
      </div>
      <p className="text-muted-foreground text-xs">
        Read-only schedule · Today: {displayDate(today)} · Deadline reference: June 20, 2026. Calendar templates follow
        the request month; task dates remain authored sample dates.
      </p>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          update({ query });
        }}
      >
        <label htmlFor="schedule-query" className="flex min-w-48 flex-1 flex-col gap-1 text-xs">
          Search schedule
          <Input
            id="schedule-query"
            aria-label="Search schedule"
            value={query}
            maxLength={200}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Task status
          <select
            aria-label="Schedule status"
            className={selectClass}
            value={search.status ?? ""}
            onChange={(e) => update({ status: taskStatuses.find((s) => s === e.target.value) })}
          >
            <option value="">All statuses</option>
            {taskStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <Button variant="outline">Apply search</Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setQuery("");
            update({ query: "", status: undefined, assigneeId: undefined, priority: undefined, label: undefined });
          }}
        >
          Reset filters
        </Button>
      </form>
      {mode !== "calendar" && (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs">
            Scale
            <select
              aria-label="Schedule scale"
              className={selectClass}
              value={search.scale}
              onChange={(e) => update({ scale: e.target.value as TimelineSearch["scale"] })}
            >
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            Periods (1–12)
            <select
              aria-label="Visible periods"
              className={selectClass}
              value={search.periods}
              onChange={(e) => update({ periods: Number(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="schedule-start" className="flex flex-col gap-1 text-xs">
            Range start
            <Input
              id="schedule-start"
              type="date"
              aria-label="Schedule range start"
              value={search.start}
              onChange={(e) => {
                if (e.target.value) update({ start: e.target.value });
              }}
            />
          </label>
          <Button variant="outline" aria-label="Previous schedule range" onClick={() => shift(-1)}>
            Previous range
          </Button>
          <Button variant="outline" onClick={() => update({ start: today })}>
            Today
          </Button>
          <Button variant="outline" aria-label="Next schedule range" onClick={() => shift(1)}>
            Next range
          </Button>
        </div>
      )}
      {mode !== "calendar" && (
        <p className="text-muted-foreground text-sm" role="status">
          {displayDate(range.start)} – {displayDate(range.end)} · {data.total} matching tasks. Bars clip to this range;
          exact dates stay visible.
        </p>
      )}
      {mode === "calendar" && (
        <section className="space-y-3" aria-label="Project calendar">
          <p className="text-muted-foreground text-sm">
            {templates.length} project event templates · {data.taskEvents.length} dated tasks in this batch. Events are
            separate records and do not affect task completion. All-day task ends are inclusive in the table and
            exclusive in Calendar.
          </p>
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
      {mode === "table" && (
        <section
          tabIndex={0}
          aria-label="Schedule table, scroll horizontally"
          className="relative max-h-[65dvh] max-w-full overflow-auto rounded-xl border"
        >
          <Table className="min-w-220">
            <TableCaption className="text-muted-foreground p-3 text-left">
              Task schedule · exact civil dates; absent end means one day. Unscheduled work remains listed.
            </TableCaption>
            <TableHeader>
              <TableRow>
                {["Task", "Status", "Assignee", "Start", "End", "Due", "Duration"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ task: t, span }) => (
                <TableRow key={t.id} data-schedule-id={t.id}>
                  <TableCell className="max-w-96 min-w-56 break-words whitespace-normal">{t.title}</TableCell>
                  <TableCell>{statusLabels[t.status]}</TableCell>
                  <TableCell>{t.assignee?.name ?? "Unassigned"}</TableCell>
                  <TableCell>{displayDate(span?.start ?? null)}</TableCell>
                  <TableCell>{displayDate(span?.end ?? null)}</TableCell>
                  <TableCell>{displayDate(t.dueDate)}</TableCell>
                  <TableCell>
                    {span ? `${span.duration} ${span.duration === 1 ? "day" : "days"}` : "Unscheduled"}
                  </TableCell>
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
          className="relative max-h-[65dvh] max-w-full overflow-auto rounded-xl border"
        >
          <div className="min-w-240" style={{ minWidth: Math.max(960, 320 + search.periods * 120) }}>
            <div className="bg-muted grid grid-cols-[20rem_1fr] gap-3 border-b p-3 text-xs">
              <span>Task · exact dates</span>
              <div className="relative min-h-4">
                {ticks.map((t) => (
                  <span
                    key={t}
                    className="absolute whitespace-nowrap"
                    style={{ left: `${((inclusiveDuration(range.start, t) - 1) / range.days) * 100}%` }}
                  >
                    {displayDate(t)}
                  </span>
                ))}
              </div>
            </div>
            {rows
              .filter((row) => row.span)
              .map(({ task: t, span }) => {
                const pos = span ? spanPosition(span, range) : null;
                return (
                  <div
                    data-schedule-id={t.id}
                    key={t.id}
                    className="grid grid-cols-[20rem_1fr] items-center gap-3 border-b p-3 last:border-0"
                  >
                    <div className="space-y-1 pr-3">
                      <p className="font-medium break-words">{t.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {statusLabels[t.status]} · {t.assignee?.name ?? "Unassigned"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {span
                          ? `${displayDate(span.start)} – ${displayDate(span.end)} · ${span.duration}d`
                          : "Unscheduled"}{" "}
                        · Due {displayDate(t.dueDate)}
                      </p>
                    </div>
                    <div className="relative min-h-8">
                      {pos?.visible ? (
                        <div
                          className="bg-primary text-primary-foreground flex min-h-8 items-center overflow-hidden rounded px-2 text-xs"
                          style={{
                            marginLeft: `${(pos.offset / range.days) * 100}%`,
                            width: `${(pos.days / range.days) * 100}%`,
                          }}
                          role="img"
                          aria-label={`${t.title}, ${span?.duration} days${pos.continuesBefore ? ", continues before range" : ""}${pos.continuesAfter ? ", continues after range" : ""}`}
                        >
                          <span className="truncate">{statusLabels[t.status]}</span>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs">{span ? "Outside this range" : "Unscheduled"}</p>
                      )}
                      {pos?.visible && (pos.continuesBefore || pos.continuesAfter) && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {pos.continuesBefore ? "Continues before range. " : ""}
                          {pos.continuesAfter ? "Continues after range." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}
      {!rows.length && (
        <p className="text-muted-foreground">No matching tasks. Reset filters or choose another project.</p>
      )}
      <section className="space-y-2">
        <h3 className="font-medium">Unscheduled tasks in this batch</h3>
        <p className="text-muted-foreground text-sm">
          {rows.filter((r) => !r.span).length} tasks have no authored start date. Calendar displays dated tasks only.
        </p>
        {mode !== "table" && (
          <section
            aria-label="Unscheduled tasks, scroll vertically"
            tabIndex={0}
            className="focus-visible:outline-ring max-h-64 overflow-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ul className="space-y-2">
              {rows
                .filter((r) => !r.span)
                .map(({ task: t }) => (
                  <li key={t.id} data-schedule-id={t.id} className="flex flex-wrap justify-between gap-2 border-b py-2">
                    <div className="min-w-0 flex-1">
                      <p className="break-words">{t.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {statusLabels[t.status]} · {t.assignee?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs">Due {displayDate(t.dueDate)}</span>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </section>
      {mode !== "calendar" && (
        <section className="space-y-2">
          <h3 className="font-medium">Project calendar events</h3>
          <p className="text-muted-foreground text-sm">
            {events.length} matching request-month events, separate from task completion. Times use{" "}
            {local ? "your local zone" : "UTC"}; all-day ends are exclusive. Event dates follow the request month
            independently of the task range.
          </p>
          {events.length ? (
            <section
              aria-label="Calendar event table, scroll horizontally"
              tabIndex={0}
              className="relative max-h-80 overflow-auto rounded-xl border"
            >
              <Table className="min-w-180">
                <TableCaption>Project event schedule</TableCaption>
                <TableHeader>
                  <TableRow>
                    {["Event", "Status", "Assignee", "Start", "End", "Due", "Duration"].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((e) => (
                    <TableRow key={e.id} data-event-id={e.id}>
                      <TableCell className="max-w-80 min-w-56 break-words whitespace-normal">{e.title}</TableCell>
                      <TableCell>Calendar event</TableCell>
                      <TableCell>Not assigned</TableCell>
                      <TableCell>{e.start}</TableCell>
                      <TableCell>{e.end ?? "Not specified"}</TableCell>
                      <TableCell>Not applicable</TableCell>
                      <TableCell>{eventDuration(e)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          ) : (
            <p className="text-muted-foreground">No matching calendar events.</p>
          )}
        </section>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-muted-foreground text-sm">
          Showing {data.total ? data.offset + 1 : 0}–{data.offset + data.items.length} of {data.total} tasks
          {data.hasMore ? " · More in next batch" : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!data.offset}
            onClick={() => update({ offset: Math.max(0, data.offset - data.limit) })}
          >
            Previous batch
          </Button>
          <Button
            variant="outline"
            disabled={!data.hasMore}
            onClick={() => update({ offset: data.offset + data.limit })}
          >
            Next batch
          </Button>
        </div>
      </div>
    </section>
  );
}
