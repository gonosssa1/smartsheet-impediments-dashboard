"use client";

import Image from "next/image";
import Link from "next/link";

interface DashboardHeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function DashboardHeader({
  lastUpdated,
  onRefresh,
  isLoading,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-5">
        <Image
          src="/protective-logo.png"
          alt="Protective Life"
          width={56}
          height={56}
          className="h-14 w-auto"
          priority
        />
        <div>
          <h1 className="text-[1.6rem] tracking-tight text-brand-blue">
            <span className="font-bold">Protective Life - AI Acceleration Impediments</span>{" "}
            <span className="font-normal">Dashboard</span>
          </h1>
          {lastUpdated && (
            <p className="mt-0.5 text-[13px] font-medium text-brand-nepal">
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/pipeline-explorer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blumine px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90"
          style={{ boxShadow: "0 2px 8px rgba(51, 97, 121, 0.3)" }}
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
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          Pipeline Explorer
        </Link>
        <Link
          href="/pipeline-final"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-eastern px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90"
          style={{ boxShadow: "0 2px 8px rgba(0, 136, 161, 0.3)" }}
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
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
          Pipeline Map
        </Link>
        <a
          href="https://app.smartsheet.com/sheets/2PRj8fWHQ2W3qvMJ9wVc9wCGmcp8qP3527GPmHh1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-brand-persimmon px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90"
          style={{ boxShadow: "0 2px 8px rgba(222, 71, 2, 0.3)" }}
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
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          Open Smartsheet
        </a>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2.5 rounded-xl bg-brand-blue px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ boxShadow: "0 2px 8px rgba(0, 51, 153, 0.25)" }}
        >
        <svg
          className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </button>
      </div>
    </div>
  );
}
