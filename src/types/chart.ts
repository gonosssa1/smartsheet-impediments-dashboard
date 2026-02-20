export interface DonutDataPoint {
  name: string;
  value: number;
  email: string;
}

export interface SeverityStatusDataPoint {
  severity: string;
  Open: number;
  Closed: number;
}

export interface OwnerDataPoint {
  name: string;
  value: number;
  email: string;
}

export interface TimeSeriesDataPoint {
  date: string;      // "Jan 15" display label
  isoDate: string;   // "2026-01-15" for sorting
  open: number;      // count of open impediments on this date
  closed: number;    // count of closed impediments on this date
  escalated: number; // count of escalated open impediments on this date
}
