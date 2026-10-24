import { z } from "zod";

import { projectStatuses } from "@/server/data/projects.types";
export const projectIndexSearch = z.object({
  query: z.string().trim().max(200).catch(""),
  status: z.enum(projectStatuses).optional().catch(undefined),
});
