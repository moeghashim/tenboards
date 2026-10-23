import { Bar, BarChart, CartesianGrid, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { CardContent } from "@/components/ui/card";
import { type ChartConfig, ChartTooltip } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartAxis, DashboardChart, DashboardTooltip, useChartMotion } from "@/lib/charts/theme";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";
import { useDashboardData } from "./data-context";

const chartConfig = {
  visitors: {
    color: "var(--chart-1)",
    label: "Visitors",
  },
} satisfies ChartConfig;

type TrafficSourceDatum = {
  label: string;
  source: string;
  visitors: number;
};

const renderValueLabel = (props: LabelProps) => {
  const { height, value, y } = props;

  return (
    <text
      className="fill-foreground"
      dominantBaseline="middle"
      dx={-6}
      fontSize={14}
      textAnchor="end"
      x="100%"
      y={Number(y) + Number(height) / 2}
    >
      {value}
    </text>
  );
};

function TrafficSourceBarChart({ data }: { data: TrafficSourceDatum[] }) {
  const motion = useChartMotion();
  return (
    <DashboardChart config={chartConfig} className="h-64 w-full sm:h-64">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 0,
          right: 48,
        }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <YAxis {...chartAxis} dataKey="source" width={110} tickLine={false} tickMargin={8} type="category" />
        <XAxis {...chartAxis} dataKey="visitors" hide type="number" />
        <ChartTooltip {...motion} cursor={false} content={<DashboardTooltip indicator="line" />} />
        <Bar {...motion} barSize={22} dataKey="visitors" fill="var(--color-visitors)" fillOpacity={1} radius={4}>
          <LabelList content={renderValueLabel} dataKey="label" />
        </Bar>
      </BarChart>
    </DashboardChart>
  );
}

export function TopTrafficSources() {
  const sourcesData = useDashboardData().topTrafficSourcesSourcesData;
  const campaignsData = useDashboardData().topTrafficSourcesCampaignsData;
  const referrersData = useDashboardData().topTrafficSourcesReferrersData;

  return (
    <Card className="h-full gap-2">
      <SectionHeader title="Traffic Sources" />

      <CardContent className="px-0">
        <Tabs defaultValue="sources" className="flex flex-col gap-3">
          <TabsList className="w-full justify-start border-b px-2.5" variant="line">
            <TabsTrigger className="flex-none font-normal" value="sources">
              Sources
            </TabsTrigger>
            <TabsTrigger className="flex-none font-normal" value="campaigns">
              Campaigns
            </TabsTrigger>
            <TabsTrigger className="flex-none font-normal" value="referrers">
              Referrers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="px-4">
            <TrafficSourceBarChart data={sourcesData} />
          </TabsContent>

          <TabsContent value="campaigns" className="px-4">
            <TrafficSourceBarChart data={campaignsData} />
          </TabsContent>
          <TabsContent value="referrers" className="px-4">
            <TrafficSourceBarChart data={referrersData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
