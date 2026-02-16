"use client";

import Link from "next/link";
import { Impediment } from "@/types/impediment";
import Card from "@/components/ui/Card";

interface SummaryCardsProps {
  impediments: Impediment[];
}

export default function SummaryCards({ impediments }: SummaryCardsProps) {
  const total = impediments.length;
  const open = impediments.filter((i) => i.impedimentStatus === "Open").length;
  const closed = impediments.filter((i) => i.impedimentStatus === "Closed").length;
  const escalated = impediments.filter(
    (i) => i.escalationStatus === "Escalated"
  ).length;

  const cards = [
    { label: "Total Impediments", value: total, accent: "#003399", href: "/drilldown" },
    { label: "Open", value: open, accent: "#0A7CC1", href: "/drilldown?status=Open" },
    { label: "Closed", value: closed, accent: "#186037", href: "/drilldown?status=Closed" },
    { label: "Escalated", value: escalated, accent: "#DE4702", href: "/drilldown?field=escalationStatus&value=Escalated" },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href}>
          <Card className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1 rounded-l-[var(--card-radius)]"
              style={{ backgroundColor: card.accent }}
            />
            <p className="text-[13px] font-medium tracking-wide text-brand-nepal">
              {card.label}
            </p>
            <p
              className="mt-2 text-4xl font-bold tracking-tight"
              style={{ color: card.accent }}
            >
              {card.value}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
