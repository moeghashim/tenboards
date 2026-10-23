import { Fragment, useState } from "react";

import { cn } from "cn";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { PatientRecord } from "./data";
import { useDashboardData } from "./data-context";
import { PatientCard } from "./patient-card";
import { PatientDetail } from "./patient-detail";
import { PatientTrends } from "./patient-trends";

interface PatientMonitoringProps {
  patients: PatientRecord[];
  initialPatientId: string;
}

export function PatientMonitoring({ patients, initialPatientId }: PatientMonitoringProps) {
  const { settings } = useDashboardData();
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [acknowledgedPatientIds, setAcknowledgedPatientIds] = useState<string[]>([]);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];
  if (!selectedPatient) return <div className="text-muted-foreground p-4">No patients available.</div>;
  const acknowledged = acknowledgedPatientIds.includes(selectedPatient.id);
  const hasActiveAlarm = selectedPatient.status === "alarm" && !acknowledged;

  function acknowledgePatient(patientId: string) {
    setAcknowledgedPatientIds((current) => (current.includes(patientId) ? current : [...current, patientId]));
  }

  return (
    <div className="grid min-w-0 flex-1 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="*:border-border grid grid-cols-2 content-start *:border-r *:border-b *:even:border-r-0">
        {patients.map((patient) => (
          <PatientCard
            acknowledged={acknowledgedPatientIds.includes(patient.id)}
            active={patient.id === selectedPatient.id}
            key={patient.id}
            onSelect={setSelectedPatientId}
            patient={patient}
          />
        ))}
      </div>

      <div className="border-border flex min-w-0 flex-col lg:border-l">
        <div className="bg-muted/50 flex min-h-11 flex-wrap items-center gap-2 px-3 py-3">
          <div className="flex items-center gap-3 font-medium">
            <Badge className="rounded-md" variant="outline">
              {selectedPatient.bed}
            </Badge>
            <span className="text-base">{selectedPatient.name}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {selectedPatient.age} {selectedPatient.sex} · {selectedPatient.diagnosis}
          </div>
        </div>
        <Separator />

        {selectedPatient.alarm && (
          <Alert
            className={cn(
              "min-h-9 rounded-none border-x-0 border-t-0 pr-32",
              hasActiveAlarm
                ? "border-warning/30 bg-warning-surface text-warning"
                : "border-border bg-muted text-foreground",
            )}
            variant="default"
          >
            <AlertTitle>{selectedPatient.alarm}</AlertTitle>
            {selectedPatient.alarmDuration && (
              <AlertDescription className={cn(hasActiveAlarm && "text-warning")}>
                Active for {selectedPatient.alarmDuration}
              </AlertDescription>
            )}
            <AlertAction className="top-1/2 -translate-y-1/2">
              <Button
                className="rounded-none"
                disabled={acknowledged}
                onClick={() => acknowledgePatient(selectedPatient.id)}
                size="sm"
                variant="secondary"
              >
                {acknowledged ? "Acknowledged" : "Acknowledge"}
              </Button>
            </AlertAction>
          </Alert>
        )}

        <PatientDetail hasActiveAlarm={hasActiveAlarm} patient={selectedPatient} />

        <Tabs className="min-h-0 flex-1 gap-0" defaultValue="trends">
          <TabsList
            className="*:border-border h-auto w-full flex-wrap justify-start gap-0 border-b p-0 *:h-full *:max-w-32 *:rounded-none *:border-0 *:border-r *:after:-bottom-px!"
            variant="line"
          >
            <TabsTrigger value="real-time">Real time</TabsTrigger>
            <TabsTrigger value="events">Event review</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="disclosure">Full disclosure</TabsTrigger>
          </TabsList>

          <TabsContent
            className="m-0 flex flex-col items-center justify-center gap-1 px-4 text-center"
            value="real-time"
          >
            <p className="text-sm font-medium">Demo monitoring is active</p>
            <p className="text-muted-foreground text-xs">
              Simulated waveforms update above; reduced motion pauses traces. Numeric readings remain available.
            </p>
          </TabsContent>
          <TabsContent className="m-0" value="events">
            <div className="min-h-44">
              <div className="bg-muted/40 text-muted-foreground grid grid-cols-[4rem_1fr] px-4 py-2 text-xs font-medium">
                <span>Time</span>
                <span>Event</span>
              </div>
              <Separator />
              {selectedPatient.recentEvents.map((event, index) => (
                <Fragment key={`${event.time}-${event.label}`}>
                  <div className="grid min-h-11 grid-cols-[4rem_1fr] items-center px-4 py-2 text-sm">
                    <span className="text-muted-foreground tabular-nums">{event.time}</span>
                    <span>{event.label}</span>
                  </div>
                  {index < selectedPatient.recentEvents.length - 1 && <Separator />}
                </Fragment>
              ))}
            </div>
          </TabsContent>
          <TabsContent className="m-0" value="trends">
            <PatientTrends patient={selectedPatient} />
          </TabsContent>
          <TabsContent
            className="m-0 flex flex-col items-center justify-center gap-1 px-4 text-center"
            value="disclosure"
          >
            <p className="text-sm font-medium">{`Full disclosure recording is ${settings.recordingActive ? "active" : "inactive"}`}</p>
            <p className="text-muted-foreground text-xs">
              {`Continuous waveform history is available for the last ${settings.historyHours} hours.`}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
