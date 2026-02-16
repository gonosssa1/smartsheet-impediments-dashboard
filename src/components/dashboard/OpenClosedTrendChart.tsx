"use client";

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
import { TimeSeriesDataPoint } from "@/types/chart";
import { STATUS_COLORS } from "@/lib/constants";

interface OpenClosedTrendChartProps {
  data: TimeSeriesDataPoint[];
}

export default function OpenClosedTrendChart({
  data,
}: OpenClosedTrendChartProps) {
  return (
    <Card>
      <h3 className="mb-6 text-[15px] font-semibold tracking-tight text-brand-blumine">
        Open vs Closed Trend
      </h3>
      <ResponsiveContainer width="100%" height={280}>
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
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
