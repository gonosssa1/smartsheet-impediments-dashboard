import { SmartsheetSheet } from "@/types/smartsheet";

require('dotenv').config();

const SMARTSHEET_API_BASE = "https://api.smartsheet.com/2.0";

export const SHEET_PERMALINK = "2PRj8fWHQ2W3qvMJ9wVc9wCGmcp8qP3527GPmHh1";

export function getSmartsheetRowUrl(rowId: number): string {
  return `https://app.smartsheet.com/sheets/${SHEET_PERMALINK}?rowId=${rowId}`;
}

export function getSmartsheetCellUrl(rowId: number, columnId: number): string {
  return `https://app.smartsheet.com/sheets/${SHEET_PERMALINK}?rowId=${rowId}&columnId=${columnId}`;
}

export async function fetchSheet(): Promise<SmartsheetSheet> {
  const token = process.env.SMARTSHEET_API_TOKEN;
  const sheetId = process.env.SMARTSHEET_SHEET_ID;

  if (!token || !sheetId) {
    throw new Error(
      "Missing SMARTSHEET_API_TOKEN or SMARTSHEET_SHEET_ID environment variables"
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const assumeUser = process.env.SMARTSHEET_ASSUME_USER;
  if (assumeUser) {
    headers["Assume-User"] = encodeURIComponent(assumeUser);
  }

  const response = await fetch(`${SMARTSHEET_API_BASE}/sheets/${sheetId}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Smartsheet API error ${response.status}: ${errorBody}
      token is ${token}
      sheetId is ${sheetId}`
    );
  }

  return response.json();
}
