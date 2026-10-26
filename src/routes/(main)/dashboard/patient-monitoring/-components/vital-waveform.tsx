import { cn } from "cn";
import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import { DashboardChart } from "@/components/blocks";
import type { ChartConfig } from "@/components/ui/chart";

import { getVerticalGridCoordinates } from "./chart-grid";

export type WaveformKind = "arterial" | "ecg" | "pleth" | "respiration";

export interface SignalPoint {
  value: number;
}

interface VitalWaveformProps {
  ariaLabel: string;
  compact?: boolean;
  data: SignalPoint[];
  domain: [number, number];
  kind: WaveformKind;
  showGrid: boolean;
}

const waveformChartConfig = {
  signal: {
    label: "Signal",
    color: "currentColor",
  },
} satisfies ChartConfig;

const waveformClasses: Record<WaveformKind, string> = {
  arterial: "text-danger",
  ecg: "text-success",
  pleth: "text-info",
  respiration: "text-warning",
};

export function VitalWaveform({ ariaLabel, compact = false, data, domain, kind, showGrid }: VitalWaveformProps) {
  const horizontalCenter = (domain[0] + domain[1]) / 2;

  return (
    <DashboardChart
      aria-label={ariaLabel}
      className={cn("aspect-auto w-full", compact ? "h-9 sm:h-9" : "h-full min-h-16 sm:h-full", waveformClasses[kind])}
      config={waveformChartConfig}
      initialDimension={compact ? { width: 280, height: 36 } : { width: 800, height: 64 }}
      role="img"
    >
      <LineChart accessibilityLayer data={data} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
        {showGrid && (
          <CartesianGrid
            horizontal
            horizontalValues={[horizontalCenter]}
            stroke="var(--border)"
            strokeOpacity={1}
            strokeWidth={0.75}
            vertical
            verticalCoordinatesGenerator={getVerticalGridCoordinates}
          />
        )}
        <YAxis allowDataOverflow domain={domain} hide width={0} />
        <Line
          dataKey="value"
          dot={false}
          isAnimationActive={false}
          stroke="var(--color-signal)"
          strokeWidth={compact ? 1.5 : 2}
          type={kind === "ecg" ? "linear" : "monotoneX"}
        />
      </LineChart>
    </DashboardChart>
  );
}
