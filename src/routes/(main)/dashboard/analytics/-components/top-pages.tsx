import { DashboardCard as Card, SectionHeader } from "@/components/blocks";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useDashboardData } from "./data-context";

export function TopPages() {
  const pages = useDashboardData().topPagesPages;

  return (
    <Card className="h-full gap-2">
      <SectionHeader title="Page Performance" />

      <CardContent className="px-0">
        <Table className="min-w-[540px] [&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4">
          <TableHeader className="[&_tr]:border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8">Page</TableHead>
              <TableHead className="h-8 w-24 text-right font-normal">Views</TableHead>
              <TableHead className="h-8 w-24 text-right font-normal">Avg Time</TableHead>
              <TableHead className="h-8 w-20 text-right font-normal">Bounce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:border-border/50">
            {pages.map((page) => (
              <TableRow className="hover:bg-transparent" key={page.path}>
                <TableCell className="py-3 font-medium">{page.path}</TableCell>
                <TableCell className="text-right tabular-nums">{page.views}</TableCell>
                <TableCell className="text-muted-foreground text-right tabular-nums">{page.time}</TableCell>
                <TableCell className="text-muted-foreground text-right tabular-nums">{page.bounce}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
