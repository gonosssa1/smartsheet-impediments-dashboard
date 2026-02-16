"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Impediment } from "@/types/impediment";
import DrilldownFilters from "@/components/drilldown/DrilldownFilters";
import DrilldownTable from "@/components/drilldown/DrilldownTable";
import ImpedimentDetailModal from "@/components/drilldown/ImpedimentDetailModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function DrilldownContent() {
  const searchParams = useSearchParams();
  const field = searchParams.get("field");
  const value = searchParams.get("value");
  const status = searchParams.get("status");

  const [impediments, setImpediments] = useState<Impediment[]>([]);
  const [columnIds, setColumnIds] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImpediment, setSelectedImpediment] = useState<Impediment | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/impediments");
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response (${res.status}). Try restarting the dev server.`);
      }
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setImpediments(data.impediments);
      setColumnIds(data.columnIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters
  const filtered = impediments.filter((imp) => {
    if (field && value) {
      const fieldMap: Record<string, keyof Impediment> = {
        escalatedTo: "escalatedTo",
        severity: "severity",
        resolutionOwner: "resolutionOwner",
        escalationStatus: "escalationStatus",
        impedimentTrackingNumber: "impedimentTrackingNumber",
      };
      const key = fieldMap[field];
      if (key && imp[key] !== value) return false;
    }
    if (status && imp.impedimentStatus !== status) return false;
    return true;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        className="rounded-[var(--card-radius)] bg-white p-8 text-center"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        <p className="text-[15px] font-medium text-brand-persimmon">
          Unable to load data
        </p>
        <p className="mt-1 text-sm text-brand-nepal">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 rounded-xl bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <DrilldownFilters field={field} value={value} status={status} />

      <p className="text-[13px] font-medium text-brand-nepal">
        Showing{" "}
        <span className="font-semibold text-brand-blumine">{filtered.length}</span>{" "}
        of {impediments.length} impediments
        <span className="ml-2 text-brand-nepal/60">— click a row to view details</span>
      </p>

      <DrilldownTable
        impediments={filtered}
        onRowClick={setSelectedImpediment}
      />

      {selectedImpediment && (
        <ImpedimentDetailModal
          impediment={selectedImpediment}
          columnIds={columnIds}
          isOpen={!!selectedImpediment}
          onClose={() => setSelectedImpediment(null)}
        />
      )}
    </>
  );
}

export default function DrilldownPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-blumine transition-all hover:text-brand-blue"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        <h1 className="text-[1.75rem] font-bold tracking-tight text-brand-blue">
          Impediment Details
        </h1>

        <Suspense fallback={<LoadingSpinner />}>
          <DrilldownContent />
        </Suspense>
      </div>
    </main>
  );
}
