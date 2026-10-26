import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";

import { Cog, Download, Grid, Plus, Rows3, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
// biome-ignore lint/style/noRestrictedImports: Existing specialized card layout preserves its density/size semantics; DashboardCard migration needs separate visual review.
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataTableFeatures } from "@/lib/data-table-features";

import { filters, type UserRow } from "./data";
import { usersColumns } from "./users-columns";
import { UsersTable } from "./users-table";

const userFilterItems = {
  role: filters.role.map((option) => ({ value: option, label: option })),
  team: filters.team.map((option) => ({ value: option, label: option })),
  status: filters.status.map((option) => ({ value: option, label: option })),
  workspace: filters.workspace.map((option) => ({ value: option, label: option })),
};

export function Users({ users }: { users: UserRow[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "joinedDate", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({
    search: false,
    team: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useTable({
    features: dataTableFeatures,
    data: users,
    columns: usersColumns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.email,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const roleFilter = (table.getColumn("role")?.getFilterValue() as string | undefined) ?? filters.role[0];
  const teamFilter = (table.getColumn("team")?.getFilterValue() as string | undefined) ?? filters.team[0];
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? filters.status[0];
  const workspaceFilter =
    (table.getColumn("workspace")?.getFilterValue() as string[] | undefined)?.[0] ?? filters.workspace[0];
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  function setColumnSelectFilter(columnId: string, value: string | null) {
    const filter = !value || value === "All" ? undefined : value;
    // Table v9 array membership filters accept a list of candidate values.
    table.getColumn(columnId)?.setFilterValue(columnId === "workspace" && filter ? [filter] : filter);
    table.setPageIndex(0);
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle>
          <h1 className="text-2xl font-medium tracking-tight">Users</h1>
        </CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Manage your organization members and their access.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              aria-label="Search users"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>
          <Button variant="outline" size="sm">
            <SlidersHorizontal /> Hide
          </Button>
          <Button variant="outline" size="sm">
            <Cog /> Customize
          </Button>
          <Button variant="outline" size="sm">
            <Download /> Export
          </Button>
          <Button size="sm">
            <Plus /> Add User
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              items={userFilterItems.role}
              value={roleFilter}
              onValueChange={(value) => setColumnSelectFilter("role", value)}
            >
              <SelectTrigger size="sm" aria-label="Filter users by role">
                <span className="text-muted-foreground">Role:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {filters.role.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              items={userFilterItems.team}
              value={teamFilter}
              onValueChange={(value) => setColumnSelectFilter("team", value)}
            >
              <SelectTrigger size="sm" aria-label="Filter users by team">
                <span className="text-muted-foreground">Team:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {filters.team.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              items={userFilterItems.status}
              value={statusFilter}
              onValueChange={(value) => setColumnSelectFilter("status", value)}
            >
              <SelectTrigger size="sm" aria-label="Filter users by status">
                <span className="text-muted-foreground">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {filters.status.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Select
            items={userFilterItems.workspace}
            value={workspaceFilter}
            onValueChange={(value) => setColumnSelectFilter("workspace", value)}
          >
            <SelectTrigger size="sm" aria-label="Filter users by workspace">
              <span className="text-muted-foreground">Workspace:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false}>
              <SelectGroup>
                {filters.workspace.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 px-4">
          <div className="text-muted-foreground text-sm tabular-nums" aria-live="polite">
            {selectedCount} selected
          </div>

          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list" aria-label="List view">
                <Rows3 />
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label="Grid view">
                <Grid />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <UsersTable table={table} />
      </CardContent>
    </Card>
  );
}
