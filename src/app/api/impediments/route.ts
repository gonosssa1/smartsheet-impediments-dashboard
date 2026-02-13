import { NextResponse } from "next/server";
import { fetchSheet } from "@/lib/smartsheet";
import { transformSheet } from "@/lib/transformers";

export async function GET() {
  try {
    const sheet = await fetchSheet();
    const impediments = transformSheet(sheet);
    return NextResponse.json(impediments);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error fetching impediments";
    console.error("GET /api/impediments error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
