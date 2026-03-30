import { NextResponse } from "next/server";
import { getStravaDashboardState } from "@/lib/strava";

export async function GET() {
  const state = await getStravaDashboardState();

  if (!state.ok) {
    return NextResponse.json(
      {
        error: "Strava data unavailable.",
        issue: state.issue,
        ...(state.missingEnvKeys?.length
          ? { missingEnvKeys: state.missingEnvKeys }
          : {}),
        ...(state.stravaStatus != null ? { stravaStatus: state.stravaStatus } : {})
      },
      { status: 503 }
    );
  }

  return NextResponse.json(state.dashboard);
}
