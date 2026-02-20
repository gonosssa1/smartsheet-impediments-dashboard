// Brand palette for charts
// Primary blue first, then secondary colors, accent last (used sparingly)
export const CHART_COLORS = [
  "#003399", // Blue (Primary)
  "#0A7CC1", // Curious Blue
  "#0088A1", // Eastern Blue
  "#186037", // Strong Green
  "#1D9A19", // Christi Green
  "#336179", // Blumine
  "#8CA3B2", // Nepal
  "#DE4702", // Persimmon (accent)
] as const;

export const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#DE4702", // Persimmon
  High: "#0088A1",     // Eastern Blue
  Medium: "#003399",   // Primary Blue
};

export const STATUS_COLORS: Record<string, string> = {
  Open: "#0A7CC1",      // Curious Blue
  Closed: "#186037",    // Strong Green
  Escalated: "#DE4702", // Persimmon
};

export const SEVERITY_ORDER = ["Critical", "High", "Medium"] as const;

export const DUE_SOON_THRESHOLD_DAYS = 2;

export const COLUMN_TITLES = {
  impedimentStatus: "Impediment Status",
  impedimentPriorityRank: "Impediment Priority Rank",
  impedimentTrackingNumber: "Impediment Tracking Number",
  impedimentTitle: "Impediment Title",
  description: "Description",
  severity: "Severity",
  reporter: "Reporter",
  reportedDate: "Reported Date",
  resolutionOwner: "Resolution Owner",
  resolutionCommittedDate: "Resolution Committed Date",
  resolutionActualDate: "Resolution Actual Date",
  escalationStatus: "Escalation Status",
  escalatedTo: "Escalated To",
  escalationDate: "Escalation Date",
  resolutionStatusDescription: "Resolution Status Description",
} as const;
