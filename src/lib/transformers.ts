import { Impediment } from "@/types/impediment";
import { SmartsheetSheet, SmartsheetRow, SmartsheetColumn } from "@/types/smartsheet";

// Map column title to Impediment field key
const COLUMN_MAP: Record<string, keyof Impediment> = {
  "Impediment Status": "impedimentStatus",
  "Impediment Priority Rank": "impedimentPriorityRank",
  "Impediment Tracking Number": "impedimentTrackingNumber",
  "Impediment Title": "impedimentTitle",
  "Description": "description",
  "Severity": "severity",
  "Reporter": "reporter",
  "Reported Date": "reportedDate",
  "Resolution Owner": "resolutionOwner",
  "Resolution Committed Date": "resolutionCommittedDate",
  "Resolution Actual Date": "resolutionActualDate",
  "Escalation Status": "escalationStatus",
  "Escalated To": "escalatedTo",
  "Escalation Date": "escalationDate",
  "Resolution Status Description": "resolutionStatusDescription",
};

function buildColumnIdToFieldMap(
  columns: SmartsheetColumn[]
): Map<number, keyof Impediment> {
  const map = new Map<number, keyof Impediment>();
  for (const col of columns) {
    const field = COLUMN_MAP[col.title];
    if (field) {
      map.set(col.id, field);
    }
  }
  return map;
}

function transformRow(
  row: SmartsheetRow,
  columnMap: Map<number, keyof Impediment>
): Impediment {
  const impediment: Impediment = {
    id: row.id,
    impedimentStatus: null,
    impedimentPriorityRank: null,
    impedimentTrackingNumber: null,
    impedimentTitle: null,
    description: null,
    severity: null,
    reporter: null,
    reportedDate: null,
    resolutionOwner: null,
    resolutionCommittedDate: null,
    resolutionActualDate: null,
    escalationStatus: null,
    escalatedTo: null,
    escalationDate: null,
    resolutionStatusDescription: null,
  };

  for (const cell of row.cells) {
    const field = columnMap.get(cell.columnId);
    if (field && cell.value != null) {
      // displayValue is preferred for formatted strings; fall back to value
      const val = cell.displayValue ?? cell.value;
      if (field === "impedimentPriorityRank") {
        impediment[field] = typeof val === "number" ? val : Number(val) || null;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (impediment as any)[field] = String(val);
      }
    }
  }

  return impediment;
}

export function transformSheet(sheet: SmartsheetSheet): Impediment[] {
  const columnMap = buildColumnIdToFieldMap(sheet.columns);
  return sheet.rows
    .map((row) => transformRow(row, columnMap))
    .filter((imp) => imp.impedimentTitle != null || imp.impedimentStatus != null);
}

/** Returns a map of fieldName -> Smartsheet columnId */
export function buildFieldToColumnIdMap(
  columns: SmartsheetColumn[]
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const col of columns) {
    const field = COLUMN_MAP[col.title];
    if (field) {
      map[field] = col.id;
    }
  }
  return map;
}
