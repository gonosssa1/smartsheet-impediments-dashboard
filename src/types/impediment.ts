export interface Impediment {
  id: number;
  impedimentStatus: string | null;
  impedimentPriorityRank: number | null;
  impedimentTrackingNumber: string | null;
  impedimentTitle: string | null;
  description: string | null;
  severity: string | null;
  reporter: string | null;
  reportedDate: string | null;
  resolutionOwner: string | null;
  resolutionCommittedDate: string | null;
  resolutionActualDate: string | null;
  escalationStatus: string | null;
  escalatedTo: string | null;
  escalationDate: string | null;
  resolutionStatusDescription: string | null;
}
