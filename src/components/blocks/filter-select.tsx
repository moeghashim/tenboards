import { useRef } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";

export interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly { value: string; label: string; count?: number }[];
  onValueChange: (value: string) => void;
  allValue?: string;
  searchable?: boolean;
}
/** Caller-owned filter state; clear restores the sentinel and focuses the trigger. */
export function FilterSelect({
  label,
  value,
  options,
  onValueChange,
  allValue = "All",
  searchable = false,
}: FilterSelectProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const active = value !== allValue;
  const title = active ? `${label}: ${options.find((option) => option.value === value)?.label ?? value}` : label;
  const rows = (option: FilterSelectProps["options"][number]) => (
    <>
      <span>{option.label}</span>
      {option.count !== undefined && (
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{option.count}</span>
      )}
    </>
  );
  return (
    <div className="flex items-center gap-1">
      {searchable ? (
        <Combobox
          items={options}
          value={options.find((option) => option.value === value) ?? null}
          onValueChange={(option) => onValueChange(option?.value ?? allValue)}
          itemToStringLabel={(option) => option.label}
        >
          <ComboboxTrigger
            ref={trigger}
            render={<Button variant="outline" />}
            data-filter-active={active}
            aria-label={title}
          >
            {title}
          </ComboboxTrigger>
          <ComboboxContent className="min-w-64" aria-label={`${label} options`}>
            <ComboboxInput
              aria-label={`Search ${label} options`}
              placeholder={`Search ${label.toLowerCase()}…`}
              showTrigger={false}
            />
            <ComboboxEmpty>No matches.</ComboboxEmpty>
            <ComboboxList>
              <ComboboxGroup>
                <ComboboxLabel>{label}</ComboboxLabel>
                <ComboboxCollection>
                  {(option: FilterSelectProps["options"][number]) => (
                    <ComboboxItem key={option.value} value={option}>
                      {rows(option)}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      ) : (
        <Select value={value} onValueChange={(next) => onValueChange(next ?? allValue)} items={[...options]}>
          <SelectTrigger ref={trigger} aria-label={title} data-filter-active={active}>
            {title}
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {rows(option)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {active && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Clear ${label} filter`}
          onClick={() => {
            onValueChange(allValue);
            trigger.current?.focus();
          }}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
