"use client";

import { useRouter } from "next/navigation";
import { emailToDisplayName } from "@/lib/formatters";

interface DrilldownFiltersProps {
  field: string | null;
  value: string | null;
  status: string | null;
}

const FIELD_LABELS: Record<string, string> = {
  escalatedTo: "Escalated To",
  severity: "Severity",
  resolutionOwner: "Resolution Owner",
};

function formatFilterValue(field: string, value: string): string {
  if (field === "escalatedTo" || field === "resolutionOwner") {
    return emailToDisplayName(value);
  }
  return value;
}

export default function DrilldownFilters({
  field,
  value,
  status,
}: DrilldownFiltersProps) {
  const router = useRouter();

  const clearFilters = () => {
    router.push("/drilldown");
  };

  const removeStatus = () => {
    if (field && value) {
      router.push(
        `/drilldown?field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-[13px] font-medium text-brand-nepal">
        Active Filters:
      </span>
      {field && value && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#003399]/8 px-3.5 py-1.5 text-[13px] font-semibold text-brand-blue">
          {FIELD_LABELS[field] ?? field}: {formatFilterValue(field, value)}
        </span>
      )}
      {status && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#186037]/8 px-3.5 py-1.5 text-[13px] font-semibold text-brand-green">
          Status: {status}
          <button
            onClick={removeStatus}
            className="ml-0.5 text-brand-green/60 transition-colors hover:text-brand-green"
            aria-label="Remove status filter"
          >
            &times;
          </button>
        </span>
      )}
      {(field || status) && (
        <button
          onClick={clearFilters}
          className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-brand-nepal transition-colors hover:bg-white hover:text-brand-blumine"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
