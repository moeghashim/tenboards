import { CalendarDays, Columns3, Files, LayoutDashboard, List } from "lucide-react";

import { searchSchema } from "@/routes/(main)/dashboard/projects/-components/project-search";
import { timelineSearch } from "@/routes/(main)/dashboard/projects/-components/timeline-search";
import type { Project } from "@/server/data/projects.types";
export type NavigationProject = Pick<Project, "id" | "name" | "status" | "favorite">;
export type ProjectNavigationData = { projects: NavigationProject[]; error: boolean };
export const projectViews = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "board", label: "Board", icon: Columns3 },
  { id: "list", label: "List", icon: List },
  { id: "timeline", label: "Timeline", icon: CalendarDays },
  { id: "files", label: "Files", icon: Files },
] as const;
export type ProjectView = (typeof projectViews)[number]["id"];
export function projectDestination(projectId: string, view: ProjectView) {
  const params = { projectId };
  switch (view) {
    case "overview":
      return { to: "/dashboard/projects/$projectId/overview" as const, params };
    case "board":
      return { to: "/dashboard/projects/$projectId/board" as const, params, search: searchSchema.parse({}) };
    case "list":
      return { to: "/dashboard/projects/$projectId/list" as const, params, search: searchSchema.parse({ limit: 10 }) };
    case "timeline":
      return { to: "/dashboard/projects/$projectId/timeline" as const, params, search: timelineSearch.parse({}) };
    case "files":
      return { to: "/dashboard/projects/$projectId/files" as const, params, search: { view: "grid" as const } };
  }
}
export function projectLocation(path: string) {
  const match = path.match(/^\/dashboard\/projects\/([^/]+)(?:\/(overview|board|list|timeline|files))?\/?$/);
  if (!match) return null;
  try {
    return { projectId: decodeURIComponent(match[1]), view: match[2] as ProjectView | undefined };
  } catch {
    return null;
  }
}
export function projectPath(projectId: string, view: ProjectView) {
  return `/dashboard/projects/${encodeURIComponent(projectId)}/${view}`;
}
