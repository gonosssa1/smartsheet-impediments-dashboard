"use client";

import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import { DonutDataPoint } from "@/types/chart";
import { CHART_COLORS } from "@/lib/constants";

interface EscalatedByPersonChartProps {
  data: DonutDataPoint[];
}

export default function EscalatedByPersonChart({
  data,
}: EscalatedByPersonChartProps) {
  const router = useRouter();
  const totalEscalated = data.reduce((sum, d) => sum + d.value, 0);

  const handleClick = (entry: DonutDataPoint) => {
    router.push(
      `/drilldown?field=escalatedTo&value=${encodeURIComponent(entry.email)}`
    );
  };

  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-[15px] font-semibold tracking-tight text-brand-blumine">
          Escalated by Person
        </h3>
        <div className="flex h-72 items-center justify-center text-sm text-brand-nepal">
          No escalated impediments
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-2 text-[15px] font-semibold tracking-tight text-brand-blumine">
        Escalated by Person
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                cursor="pointer"
                stroke="none"
                onClick={(_, index) => handleClick(data[index])}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    className="transition-opacity hover:opacity-75"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,51,153,0.1)",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center metric */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-brand-blue">
              {totalEscalated}
            </span>
            <span className="text-[11px] font-medium text-brand-nepal">
              Escalated
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {data.map((entry, index) => (
            <button
              key={entry.email}
              onClick={() => handleClick(entry)}
              className="group flex items-center gap-3 text-left transition-opacity hover:opacity-70"
            >
              <span
                className="h-3 w-3 flex-shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <span className="text-sm font-medium text-brand-blumine group-hover:text-brand-blue">
                {entry.name}
              </span>
              <span className="ml-auto font-mono text-sm font-semibold text-brand-blue">
                {entry.value}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
