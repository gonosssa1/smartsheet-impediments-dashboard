"use client";

import Modal from "@/components/ui/Modal";
import { Impediment } from "@/types/impediment";
import { emailToDisplayName, formatDate } from "@/lib/formatters";
import { getSmartsheetCellUrl } from "@/lib/smartsheet";

interface ImpedimentDetailModalProps {
  impediment: Impediment;
  columnIds: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
}

interface FieldConfig {
  key: keyof Impediment;
  label: string;
  format?: (val: string | number | null) => string;
}

const FIELDS: FieldConfig[] = [
  { key: "impedimentTrackingNumber", label: "Tracking #" },
  { key: "impedimentStatus", label: "Status" },
  { key: "severity", label: "Severity" },
  { key: "impedimentPriorityRank", label: "Priority Rank" },
  { key: "description", label: "Description" },
  { key: "reporter", label: "Reporter" },
  { key: "reportedDate", label: "Reported Date", format: (v) => formatDate(v as string | null) },
  { key: "resolutionOwner", label: "Resolution Owner", format: (v) => emailToDisplayName(v as string | null) },
  { key: "resolutionCommittedDate", label: "Committed Date", format: (v) => formatDate(v as string | null) },
  { key: "resolutionActualDate", label: "Actual Resolution Date", format: (v) => formatDate(v as string | null) },
  { key: "escalationStatus", label: "Escalation Status" },
  { key: "escalatedTo", label: "Escalated To", format: (v) => v ? emailToDisplayName(v as string) : "-" },
  { key: "escalationDate", label: "Escalation Date", format: (v) => formatDate(v as string | null) },
  { key: "resolutionStatusDescription", label: "Resolution Status" },
];

export default function ImpedimentDetailModal({
  impediment,
  columnIds,
  isOpen,
  onClose,
}: ImpedimentDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={impediment.impedimentTitle ?? "Impediment Details"}
    >
      <div className="space-y-3">
        {FIELDS.map((field) => {
          const rawValue = impediment[field.key];
          const displayValue = field.format
            ? field.format(rawValue)
            : rawValue != null ? String(rawValue) : "-";
          const columnId = columnIds[field.key];
          const cellUrl = columnId
            ? getSmartsheetCellUrl(impediment.id, columnId)
            : null;

          return (
            <div key={field.key} className="group">
              <dt className="text-[12px] font-semibold text-brand-nepal">
                {field.label}
              </dt>
              <dd className="mt-0.5 flex items-center gap-2 text-[13px] text-brand-blumine">
                <span className="flex-1">{displayValue}</span>
                {cellUrl && (
                  <a
                    href={cellUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Edit "${field.label}" in Smartsheet`}
                    className="flex-shrink-0 rounded-lg p-1.5 text-brand-blue/70 opacity-0 transition-all hover:bg-brand-blue/10 hover:text-brand-blue group-hover:opacity-100"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                )}
              </dd>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <button
          onClick={onClose}
          className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-brand-nepal transition-colors hover:text-brand-blumine"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
