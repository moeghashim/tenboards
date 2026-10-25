import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { requireAppRoute } from "@/lib/auth/app-route";

import { loadProject } from "../-components/project-functions";
export const Route = createFileRoute("/(main)/dashboard/projects/$projectId/")({
  beforeLoad: requireAppRoute,
  loader: async ({ params }) => {
    const { project } = await loadProject({ data: params });
    if (!project) throw notFound();
    throw redirect({ to: "/dashboard/projects/$projectId/overview", params, replace: true });
  },
});
