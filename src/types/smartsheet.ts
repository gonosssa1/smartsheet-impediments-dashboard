export interface SmartsheetCell {
  columnId: number;
  value?: string | number | boolean | null;
  displayValue?: string | null;
}

export interface SmartsheetRow {
  id: number;
  rowNumber: number;
  cells: SmartsheetCell[];
}

export interface SmartsheetColumn {
  id: number;
  title: string;
  type: string;
  index: number;
}

export interface SmartsheetSheet {
  id: number;
  name: string;
  columns: SmartsheetColumn[];
  rows: SmartsheetRow[];
  totalRowCount: number;
}
