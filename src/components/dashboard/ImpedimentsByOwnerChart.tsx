"use client";

import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "@/components/ui/Card";
import { OwnerDataPoint } from "@/types/chart";
import { CHART_COLORS } from "@/lib/constants";

interface ImpedimentsByOwnerChartProps {
  data: OwnerDataPoint[];
}

export default function ImpedimentsByOwnerChart({
  data,
}: ImpedimentsByOwnerChartProps) {
  const router = useRouter();

  const handleClick = (entry: OwnerDataPoint) => {
    router.push(
      `/drilldown?field=resolutionOwner&value=${encodeURIComponent(entry.email)}`
    );
  };

  const chartHeight = Math.max(220, data.length * 52);

  return (
    <Card>
      <h3 className="mb-6 text-[15px] font-semibold tracking-tight text-brand-blumine">
        Impediments by Resolution Owner
      </h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#d6dee6"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#8CA3B2" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 13, fill: "#336179", fontWeight: 500 }}
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
          />
          <Bar
            dataKey="value"
            name="Impediments"
            cursor="pointer"
            radius={[0, 8, 8, 0]}
            barSize={28}
            onClick={(_, index) => handleClick(data[index])}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                className="transition-opacity hover:opacity-75"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
