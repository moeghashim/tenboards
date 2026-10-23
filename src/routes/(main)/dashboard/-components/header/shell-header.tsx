import { useRouterState } from "@tanstack/react-router";

import { cn } from "cn";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { AccountSwitcher } from "./account-switcher";
import { GitHubRepositoriesMenu } from "./github-repositories-menu";
import { LayoutControls } from "./layout-controls";
import { SearchTrigger } from "./search-dialog";
import { ThemeSwitcher } from "./theme-switcher";

const routeLabels = sidebarItems.flatMap((group) => group.items.flatMap((item) => item.subItems ?? [item]));

export function ShellHeader() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const title = routeLabels.find((item) => item.url === path)?.title ?? "Page not found";
  const { open } = useSidebar();
  return (
    <header className="bg-background flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6 [html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-20">
      <SidebarTrigger className={cn("shrink-0", open && "md:hidden")} />
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="text-muted-foreground hidden shrink-0 sm:inline">Workspace</span>
        <span className="text-muted-foreground hidden sm:inline" aria-hidden="true">
          /
        </span>
        <span className="truncate font-medium" title={title}>
          {title}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <div className="md:hidden">
          <SearchTrigger compact />
        </div>
        <ThemeSwitcher />
        <LayoutControls />
        <div className="hidden sm:block">
          <GitHubRepositoriesMenu />
        </div>
        <AccountSwitcher users={users} />
      </div>
    </header>
  );
}
