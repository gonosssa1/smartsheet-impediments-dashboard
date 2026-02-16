"use client";

import { Impediment } from "@/types/impediment";
import { emailToDisplayName, formatDate, truncateText } from "@/lib/formatters";

interface DrilldownTableProps {
  impediments: Impediment[];
  onRowClick?: (impediment: Impediment) => void;
}

export default function DrilldownTable({ impediments, onRowClick }: DrilldownTableProps) {
  if (impediments.length === 0) {
    return (
      <div
        className="rounded-[var(--card-radius)] bg-white p-10 text-center"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        <p className="text-sm font-medium text-brand-nepal">
          No impediments match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-[var(--card-radius)] bg-white"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <table className="min-w-full text-[13px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Tracking #
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Title
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Status
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Severity
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Reporter
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Reported Date
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Resolution Owner
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Escalation
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Escalated To
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-left font-semibold text-brand-nepal">
              Resolution Status
            </th>
          </tr>
        </thead>
        <tbody>
          {impediments.map((imp) => (
            <tr
              key={imp.id}
              className={`border-b border-slate-50 transition-colors last:border-none hover:bg-slate-50/50 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(imp)}
            >
              <td className="whitespace-nowrap px-5 py-3.5 font-mono font-medium text-brand-blue">
                {imp.impedimentTrackingNumber ?? "-"}
              </td>
              <td className="max-w-xs px-5 py-3.5 font-medium text-foreground">
                {truncateText(imp.impedimentTitle, 60)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <StatusBadge status={imp.impedimentStatus} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <SeverityBadge severity={imp.severity} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-brand-blumine">
                {imp.reporter ?? "-"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-brand-blumine">
                {formatDate(imp.reportedDate)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-brand-blumine">
                {emailToDisplayName(imp.resolutionOwner)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <EscalationBadge status={imp.escalationStatus} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-brand-blumine">
                {imp.escalatedTo ? emailToDisplayName(imp.escalatedTo) : "-"}
              </td>
              <td className="max-w-xs px-5 py-3.5 text-brand-blumine">
                {truncateText(imp.resolutionStatusDescription, 60)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-brand-nepal">-</span>;
  const isOpen = status === "Open";
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        isOpen
          ? "bg-[#0A7CC1]/10 text-[#0A7CC1]"
          : "bg-[#186037]/10 text-[#186037]"
      }`}
    >
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string | null }) {
  if (!severity) return <span className="text-brand-nepal">-</span>;
  const colors: Record<string, string> = {
    Critical: "bg-[#DE4702]/10 text-[#DE4702]",
    High: "bg-[#0088A1]/10 text-[#0088A1]",
    Medium: "bg-[#003399]/10 text-[#003399]",
  };
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        colors[severity] ?? "bg-slate-50 text-slate-500"
      }`}
    >
      {severity}
    </span>
  );
}

function EscalationBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-brand-nepal">-</span>;
  const isEscalated = status === "Escalated";
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        isEscalated
          ? "bg-[#DE4702]/10 text-[#DE4702]"
          : "bg-slate-50 text-brand-nepal"
      }`}
    >
      {status}
    </span>
  );
}
