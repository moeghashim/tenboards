import { z } from "zod";

const civil = z.iso.date();
export function civilDate(date: string) {
  civil.parse(date);
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}
export function dateCivil(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function performanceDates<T extends object>(points: T[], renderedAt: string, stepHours: number) {
  const ref = new Date(renderedAt);
  const end = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate() + 1) - 1;
  return points.map((point, index) => ({
    ...point,
    date: new Date(end - (points.length - 1 - index) * stepHours * 3600000).toISOString().slice(0, 10),
  }));
}
export function rollingMonths(values: number[], renderedAt: string) {
  return values.map((qualified, index) => {
    const date = new Date(renderedAt);
    date.setUTCMonth(date.getUTCMonth() - (values.length - 1 - index));
    return { date: date.toISOString(), qualified };
  });
}
export function previousMonth(renderedAt: string) {
  const ref = new Date(renderedAt);
  // Only the month label is needed; day one preserves date-fns subMonths
  // semantics at month ends without overflowing into the current month.
  ref.setUTCDate(1);
  ref.setUTCMonth(ref.getUTCMonth() - 1);
  return new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(ref);
}
export function visitorRange<T extends { date: string }>(points: T[], reference: string, range: "90d" | "30d" | "7d") {
  civil.parse(reference);
  const start = Date.parse(reference) - Number(range.slice(0, -1)) * 86400000;
  return points.filter((p) => Date.parse(p.date) >= start);
}
export type RevenueModel = {
  minimum: number;
  maximum: number;
  initial: number;
  frequency: number;
  phase: number;
  amplitude: number;
  bias: number;
  step: number;
};
export function revenueRange(model: RevenueModel, from: string, to: string) {
  civil.parse(from);
  civil.parse(to);
  const start = Date.parse(from),
    end = Date.parse(to);
  if (end < start || end - start > 3660 * 86400000) throw new Error("Invalid revenue range");
  let current = model.initial;
  const result: { day: string; revenue: number }[] = [];
  for (let day = start, index = 0; day <= end; day += 86400000, index++) {
    current = Math.max(
      model.minimum,
      Math.min(
        model.maximum,
        current +
          Math.round((Math.sin(index * model.frequency + model.phase) * model.amplitude + model.bias) * model.step),
      ),
    );
    result.push({
      day: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(day)),
      revenue: current,
    });
  }
  return result;
}
