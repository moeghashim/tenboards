import "./-components/sidebar/shell-sidebar.css";

import type { CSSProperties } from "react";

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { cn } from "cn";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardLayout } from "@/server/server-actions";

import { ShellHeader } from "./-components/header/shell-header";
import { AppSidebar } from "./-components/sidebar/app-sidebar";

const getAccounts = createServerFn({ method: "GET" }).handler(async () => {
  const { readAccounts } = await import("@/server/data/accounts");
  return readAccounts();
});

export const Route = createFileRoute("/(main)/dashboard")({
  loader: async () => {
    const [layout, accounts] = await Promise.all([getDashboardLayout(), getAccounts()]);
    return { ...layout, accounts };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { defaultOpen, variant, collapsible, accounts } = Route.useLoaderData();

  return (
    <SidebarProvider
      className="tenboards-shell"
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "4.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(14)]",
          "min-w-0 overflow-x-clip",
        )}
      >
        <ShellHeader accounts={accounts} />
        {/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
