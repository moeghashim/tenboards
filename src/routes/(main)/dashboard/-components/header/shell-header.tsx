import { useRouterState } from "@tanstack/react-router";

import { cn } from "cn";

import { SearchTrigger } from "@/components/navigation/search-trigger";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import type { DemoAccount } from "@/data/users";
import type { AuthState } from "@/lib/auth/types";
import { routeCatalog } from "@/navigation/route-catalog";

import { AccountSwitcher } from "./account-switcher";
import { GitHubRepositoriesMenu } from "./github-repositories-menu";
import { LayoutControls } from "./layout-controls";
import { SignedInAccount } from "./signed-in-account";
import { ThemeSwitcher } from "./theme-switcher";

type ShellIdentity = { mode: "demo"; accounts: DemoAccount[] } | { mode: "auth"; user: NonNullable<AuthState["user"]> };

export function ShellHeader({ identity }: { identity: ShellIdentity }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const title = routeCatalog.find((item) => item.path === path)?.label ?? "Page not found";
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
        {identity.mode === "demo" ? (
          <AccountSwitcher users={identity.accounts} />
        ) : (
          <SignedInAccount user={identity.user} />
        )}
      </div>
    </header>
  );
}
