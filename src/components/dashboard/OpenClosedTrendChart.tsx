"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { TimeSeriesDataPoint } from "@/types/chart";
import { STATUS_COLORS } from "@/lib/constants";

interface OpenClosedTrendChartProps {
  data: TimeSeriesDataPoint[];
}

function TrendChartContent({ data, height }: { data: TimeSeriesDataPoint[]; height: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#d6dee6"
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13, fill: "#336179", fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          interval={Math.max(0, Math.floor(data.length / 6) - 1)}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#8CA3B2" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 20px rgba(0,51,153,0.1)",
            fontSize: "13px",
          }}
          labelFormatter={(label) => label}
        />
        <Legend
          wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
        />
        <Area
          type="monotone"
          dataKey="open"
          name="Open"
          stroke={STATUS_COLORS.Open}
          fill={STATUS_COLORS.Open}
          fillOpacity={0.15}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="closed"
          name="Closed"
          stroke={STATUS_COLORS.Closed}
          fill={STATUS_COLORS.Closed}
          fillOpacity={0.15}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="escalated"
          name="Escalated (Open)"
          stroke={STATUS_COLORS.Escalated}
          fill={STATUS_COLORS.Escalated}
          fillOpacity={0.1}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function OpenClosedTrendChart({
  data,
}: OpenClosedTrendChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold tracking-tight text-brand-blumine">
            Open vs Closed Trend
          </h3>
          <button
            onClick={() => setIsFullscreen(true)}
            aria-label="Expand chart to fullscreen"
            title="Expand chart"
            className="rounded-lg p-1.5 text-brand-nepal transition-colors hover:bg-slate-100 hover:text-brand-blumine"
          >
            <svg
              aria-hidden="true"
              className="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </button>
        </div>
        <TrendChartContent data={data} height={280} />
      </Card>

      {isFullscreen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFullscreen(false)}
          title="Open vs Closed Trend"
          size="fullscreen"
        >
          <TrendChartContent data={data} height={500} />
        </Modal>
      )}
    </>
  );
}
