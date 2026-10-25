import { sidebarItems } from "./sidebar/sidebar-items.ts";

// Explicit coverage contract. Compare against generated metadata on every capture run.
// Dynamic project routes use concrete capture paths; palette integration belongs to consolidation.
export const captureRoutes = [
  { route: "/dashboard/assistant", path: "/dashboard/assistant", ready: "What would you like to explore?" },
  {
    route: "/dashboard/projects/$projectId",
    path: "/dashboard/projects/sample-operations",
    ready: "Operations rollout",
  },
  {
    route: "/dashboard/projects/$projectId/board",
    path: "/dashboard/projects/sample-operations/board",
    ready: "Operations rollout",
  },
  {
    route: "/dashboard/projects/$projectId/list",
    path: "/dashboard/projects/sample-operations/list",
    ready: "Operations rollout",
  },
  {
    route: "/chat",
    path: "/chat",
  },
  {
    route: "/dashboard",
    path: "/dashboard",
    ready: "Total Revenue",
  },
  {
    route: "/mail",
    path: "/mail",
  },
  {
    route: "/unauthorized",
    path: "/unauthorized",
  },
  {
    route: "/",
    path: "/",
    ready: "Total Revenue",
  },
  {
    route: "/auth/v2",
    path: "/auth/v2",
  },
  {
    route: "/dashboard/academy",
    path: "/dashboard/academy",
  },
  {
    route: "/dashboard/analytics",
    path: "/dashboard/analytics",
  },
  {
    route: "/dashboard/calendar",
    path: "/dashboard/calendar",
  },
  {
    route: "/dashboard/chat",
    path: "/dashboard/chat",
  },
  {
    route: "/dashboard/coming-soon",
    path: "/dashboard/coming-soon",
  },
  {
    route: "/dashboard/crm",
    path: "/dashboard/crm",
  },
  {
    route: "/dashboard/default",
    path: "/dashboard/default",
    ready: "Total Revenue",
  },
  {
    route: "/dashboard/ecommerce",
    path: "/dashboard/ecommerce",
  },
  {
    route: "/dashboard/file-manager",
    path: "/dashboard/file-manager",
  },
  {
    route: "/dashboard/finance",
    path: "/dashboard/finance",
  },
  {
    route: "/dashboard/infrastructure",
    path: "/dashboard/infrastructure",
  },
  {
    route: "/dashboard/invoice",
    path: "/dashboard/invoice",
  },
  {
    route: "/dashboard/kanban",
    path: "/dashboard/kanban",
  },
  {
    route: "/dashboard/logistics",
    path: "/dashboard/logistics",
  },
  {
    route: "/dashboard/mail",
    path: "/dashboard/mail",
  },
  {
    route: "/dashboard/patient-monitoring",
    path: "/dashboard/patient-monitoring",
  },
  {
    route: "/dashboard/productivity",
    path: "/dashboard/productivity",
  },
  {
    route: "/dashboard/products",
    path: "/dashboard/products",
  },
  {
    route: "/dashboard/profile",
    path: "/dashboard/profile",
  },
  {
    route: "/dashboard/roles",
    path: "/dashboard/roles",
  },
  {
    route: "/dashboard/tasks",
    path: "/dashboard/tasks",
  },
  {
    route: "/dashboard/users",
    path: "/dashboard/users",
  },
  {
    route: "/dashboard/$",
    path: "/dashboard/capture-not-found",
  },
  {
    route: "/dashboard/",
    path: "/dashboard/",
    ready: "Total Revenue",
  },
  {
    route: "/auth/v2/login",
    path: "/auth/v2/login",
  },
  {
    route: "/auth/v2/register",
    path: "/auth/v2/register",
  },
] as const satisfies readonly { route: string; path: string; ready?: string; status?: number }[];

const navRoutes = sidebarItems.flatMap((group) =>
  group.items.flatMap((item) =>
    (item.subItems ?? [item]).map((link) => ({ ...link, group: group.label ?? "Pages", icon: link.icon ?? item.icon })),
  ),
);
const extraLabels: Record<string, string> = {
  "/": "Home redirect",
  "/dashboard": "Dashboard redirect",
  "/dashboard/": "Dashboard index",
  "/auth/v2": "Authentication layout",
  "/chat": "Standalone Chat",
  "/mail": "Standalone Mail",
  "/unauthorized": "Unauthorized",
  "/dashboard/$": "Page not found",
  "/dashboard/coming-soon": "Coming soon",
};

export const routeCatalog = captureRoutes
  .filter((entry) => !entry.route.includes("$projectId"))
  .map((entry) => {
    const nav = navRoutes.find((item) => item.url === entry.route);
    return {
      ...entry,
      label: extraLabels[entry.route] ?? nav?.title ?? entry.route,
      group: nav?.group ?? "Other screens",
      icon: nav?.icon,
    };
  });

// Interim labels for direct project routes; guarded project-qualified shell navigation ships in 005.
export function projectRouteTitle(path: string) {
  const match = path.match(/^\/dashboard\/projects\/[^/]+(?:\/(board|list))?\/?$/);
  if (!match) return undefined;
  return match[1] ? `Project · ${match[1] === "board" ? "Board" : "List"}` : "Project";
}
