import { StatCard } from "../../-components/dashboard/cards";

const summaryCards = [
  { label: "Today", value: "4", help: "tasks scheduled" },
  { label: "This Week", value: "68%", help: "progress" },
  { label: "Focus", value: "Deep Work", help: "2 hours remaining" },
];
export function SummaryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {summaryCards.map((item) => (
        <StatCard key={item.label} {...item} density="compact" />
      ))}
    </div>
  );
}
