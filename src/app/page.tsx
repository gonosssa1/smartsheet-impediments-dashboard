"use client";

import { useState, useEffect, useCallback } from "react";
import { Impediment } from "@/types/impediment";
import {
  aggregateEscalatedByPerson,
  aggregateBySeverityAndStatus,
  aggregateByResolutionOwner,
  aggregateUpcomingDeadlines,
  aggregateOpenClosedTimeSeries,
} from "@/lib/aggregators";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import EscalatedByPersonChart from "@/components/dashboard/EscalatedByPersonChart";
import SeverityByStatusChart from "@/components/dashboard/SeverityByStatusChart";
import ImpedimentsByOwnerChart from "@/components/dashboard/ImpedimentsByOwnerChart";
import OpenClosedTrendChart from "@/components/dashboard/OpenClosedTrendChart";
import EscalationSlaTable from "@/components/dashboard/EscalationSlaTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [impediments, setImpediments] = useState<Impediment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading && impediments.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <LoadingSpinner />
      </main>
    );
  }

  if (error && impediments.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader
            lastUpdated={lastUpdated}
            onRefresh={fetchData}
            isLoading={isLoading}
          />
          <div
            className="mt-8 rounded-[var(--card-radius)] bg-white p-8 text-center"
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
        </div>
      </main>
    );
  }

  const deadlineItems = aggregateUpcomingDeadlines(impediments);
  const escalatedData = aggregateEscalatedByPerson(impediments);
  const severityData = aggregateBySeverityAndStatus(impediments);
  const ownerData = aggregateByResolutionOwner(impediments);
  const trendData = aggregateOpenClosedTimeSeries(impediments);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <DashboardHeader
          lastUpdated={lastUpdated}
          onRefresh={fetchData}
          isLoading={isLoading}
        />

        <UpcomingDeadlines items={deadlineItems} />

        <SummaryCards impediments={impediments} />

        <OpenClosedTrendChart data={trendData} />

        <div className="grid gap-7 lg:grid-cols-2">
          <EscalatedByPersonChart data={escalatedData} />
          <SeverityByStatusChart data={severityData} />
        </div>

        <ImpedimentsByOwnerChart data={ownerData} />

        <EscalationSlaTable />
      </div>
    </main>
  );
}
