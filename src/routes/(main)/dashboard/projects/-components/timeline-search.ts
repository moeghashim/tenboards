import { z } from "zod";

import { civilDate, SAMPLE_DATE } from "@/server/data/projects.types";

import { searchSchema } from "./project-search";
export const timelineSearch = searchSchema.extend({
  mode: z.enum(["gantt", "table", "calendar"]).optional().catch(undefined),
  scale: z.enum(["weeks", "months"]).catch("weeks"),
  periods: z.number().int().min(1).max(12).catch(4),
  start: civilDate.catch(SAMPLE_DATE),
});
export type TimelineSearch = z.infer<typeof timelineSearch>;
