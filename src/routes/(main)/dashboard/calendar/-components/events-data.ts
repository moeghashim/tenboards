// Civil date strings preserve demo wall times when the calendar adopts the browser timezone.
// The request snapshot supplies the month; no module-startup clock is involved.
export function createDemoEvents(reference: Date, local: boolean) {
  const year = local ? reference.getFullYear() : reference.getUTCFullYear();
  const month = (local ? reference.getMonth() : reference.getUTCMonth()) + 1;
  const d = (day: number) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const dt = (day: number, hour: number, minute = 0) =>
    `${d(day)}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  return [
    { title: "Monthly planning", start: dt(1, 9, 30), end: dt(1, 10, 30) },
    { title: "Design review", start: dt(3, 11), end: dt(3, 12) },
    { title: "Client check-in", start: dt(4, 15), end: dt(4, 15, 45) },
    { title: "Product workshop", start: d(7), end: d(9), allDay: true },
    { groupId: "standup", title: "Team standup", start: dt(9, 10) },
    { title: "Finance sync", start: dt(10, 14, 30), end: dt(10, 15) },
    { title: "Focus block", start: dt(12, 9), end: dt(12, 12), display: "background" },
    {
      title: "Release readiness — accessibility, documentation and support review",
      start: dt(15, 13),
      end: dt(15, 14),
    },
    { title: "Team retrospective", start: dt(15, 15), end: dt(15, 16) },
    { title: "Sprint planning", start: dt(15, 9, 30), end: dt(15, 11) },
    { groupId: "standup", title: "Team standup", start: dt(16, 10) },
    { title: "Ops handoff", start: dt(18, 16), end: dt(18, 16, 45) },
    { title: "Quarterly report due", start: d(24), allDay: true },
    { title: "Reset day", start: d(28), allDay: true },
    { title: "Jordan Lee Birthday", start: `${year}-09-06`, allDay: true },
  ];
}
