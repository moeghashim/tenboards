import { useEffect, useState, useSyncExternalStore } from "react";

import { useChartMotion } from "@/components/blocks";

import { createRealtimeTicker, MONITORING_SPEED } from "./realtime-utils";

export const COMPACT_WAVEFORM_TICK_INTERVAL_MS = 100;
export const DETAIL_WAVEFORM_TICK_INTERVAL_MS = 100;

// The server and hydrating client always start at the same sample, even after a prior visit.
const getInitialTick = () => 0;
const subscribeIdle = () => () => {
  // Reduced motion has no timer subscription to release.
};
const monitoringSpeed = Math.max(MONITORING_SPEED, 0);
const compactWaveformTicker = createRealtimeTicker(COMPACT_WAVEFORM_TICK_INTERVAL_MS);
const detailWaveformTicker = createRealtimeTicker(DETAIL_WAVEFORM_TICK_INTERVAL_MS);
const trendTicker = createRealtimeTicker(1000);

export function useWaveformTick(compact: boolean) {
  const running = useChartMotion().isAnimationActive;
  const ticker = compact ? compactWaveformTicker : detailWaveformTicker;
  return (
    useSyncExternalStore(
      running ? ticker.subscribe : subscribeIdle,
      running ? ticker.getSnapshot : getInitialTick,
      getInitialTick,
    ) * monitoringSpeed
  );
}

export function useTrendTick() {
  const running = useChartMotion().isAnimationActive;
  return Math.floor(
    useSyncExternalStore(
      running ? trendTicker.subscribe : subscribeIdle,
      running ? trendTicker.getSnapshot : getInitialTick,
      getInitialTick,
    ) * monitoringSpeed,
  );
}

// No runtime clock is read during SSR or the first client render. The real clock
// starts after hydration; this also survives delayed JS and cross-timezone SSR.
export function useMonitoringClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);
  return now;
}
