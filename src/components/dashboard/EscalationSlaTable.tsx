"use client";

import Card from "@/components/ui/Card";

const SLA_DATA = [
  {
    level: "L1 – Low",
    targetResolution: "Same day",
    maxTolerable: "24 hours → escalate to L2 (Engagement Lead)",
  },
  {
    level: "L2 – Medium",
    targetResolution: "Next business day",
    maxTolerable: "48 hours → escalate to L3 (Engagement Sponsor)",
  },
  {
    level: "L3 – High",
    targetResolution: "3 business days",
    maxTolerable: "72 hours → escalate to L4 (Exec Sponsor)",
  },
  {
    level: "L4 – Critical",
    targetResolution: "5 business days",
    maxTolerable: "96 hours (with daily updates)",
  },
] as const;

export default function EscalationSlaTable() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="px-8 pb-2 pt-7">
        <h3 className="text-center text-[15px] font-bold tracking-tight text-brand-blue">
          Escalation Thresholds & Resolution SLAs Report
        </h3>
      </div>
      <div className="overflow-x-auto px-3 pb-5">
        <table className="min-w-full text-[13px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="whitespace-nowrap px-5 py-3 text-left font-bold text-foreground">
                Primary
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-foreground">
                Target Resolution Time
              </th>
              <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-foreground">
                Max Tolerable (Auto-Escalate)
              </th>
            </tr>
          </thead>
          <tbody>
            {SLA_DATA.map((row) => (
              <tr
                key={row.level}
                className="border-b border-slate-50 last:border-none"
              >
                <td className="whitespace-nowrap px-5 py-3 pl-10 text-foreground">
                  {row.level}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-brand-blumine">
                  {row.targetResolution}
                </td>
                <td className="px-5 py-3 text-brand-blumine">
                  {row.maxTolerable}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
