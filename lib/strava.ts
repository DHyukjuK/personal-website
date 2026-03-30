import type { RunSummary, StravaDashboard } from "@/lib/types";

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

const STRAVA_ENV_KEYS = [
  "STRAVA_CLIENT_ID",
  "STRAVA_CLIENT_SECRET",
  "STRAVA_REFRESH_TOKEN"
] as const;

/** Strava summary activity types we treat as “runs” for this page. */
const RUN_ACTIVITY_TYPES = new Set([
  "Run",
  "VirtualRun",
  "TrailRun"
]);

type StravaActivity = {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  start_date_local: string;
};

export function missingStravaEnvKeys(): string[] {
  return STRAVA_ENV_KEYS.filter((k) => !process.env[k]?.trim());
}

function isRunActivity(type: string): boolean {
  return RUN_ACTIVITY_TYPES.has(type);
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
  const state = await getStravaDashboardState();
  return state.ok ? state.dashboard : null;
}

export type StravaLoadIssue =
  | "missing_env"
  | "token_refresh_failed"
  | "activities_unauthorized"
  | "activities_error";

export type StravaDashboardState =
  | { ok: true; dashboard: StravaDashboard }
  | {
      ok: false;
      issue: StravaLoadIssue;
      missingEnvKeys?: string[];
      /** HTTP status from Strava when relevant (no secrets). */
      stravaStatus?: number;
    };

/**
 * Same data as {@link getStravaDashboard} plus a reason when loading fails
 * (wrong env, bad refresh token, missing scopes, etc.).
 */
export async function getStravaDashboardState(): Promise<StravaDashboardState> {
  const missing = missingStravaEnvKeys();
  if (missing.length > 0) {
    return { ok: false, issue: "missing_env", missingEnvKeys: missing };
  }

  const clientId = process.env.STRAVA_CLIENT_ID?.trim();
  const clientSecret = process.env.STRAVA_CLIENT_SECRET?.trim();
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN?.trim();

  const tokenRes = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: "refresh_token",
      refresh_token: refreshToken!
    }),
    cache: "no-store"
  });

  if (!tokenRes.ok) {
    return {
      ok: false,
      issue: "token_refresh_failed",
      stravaStatus: tokenRes.status
    };
  }

  const tokenPayload = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenPayload.access_token;
  if (!accessToken) {
    return { ok: false, issue: "token_refresh_failed", stravaStatus: tokenRes.status };
  }

  const activitiesRes = await fetch(`${STRAVA_ACTIVITIES_URL}?per_page=30`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store"
  });

  if (activitiesRes.status === 401 || activitiesRes.status === 403) {
    return {
      ok: false,
      issue: "activities_unauthorized",
      stravaStatus: activitiesRes.status
    };
  }

  if (!activitiesRes.ok) {
    return {
      ok: false,
      issue: "activities_error",
      stravaStatus: activitiesRes.status
    };
  }

  const activities = (await activitiesRes.json()) as StravaActivity[];
  const runs = activities.filter((a) => isRunActivity(a.type)).map(toRunSummary);
  return { ok: true, dashboard: summarizeRuns(runs) };
}
