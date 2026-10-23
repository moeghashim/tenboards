import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";

import { cn } from "cn";
import { parse } from "date-fns";
import { Check, Clock, MoreHorizontal, X } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { getInitials } from "@/lib/utils";

import { statusMeta, type UserRow } from "./data";

function RoleCell({ role, team }: { role: string; team: string }) {
  return (
    <div className="grid gap-0.5">
      <span className="whitespace-nowrap">{role}</span>
      <span className="text-muted-foreground text-xs">{team}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: UserRow["status"] }) {
  const meta = statusMeta[status];

  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}

function getLastActiveBadge(lastActive: number) {
  if (lastActive < 1) {
    return {
      className: "bg-success-surface text-success",
      icon: Check,
    };
  }

  if (lastActive < 4 * 60) {
    return {
      className: "bg-warning-surface text-warning",
      icon: Clock,
    };
  }

  if (lastActive < 7 * 24 * 60) {
    return {
      className: "bg-danger-surface text-danger",
      icon: null,
    };
  }

  return {
    className: "bg-muted text-muted-foreground",
    icon: X,
  };
}

function AvatarCell({ lastActive, name }: { lastActive: number; name: string }) {
  const badge = getLastActiveBadge(lastActive);
  const BadgeIcon = badge.icon;

  return (
    <Avatar size="lg" className="font-medium">
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
      <AvatarBadge
        title={lastActive === 0 ? "Active now" : `Last active ${lastActive} minutes ago`}
        className={badge.className}
      >
        {BadgeIcon ? <BadgeIcon /> : null}
      </AvatarBadge>
    </Avatar>
  );
}

function WorkspaceCell({ workspaces }: { workspaces: string[] }) {
  return <div className="max-w-48 text-xs whitespace-normal">{workspaces.join(", ")}</div>;
}

export const usersColumns: ColumnDef<DataTableFeatures, UserRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Subscribe source={table.atoms.rowSelection}>
          {() => (
            <Checkbox
              aria-label="Select all users"
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            />
          )}
        </Subscribe>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
          {(checked) => (
            <Checkbox
              aria-label={`Select ${row.original.name}`}
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(value)}
            />
          )}
        </Subscribe>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.name} ${row.email}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <AvatarCell name={row.original.name} lastActive={row.original.lastActive} />
        <div className="min-w-0">
          <div className="text-foreground text-sm font-medium break-words whitespace-normal">{row.original.name}</div>
          <div className="text-muted-foreground text-sm break-words whitespace-normal">{row.original.email}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role / Team",
    filterFn: "equalsString",
    cell: ({ row }) => <RoleCell role={row.original.role} team={row.original.team} />,
  },
  {
    accessorKey: "team",
    header: "Team",
    filterFn: "equalsString",
    cell: ({ row }) => <div className="text-sm">{row.original.team}</div>,
  },
  {
    accessorKey: "workspace",
    header: "Workspace",
    filterFn: "arrIncludes",
    cell: ({ row }) => <WorkspaceCell workspaces={row.original.workspace} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "joinedDate",
    accessorFn: (row) => parse(row.joinedDate, "dd MMM yyyy, h:mm a", new Date()).getTime(),
    header: "Joined date",
    cell: ({ row }) => <div className="text-foreground text-sm">{row.original.joinedDate}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label={`Open actions for ${row.original.name}`}
                className="text-muted-foreground hover:bg-muted/50 size-8 rounded-md"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuItem>Manage team</DropdownMenuItem>
              <DropdownMenuItem>Resend invite</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Deactivate user</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
