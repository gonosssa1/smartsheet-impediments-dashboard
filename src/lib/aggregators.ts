import { Impediment, DeadlineItem } from "@/types/impediment";
import { DonutDataPoint, SeverityStatusDataPoint, OwnerDataPoint, TimeSeriesDataPoint } from "@/types/chart";
import { emailToDisplayName } from "@/lib/formatters";
import { SEVERITY_ORDER } from "@/lib/constants";

export function aggregateUpcomingDeadlines(
  impediments: Impediment[],
  windowDays: number = 7
): DeadlineItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return impediments
    .filter(
      (imp) =>
        imp.impedimentStatus === "Open" &&
        imp.resolutionCommittedDate != null &&
        imp.resolutionActualDate == null
    )
    .map((imp) => {
      const committed = new Date(imp.resolutionCommittedDate!);
      committed.setHours(0, 0, 0, 0);
      const diffMs = committed.getTime() - today.getTime();
      const daysUntilDue = Math.round(diffMs / (1000 * 60 * 60 * 24));

      return {
        id: imp.id,
        impedimentTrackingNumber: imp.impedimentTrackingNumber,
        impedimentTitle: imp.impedimentTitle,
        resolutionCommittedDate: imp.resolutionCommittedDate!,
        resolutionOwner: imp.resolutionOwner,
        resolutionStatusDescription: imp.resolutionStatusDescription,
        severity: imp.severity,
        daysUntilDue,
        isOverdue: daysUntilDue < 0,
      };
    })
    .filter((item) => item.daysUntilDue <= windowDays)
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

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

export function aggregateOpenClosedTimeSeries(
  impediments: Impediment[],
  days: number = 30
): TimeSeriesDataPoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return dates.map((date) => {
    const dateEnd = date.getTime();

    let open = 0;
    let closed = 0;

    for (const imp of impediments) {
      if (!imp.reportedDate) continue;

      const reported = new Date(imp.reportedDate);
      reported.setHours(0, 0, 0, 0);

      if (reported.getTime() > dateEnd) continue;

      if (
        imp.resolutionActualDate == null ||
        new Date(imp.resolutionActualDate).setHours(0, 0, 0, 0) > dateEnd
      ) {
        open++;
      } else {
        closed++;
      }
    }

    const iso = date.toISOString().slice(0, 10);
    const label = `${monthNames[date.getMonth()]} ${date.getDate()}`;

    return { date: label, isoDate: iso, open, closed };
  });
}
