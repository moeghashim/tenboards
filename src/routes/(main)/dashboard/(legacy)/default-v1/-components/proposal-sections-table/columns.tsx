import { createContext, useContext } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { FlexRender, Subscribe } from "@tanstack/react-table";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";
import { CircleCheckIcon, EllipsisVerticalIcon, GripVerticalIcon, LoaderIcon, TrendingUpIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  chartAxis,
  chartCursor,
  chartGrid,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  seriesConfig,
  useChartMotion,
} from "@/lib/charts/theme";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { useDashboardData } from "../data-context";
import type { ProposalSectionsRow } from "./schema";

const chartConfig = seriesConfig({ desktop: "Desktop", mobile: "Mobile" });

const sectionTypeItems = [
  { value: "Table of Contents", label: "Table of Contents" },
  { value: "Executive Summary", label: "Executive Summary" },
  { value: "Technical Approach", label: "Technical Approach" },
  { value: "Design", label: "Design" },
  { value: "Capabilities", label: "Capabilities" },
  { value: "Focus Documents", label: "Focus Documents" },
  { value: "Narrative", label: "Narrative" },
  { value: "Cover Page", label: "Cover Page" },
] as const;

const sectionStatusItems = [
  { value: "Done", label: "Done" },
  { value: "In Progress", label: "In Progress" },
  { value: "Not Started", label: "Not Started" },
] as const;

type SortableRowContextValue = Pick<ReturnType<typeof useSortable>, "handleRef">;

const SortableRowContext = createContext<SortableRowContextValue | null>(null);

function DragHandle() {
  const sortableRow = useContext(SortableRowContext);

  if (!sortableRow) {
    return null;
  }

  const { handleRef } = sortableRow;

  return (
    <Button ref={handleRef} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
      <GripVerticalIcon />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function ProposalSectionDetailViewer({ item }: { item: ProposalSectionsRow }) {
  const reviewerItems = useDashboardData().reviewers;
  const summary = useDashboardData().proposalSectionsTableColumnsSummary[0];

  const chartData = useDashboardData().proposalSectionsTableColumnsChartData;

  const isMobile = useIsMobile();
  const motion = useChartMotion();

  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger render={<Button variant="link" className="text-foreground w-fit px-0 text-left" />}>
        {item.header}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <DashboardChart config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid {...chartGrid} />
                  <XAxis dataKey="month" {...chartAxis} tickFormatter={(value) => value.slice(0, 3)} hide />
                  <ChartTooltip cursor={chartCursor} {...motion} content={<DashboardTooltip indicator="dot" />} />
                  <Area
                    {...motion}
                    strokeWidth={2}
                    strokeDasharray={chartConfig.mobile.strokeDasharray}
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.08}
                    stroke="var(--color-mobile)"
                  />
                  <Area
                    {...motion}
                    strokeWidth={2}
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.08}
                    stroke="var(--color-desktop)"
                  />
                  <ChartLegend itemSorter={null} content={<DashboardLegend config={chartConfig} />} />
                </AreaChart>
              </DashboardChart>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  {summary.value1}
                  <TrendingUpIcon />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just some random text to test the layout. It
                  spans multiple lines and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type} items={sectionTypeItems}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sectionTypeItems.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status} items={sectionStatusItems}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sectionStatusItems.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer} items={reviewerItems}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {reviewerItems.map((reviewer) => (
                      <SelectItem key={reviewer.value} value={reviewer.value}>
                        {reviewer.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose render={<Button variant="outline" />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function createInlineSaveHandler(header: string) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: `Saving ${header}`,
      success: "Done",
      error: "Error",
    });
  };
}

export const proposalSectionsColumns: ColumnDef<DataTableFeatures, ProposalSectionsRow>[] = [
  {
    id: "drag",
    header: () => null,
    cell: () => <DragHandle />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Subscribe source={table.atoms.rowSelection}>
          {() => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
              aria-label="Select all"
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
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(value)}
              aria-label="Select row"
            />
          )}
        </Subscribe>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => <ProposalSectionDetailViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Done" ? <CircleCheckIcon className="text-success" /> : <LoaderIcon />}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form onSubmit={createInlineSaveHandler(row.original.header)}>
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </Label>
        <Input
          id={`${row.original.id}-target`}
          defaultValue={row.original.target}
          className="hover:bg-input/30 focus-visible:bg-background dark:focus-visible:bg-input/30 dark:hover:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form onSubmit={createInlineSaveHandler(row.original.header)}>
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </Label>
        <Input
          id={`${row.original.id}-limit`}
          defaultValue={row.original.limit}
          className="hover:bg-input/30 focus-visible:bg-background dark:focus-visible:bg-input/30 dark:hover:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => <ProposalReviewerCell item={row.original} />,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="text-muted-foreground data-popup-open:bg-muted flex size-8"
              size="icon"
            />
          }
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];

export function DraggableProposalSectionsRow({
  row,
  index,
  isSelected,
}: {
  row: Row<DataTableFeatures, ProposalSectionsRow>;
  index: number;
  isSelected: boolean;
}) {
  const { handleRef, isDragging, ref } = useSortable({
    id: row.original.id,
    index,
    type: "proposal-section",
    accept: "proposal-section",
    group: "proposal-sections",
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <SortableRowContext.Provider value={{ handleRef }}>
      <TableRow
        ref={ref}
        data-state={isSelected && "selected"}
        data-dragging={isDragging}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            <FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    </SortableRowContext.Provider>
  );
}

function ProposalReviewerCell({ item }: { item: ProposalSectionsRow }) {
  const assignReviewerItems = useDashboardData().reviewers.slice(0, 2);

  const isAssigned = item.reviewer !== "Assign reviewer";

  if (isAssigned) {
    return item.reviewer;
  }

  return (
    <>
      <Label htmlFor={`${item.id}-reviewer`} className="sr-only">
        Reviewer
      </Label>
      <Select items={assignReviewerItems}>
        <SelectTrigger
          id={`${item.id}-reviewer`}
          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
          size="sm"
        >
          <SelectValue placeholder="Assign reviewer" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {assignReviewerItems.map((reviewer) => (
              <SelectItem key={reviewer.value} value={reviewer.value}>
                {reviewer.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
