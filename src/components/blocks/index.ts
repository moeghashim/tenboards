/** Public presentation blocks. Data, routing and domain behavior stay with the caller. */

export type { DataTableFeatures } from "@/lib/data-table-features";
export { dataTableFeatures } from "@/lib/data-table-features";

export type { DashboardCardProps, SectionHeaderProps, StatCardProps } from "./cards";
export { DashboardCard, SectionHeader, StatCard } from "./cards";
export type { DashboardChartProps, DashboardLegendProps, DashboardTooltipProps, SeriesStyle } from "./charts";
export {
  chartAxis,
  chartCursor,
  chartGrid,
  chartSeries,
  DashboardChart,
  DashboardLegend,
  DashboardTooltip,
  formatCurrency,
  formatNumber,
  formatPercent,
  seriesConfig,
  useChartMotion,
} from "./charts";
export type { DataTableProps } from "./data-table";
export { DataTable } from "./data-table";
export type { PageHeaderProps } from "./page-header";
export { PageHeader } from "./page-header";
