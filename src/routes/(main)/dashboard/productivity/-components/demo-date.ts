import { civilDate } from "@/server/data/core-dates";
export function createDemoDay(value: string) {
  const date = civilDate(value);
  date.setHours(12);
  return date;
}
export function createDemoMonth(value: string) {
  const date = createDemoDay(value);
  date.setDate(1);
  return date;
}
