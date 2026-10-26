import { cn } from "cn";

import { Badge } from "@/components/ui/badge";

import type { PatientRecord } from "./data";
import { usePatientWaveformSeries } from "./use-patient-vital-series";
import { VitalWaveform } from "./vital-waveform";

interface PatientCardProps {
  active: boolean;
  acknowledged: boolean;
  onSelect: (id: string) => void;
  patient: PatientRecord;
}

export function PatientCard({ active, acknowledged, onSelect, patient }: PatientCardProps) {
  const hasActiveAlarm = patient.status === "alarm" && !acknowledged;
  const waveformSeries = usePatientWaveformSeries({ compact: true, kind: "ecg", patient });

  return (
    <button
      aria-pressed={active}
      className={cn(
        "bg-card text-card-foreground flex min-h-36 min-w-0 flex-col p-2 text-left",
        "hover:bg-muted/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        active && "ring-primary ring-2 ring-inset",
      )}
      onClick={() => onSelect(patient.id)}
      type="button"
    >
      <span className="sr-only">Open </span>
      <div className="flex w-full flex-wrap items-start justify-between gap-2">
        <div className="text-sm font-medium wrap-break-word">
          <span className={cn(hasActiveAlarm && "text-warning")}>{patient.bed}</span> {patient.name}
        </div>
        {hasActiveAlarm && (
          <Badge
            className="border-warning/30 bg-warning-surface text-warning h-auto shrink-0 rounded-md text-xs"
            variant="outline"
          >
            {patient.alarmShortLabel} {patient.heartRate}
          </Badge>
        )}
      </div>

      <div className="flex w-full flex-1 items-center">
        <VitalWaveform compact kind="ecg" showGrid={false} {...waveformSeries} />
      </div>

      <dl className="divide-border mt-auto grid grid-cols-2 divide-x tabular-nums">
        <div className="pr-2">
          <dt className="text-success text-xs">HR</dt>
          <dd
            className={cn(
              "text-success text-right text-2xl leading-none font-medium",
              hasActiveAlarm && "text-warning",
            )}
          >
            {patient.heartRate}
          </dd>
        </div>
        <div className="pl-2">
          <dt className="text-info text-xs">SpO₂</dt>
          <dd className="text-info text-right text-2xl leading-none font-medium">{patient.spo2}</dd>
        </div>
      </dl>
    </button>
  );
}
