import { SmartsheetSheet } from "@/types/smartsheet";

const SMARTSHEET_API_BASE = "https://api.smartsheet.com/2.0";

export async function fetchSheet(): Promise<SmartsheetSheet> {
  const token = process.env.SMARTSHEET_API_TOKEN;
  const sheetId = process.env.SMARTSHEET_SHEET_ID;

  if (!token || !sheetId) {
    throw new Error(
      "Missing SMARTSHEET_API_TOKEN or SMARTSHEET_SHEET_ID environment variables"
    );
  }

  const response = await fetch(`${SMARTSHEET_API_BASE}/sheets/${sheetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Smartsheet API error ${response.status}: ${errorBody}`
    );
  }

  return response.json();
}
