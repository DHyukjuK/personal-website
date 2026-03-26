import type { RunSummary, StravaDashboard } from "@/lib/types";

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

type StravaActivity = {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  start_date_local: string;
};

async function getAccessToken() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { access_token?: string };
  return payload.access_token ?? null;
}

function toRunSummary(activity: StravaActivity): RunSummary {
  const distanceKm = activity.distance / 1000;
  return {
    id: String(activity.id),
    name: activity.name,
    date: activity.start_date_local,
    distanceKm,
    movingTimeSeconds: activity.moving_time,
    pacePerKmSeconds: activity.moving_time / Math.max(distanceKm, 1)
  };
}

function summarizeRuns(runs: RunSummary[]): StravaDashboard {
  if (runs.length === 0) {
    return {
      totalDistanceKm: 0,
      averagePacePerKmSeconds: 0,
      runCount: 0,
      recentRuns: []
    };
  }

  const totalDistanceKm = runs.reduce((acc, run) => acc + run.distanceKm, 0);
  const totalMoving = runs.reduce((acc, run) => acc + run.movingTimeSeconds, 0);

  return {
    totalDistanceKm,
    averagePacePerKmSeconds: totalMoving / Math.max(totalDistanceKm, 1),
    runCount: runs.length,
    recentRuns: runs
  };
}

export async function getStravaDashboard(): Promise<StravaDashboard | null> {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${STRAVA_ACTIVITIES_URL}?per_page=12`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    return null;
  }

  const activities = (await response.json()) as StravaActivity[];
  const runs = activities.filter((a) => a.type === "Run").map(toRunSummary);
  return summarizeRuns(runs);
}
