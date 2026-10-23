import { cn } from "cn";

import type { PatientRecord } from "./data";
import { useDashboardData } from "./data-context";
import { type EcgLead, usePatientWaveformSeries } from "./use-patient-vital-series";
import { VitalWaveform, type WaveformKind } from "./vital-waveform";

interface PatientDetailProps {
  hasActiveAlarm: boolean;
  patient: PatientRecord;
}

interface TraceRowProps {
  calibration?: string;
  kind: WaveformKind;
  label: string;
  lead?: EcgLead;
  patient: PatientRecord;
}

function TraceRow({ calibration, kind, label, lead, patient }: TraceRowProps) {
  const series = usePatientWaveformSeries({ kind, lead, patient });

  return (
    <div className="border-border grid min-h-16 grid-cols-[6.5rem_minmax(0,1fr)] border-b">
      <div className="flex flex-col gap-0.5 px-3 py-2">
        <span
          className={cn(
            "text-sm font-medium",
            kind === "ecg" && "text-success",
            kind === "pleth" && "text-info",
            kind === "respiration" && "text-warning",
            kind === "arterial" && "text-danger",
          )}
        >
          {label}
        </span>
        {calibration && <span className="text-muted-foreground text-xs">{calibration}</span>}
      </div>
      <VitalWaveform kind={kind} showGrid {...series} />
    </div>
  );
}

function NumericVital({
  color,
  label,
  limits,
  unit,
  value,
}: {
  color: string;
  label: string;
  limits: string;
  unit: string;
  value: number | string;
}) {
  return (
    <div className="border-border grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center border-b px-3 py-1">
      <dt className={cn("text-sm font-medium", color)}>
        {label}
        <span className="text-muted-foreground block text-xs font-normal">{limits}</span>
      </dt>
      <dd
        className={cn(
          "flex flex-wrap items-baseline justify-end gap-1 text-right text-2xl leading-none font-medium tabular-nums",
          color,
        )}
      >
        {value} <span className="text-xs">{unit}</span>
      </dd>
    </div>
  );
}

export function PatientDetail({ hasActiveAlarm, patient }: PatientDetailProps) {
  const settings = useDashboardData().settings;
  return (
    <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="border-border xl:after:border-border min-w-0 after:hidden xl:grid xl:grid-rows-6 xl:border-r xl:after:block xl:after:border-b">
        <TraceRow calibration="25 mm/s · 10 mm/mV" kind="ecg" label="ECG II" lead="II" patient={patient} />
        <TraceRow calibration="25 mm/s · 10 mm/mV" kind="ecg" label="ECG V5" lead="V5" patient={patient} />
        <TraceRow kind="pleth" label="Pleth" patient={patient} />
        <TraceRow calibration="10 mm/mV" kind="respiration" label="Resp" patient={patient} />
        <TraceRow calibration="mmHg" kind="arterial" label="ART" patient={patient} />
      </div>

      <dl className="xl:grid xl:grid-rows-6">
        <NumericVital
          color={hasActiveAlarm ? "text-warning" : "text-success"}
          label="HR"
          limits={`${settings.hrMin}–${settings.hrMax}`}
          unit="bpm"
          value={patient.heartRate}
        />
        <NumericVital
          color="text-info"
          label="SpO₂"
          limits={`${settings.spo2Min}–${settings.spo2Max}`}
          unit="%"
          value={patient.spo2}
        />
        <NumericVital
          color="text-warning"
          label="RR"
          limits={`${settings.rrMin}–${settings.rrMax}`}
          unit="/min"
          value={patient.respirationRate}
        />
        <NumericVital
          color="text-foreground"
          label="NIBP"
          limits={`${settings.nibpMin}–${settings.nibpMax}`}
          unit={`(${patient.map})`}
          value={patient.nibp}
        />
        <NumericVital
          color="text-danger"
          label="ART"
          limits={`${settings.arterialMin}–${settings.arterialMax}`}
          unit={`(${patient.arterialMap})`}
          value={patient.arterialPressure}
        />
        <NumericVital
          color="text-foreground"
          label="Temp"
          limits={`${settings.temperatureMin.toFixed(1)}–${settings.temperatureMax.toFixed(1)}`}
          unit="°C"
          value={patient.temperature}
        />
      </dl>
    </div>
  );
}
