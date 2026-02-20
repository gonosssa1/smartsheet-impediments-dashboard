"use client";

import { useState } from "react";
import Link from "next/link";
import { DeadlineItem, Impediment } from "@/types/impediment";
import { emailToDisplayName, formatDate, truncateText } from "@/lib/formatters";
import { DUE_SOON_THRESHOLD_DAYS } from "@/lib/constants";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import ImpedimentDetailModal from "@/components/drilldown/ImpedimentDetailModal";

type EscalationFilter = "all" | "escalated" | "non-escalated";

interface UpcomingDeadlinesProps {
  items: DeadlineItem[];
  impediments: Impediment[];
  columnIds: Record<string, number>;
}

function StatusBadge({ item }: { item: DeadlineItem }) {
  if (item.daysUntilDue < 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-brand-persimmon/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-persimmon">
        OVERDUE
      </span>
    );
  }
  if (item.daysUntilDue === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-brand-persimmon/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-persimmon">
        TODAY
      </span>
    );
  }
  if (item.daysUntilDue <= DUE_SOON_THRESHOLD_DAYS) {
    return (
      <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-blue">
        DUE SOON
      </span>
    );
  }
  return null;
}

function DaysLabel({ days }: { days: number }) {
  if (days < 0) {
    return (
      <span className="font-semibold text-brand-persimmon">
        {Math.abs(days)}d overdue
      </span>
    );
  }
  if (days === 0) {
    return <span className="font-semibold text-brand-persimmon">Today</span>;
  }
  return (
    <span className="font-semibold text-brand-blumine">{days}d</span>
  );
}

export default function UpcomingDeadlines({ items, impediments, columnIds }: UpcomingDeadlinesProps) {
  const [selectedItem, setSelectedItem] = useState<DeadlineItem | null>(null);
  const [detailImpediment, setDetailImpediment] = useState<Impediment | null>(null);
  const [escalationFilter, setEscalationFilter] = useState<EscalationFilter>("all");

  if (items.length === 0) return null;

  const filteredItems = items.filter((item) => {
    if (escalationFilter === "escalated") return item.escalationStatus === "Escalated";
    if (escalationFilter === "non-escalated") return item.escalationStatus !== "Escalated";
    return true;
  });

  const overdueCount = filteredItems.filter((i) => i.daysUntilDue < 0).length;
  const todayCount = filteredItems.filter((i) => i.daysUntilDue === 0).length;
  const dueSoonCount = filteredItems.filter((i) => i.daysUntilDue > 0 && i.daysUntilDue <= DUE_SOON_THRESHOLD_DAYS).length;

  const handleTitleClick = (item: DeadlineItem) => {
    const imp = impediments.find((i) => i.id === item.id);
    if (imp) setDetailImpediment(imp);
  };

  const filterButtons: { key: EscalationFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "escalated", label: "Escalated" },
    { key: "non-escalated", label: "Non-Escalated" },
  ];

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center gap-3 px-8 pb-2 pt-7">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-brand-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
          <h3 className="text-[15px] font-bold tracking-tight text-brand-blue">
            Upcoming Deadlines
          </h3>
          <span className="text-[12px] font-medium text-brand-nepal">(Open only)</span>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="rounded-full bg-brand-persimmon/10 px-2.5 py-0.5 text-[12px] font-bold text-brand-persimmon">
              {overdueCount} Overdue
            </span>
          )}
          {todayCount > 0 && (
            <span className="rounded-full bg-brand-persimmon/10 px-2.5 py-0.5 text-[12px] font-bold text-brand-persimmon">
              {todayCount} Today
            </span>
          )}
          {dueSoonCount > 0 && (
            <span className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[12px] font-bold text-brand-blue">
              {dueSoonCount} Due Soon
            </span>
          )}
        </div>
        <div role="group" aria-label="Escalation filter" className="ml-auto flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setEscalationFilter(btn.key)}
              aria-pressed={escalationFilter === btn.key}
              className={`rounded-md px-3 py-1 text-[12px] font-semibold transition-all ${
                escalationFilter === btn.key
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-brand-nepal hover:text-brand-blumine"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto px-3 pb-5">
        <table className="min-w-full text-[13px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Tracking #
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Title
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Committed Date
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Days
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Resolution Owner
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-foreground">
                Resolution Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-slate-50 last:border-none ${
                  item.isOverdue ? "bg-brand-persimmon/[0.03]" : ""
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge item={item} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {item.impedimentTrackingNumber ? (
                    <Link
                      href={`/drilldown?field=impedimentTrackingNumber&value=${encodeURIComponent(item.impedimentTrackingNumber)}`}
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      {item.impedimentTrackingNumber}
                    </Link>
                  ) : (
                    <span className="text-brand-nepal">-</span>
                  )}
                </td>
                <td className="max-w-[260px] truncate px-4 py-3">
                  <button
                    onClick={() => handleTitleClick(item)}
                    aria-label={`View details for ${item.impedimentTitle}`}
                    className="max-w-full truncate text-left text-brand-blue hover:underline"
                  >
                    {truncateText(item.impedimentTitle, 60)}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-brand-blumine">
                  {formatDate(item.resolutionCommittedDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <DaysLabel days={item.daysUntilDue} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-brand-blumine">
                  {emailToDisplayName(item.resolutionOwner)}
                </td>
                <td className="max-w-[300px] px-4 py-3">
                  {item.resolutionStatusDescription ? (
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="max-w-full truncate text-left text-brand-blue hover:underline"
                    >
                      {truncateText(item.resolutionStatusDescription, 50)}
                    </button>
                  ) : (
                    <span className="text-brand-nepal">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.impedimentTitle ?? "Resolution Status"}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px]">
              {selectedItem.impedimentTrackingNumber && (
                <div>
                  <dt className="text-[12px] font-semibold text-brand-nepal">Tracking #</dt>
                  <dd className="mt-0.5 font-semibold text-brand-blue">
                    {selectedItem.impedimentTrackingNumber}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[12px] font-semibold text-brand-nepal">Resolution Owner</dt>
                <dd className="mt-0.5 text-brand-blumine">
                  {emailToDisplayName(selectedItem.resolutionOwner)}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold text-brand-nepal">Committed Date</dt>
                <dd className="mt-0.5 text-brand-blumine">
                  {formatDate(selectedItem.resolutionCommittedDate)}
                </dd>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <dt className="mb-2 text-[12px] font-semibold text-brand-nepal">
                Resolution Status
              </dt>
              <dd className="whitespace-pre-wrap text-[13px] leading-relaxed text-brand-blumine">
                {selectedItem.resolutionStatusDescription ?? "-"}
              </dd>
            </div>
          </div>
        </Modal>
      )}

      {detailImpediment && (
        <ImpedimentDetailModal
          impediment={detailImpediment}
          columnIds={columnIds}
          isOpen={true}
          onClose={() => setDetailImpediment(null)}
        />
      )}
    </Card>
  );
}
