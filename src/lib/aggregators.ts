import { Impediment } from "@/types/impediment";
import { DonutDataPoint, SeverityStatusDataPoint, OwnerDataPoint } from "@/types/chart";
import { emailToDisplayName } from "@/lib/formatters";
import { SEVERITY_ORDER } from "@/lib/constants";

export function aggregateEscalatedByPerson(
  impediments: Impediment[]
): DonutDataPoint[] {
  const escalated = impediments.filter(
    (imp) =>
      imp.escalationStatus === "Escalated" &&
      imp.escalatedTo != null &&
      imp.escalatedTo.trim() !== ""
  );

  const counts = new Map<string, number>();
  for (const imp of escalated) {
    const email = imp.escalatedTo!;
    counts.set(email, (counts.get(email) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([email, count]) => ({
      name: emailToDisplayName(email),
      value: count,
      email,
    }))
    .sort((a, b) => b.value - a.value);
}

export function aggregateBySeverityAndStatus(
  impediments: Impediment[]
): SeverityStatusDataPoint[] {
  const dataMap = new Map<string, { Open: number; Closed: number }>();

  // Initialize with known severity levels in order
  for (const sev of SEVERITY_ORDER) {
    dataMap.set(sev, { Open: 0, Closed: 0 });
  }

  for (const imp of impediments) {
    const severity = imp.severity;
    const status = imp.impedimentStatus;
    if (!severity || !status) continue;

    if (!dataMap.has(severity)) {
      dataMap.set(severity, { Open: 0, Closed: 0 });
    }

    const entry = dataMap.get(severity)!;
    if (status === "Open") entry.Open++;
    else if (status === "Closed") entry.Closed++;
  }

  return Array.from(dataMap.entries()).map(([severity, counts]) => ({
    severity,
    ...counts,
  }));
}

export function aggregateByResolutionOwner(
  impediments: Impediment[]
): OwnerDataPoint[] {
  const counts = new Map<string, number>();

  for (const imp of impediments) {
    const owner = imp.resolutionOwner;
    if (!owner || owner.trim() === "") continue;
    counts.set(owner, (counts.get(owner) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([email, count]) => ({
      name: emailToDisplayName(email),
      value: count,
      email,
    }))
    .sort((a, b) => b.value - a.value);
}
