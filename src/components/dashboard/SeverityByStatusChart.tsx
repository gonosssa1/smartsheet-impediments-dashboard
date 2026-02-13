"use client";

import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "@/components/ui/Card";
import { SeverityStatusDataPoint } from "@/types/chart";
import { STATUS_COLORS } from "@/lib/constants";

interface SeverityByStatusChartProps {
  data: SeverityStatusDataPoint[];
}

export default function SeverityByStatusChart({
  data,
}: SeverityByStatusChartProps) {
  const router = useRouter();

  const handleBarClick = (severity: string, status: "Open" | "Closed") => {
    router.push(
      `/drilldown?field=severity&value=${encodeURIComponent(severity)}&status=${status}`
    );
  };

  return (
    <Card>
      <h3 className="mb-6 text-[15px] font-semibold tracking-tight text-brand-blumine">
        Severity & Status
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="25%" barGap={6}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#d6dee6"
          />
          <XAxis
            dataKey="severity"
            tick={{ fontSize: 13, fill: "#336179", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
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
          />
          <Legend
            wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
          />
          <Bar
            dataKey="Open"
            fill={STATUS_COLORS.Open}
            cursor="pointer"
            radius={[6, 6, 0, 0]}
            onClick={(_, index) => handleBarClick(data[index].severity, "Open")}
          >
            {data.map((_, index) => (
              <Cell
                key={`open-${index}`}
                className="transition-opacity hover:opacity-75"
                cursor="pointer"
              />
            ))}
          </Bar>
          <Bar
            dataKey="Closed"
            fill={STATUS_COLORS.Closed}
            cursor="pointer"
            radius={[6, 6, 0, 0]}
            onClick={(_, index) =>
              handleBarClick(data[index].severity, "Closed")
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`closed-${index}`}
                className="transition-opacity hover:opacity-75"
                cursor="pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
