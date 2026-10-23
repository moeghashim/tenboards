import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Network, Printer, Volume2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { DataProvider, useDashboardData } from "./-components/data-context";
import { PatientMonitoring } from "./-components/patient-monitoring";
import { useMonitoringClock } from "./-components/use-realtime-tick";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { readPatients } = await import("@/server/data/patients");
  return readPatients();
});
export const Route = createFileRoute("/(main)/dashboard/patient-monitoring")({
  loader: () => loadData(),
  component: Page,
});

function Page() {
  return (
    <DataProvider data={Route.useLoaderData()}>
      <PageContent />
    </DataProvider>
  );
}
function PageContent() {
  const data = useDashboardData();
  const { patients, settings } = data;
  const now = useMonitoringClock();

  return (
    <div
      className="flex min-h-[calc(100svh-var(--dashboard-header-height))] min-w-0 flex-col"
      data-content-padding="false"
    >
      <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-2 py-2 text-sm lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:py-0">
        <h1 className="text-base font-medium">Patient monitoring · Demo</h1>
        <div className="whitespace-nowrap">{patients.length} Patients</div>
        <div className="text-muted-foreground col-span-2 flex items-center justify-between gap-3 lg:col-span-1 lg:justify-end">
          <span data-monitoring-clock className="text-xs whitespace-nowrap tabular-nums">
            {now === null
              ? "Connecting clock…"
              : `${new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC", hourCycle: "h23" }).format(now)} UTC`}
          </span>
          <Tooltip>
            <TooltipTrigger
              aria-label={`Alarm audio ${settings.audioEnabled ? "enabled" : "disabled"}`}
              className="inline-flex"
              type="button"
            >
              <Volume2 aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{`Alarm audio ${settings.audioEnabled ? "enabled" : "disabled"}`}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              aria-label={`Monitoring network ${settings.networkConnected ? "connected" : "disconnected"}`}
              className="inline-flex"
              type="button"
            >
              <Network aria-hidden="true" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{`Monitoring network ${settings.networkConnected ? "connected" : "disconnected"}`}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />

      {/*
        Patient records and baselines arrive through readPatients.
        use-patient-vital-series.ts repeats templates from waveform-data.ts,
        while use-realtime-tick.ts and realtime-utils.ts move the charts.
      */}
      <PatientMonitoring patients={patients} initialPatientId={settings.initialPatientId} />

      <Separator />
      <footer className="flex flex-wrap gap-2 p-2 *:data-[slot=button]:h-11 *:data-[slot=button]:min-w-32 *:data-[slot=button]:flex-1 *:data-[slot=button]:rounded-lg">
        <Button variant="outline">Main screen</Button>
        <Button variant="outline">Patient setup</Button>
        <Button variant="outline">Alarm review</Button>
        <Button variant="outline">Wave review</Button>
        <Button variant="outline">Trends</Button>
        <Button variant="outline">
          <Printer data-icon="inline-start" />
          Print
        </Button>
        <Button variant="outline">
          <Volume2 data-icon="inline-start" />
          Silence
        </Button>
        <Badge className="text-muted-foreground h-11 min-w-44 flex-1 rounded-lg" variant="outline">
          {`Device ${settings.deviceId} ${settings.connected ? "connected" : "disconnected"}`}
        </Badge>
      </footer>
    </div>
  );
}
