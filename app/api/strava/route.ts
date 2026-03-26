import { NextResponse } from "next/server";
import { getStravaDashboard } from "@/lib/strava";

export async function GET() {
  const dashboard = await getStravaDashboard();

  if (!dashboard) {
    return NextResponse.json(
      { error: "Strava data unavailable." },
      { status: 503 }
    );
  }

  return NextResponse.json(dashboard);
}
