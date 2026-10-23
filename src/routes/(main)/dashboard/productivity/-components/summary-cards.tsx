import { StatCard } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

export function SummaryCards() {
  const summaryCards = useDashboardData().summaryCards;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {summaryCards.map((item) => (
        <StatCard key={item.label} {...item} density="compact" />
      ))}
    </div>
  );
}
