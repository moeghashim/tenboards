import { useEffect, useRef, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProjectSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 text-xs">
      <span>{label}</span>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next !== null) onChange(next);
        }}
        items={options}
      >
        <SelectTrigger aria-label={label} className="bg-background min-w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// URL changes restore the field; local edits commit after a brief typing pause.
export function useSearchDraft(value: string, commit: (value: string) => void) {
  const [draft, setDraft] = useState(value);
  const callback = useRef(commit);
  callback.current = commit;
  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => callback.current(draft), 300);
    return () => clearTimeout(timer);
  }, [draft, value]);
  return [draft, setDraft] as const;
}
