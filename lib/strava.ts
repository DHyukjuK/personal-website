import type {
  RunHighlights,
  RunSummary,
  StravaDashboard,
  WeeklyMileageBin
} from "@/lib/types";
import {
  endOfWeek,
  format,
  parseISO,
  startOfWeek,
  subWeeks
} from "date-fns";

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

const STRAVA_ENV_KEYS = [
  "STRAVA_CLIENT_ID",
  "STRAVA_CLIENT_SECRET",
  "STRAVA_REFRESH_TOKEN"
] as const;

/** Strava returns distance in meters; convert to statute miles. */
const METERS_TO_MI = 0.000621371192;

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
  const distanceMiles = activity.distance * METERS_TO_MI;
  return {
    id: String(activity.id),
    name: activity.name,
    date: activity.start_date_local,
    distanceMiles,
    movingTimeSeconds: activity.moving_time,
    pacePerMileSeconds:
      activity.moving_time / Math.max(distanceMiles, 0.01)
  };
}

function buildWeeklyMileage(runs: RunSummary[]): WeeklyMileageBin[] {
  const now = new Date();
  const bins: WeeklyMileageBin[] = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const miles = runs
      .filter((r) => {
        const d = parseISO(r.date);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((s, r) => s + r.distanceMiles, 0);
    bins.push({ label: format(weekStart, "MMM d"), miles });
  }
  return bins;
}

function summarizeRuns(runs: RunSummary[]): StravaDashboard {
  if (runs.length === 0) {
    return {
      totalDistanceMiles: 0,
      averagePacePerMileSeconds: 0,
      runCount: 0,
      milesThisMonth: 0,
      avgWeeklyMiles: 0,
      weeklyMileage: buildWeeklyMileage([]),
      highlights: null,
      recentRuns: []
    };
  }

  const sorted = [...runs].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  const totalDistanceMiles = runs.reduce((acc, r) => acc + r.distanceMiles, 0);
  const totalMoving = runs.reduce((acc, r) => acc + r.movingTimeSeconds, 0);
  const averagePacePerMileSeconds =
    totalMoving / Math.max(totalDistanceMiles, 0.01);

  const now = new Date();
  const milesThisMonth = runs.reduce((acc, r) => {
    const d = parseISO(r.date);
    if (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      return acc + r.distanceMiles;
    }
    return acc;
  }, 0);

  const weekStarts = runs.map((r) =>
    startOfWeek(parseISO(r.date), { weekStartsOn: 1 }).getTime()
  );
  const distinctWeeks = new Set(weekStarts).size;
  const avgWeeklyMiles = totalDistanceMiles / Math.max(distinctWeeks, 1);

  const longest = runs.reduce((a, b) =>
    a.distanceMiles >= b.distanceMiles ? a : b
  );
  const fastest = runs.reduce((a, b) =>
    a.pacePerMileSeconds <= b.pacePerMileSeconds ? a : b
  );
  const latest = sorted[0]!;

  const highlights: RunHighlights = { longest, fastest, latest };

  return {
    totalDistanceMiles,
    averagePacePerMileSeconds,
    runCount: runs.length,
    milesThisMonth,
    avgWeeklyMiles,
    weeklyMileage: buildWeeklyMileage(runs),
    highlights,
    recentRuns: sorted.slice(0, 6)
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

  const activitiesRes = await fetch(`${STRAVA_ACTIVITIES_URL}?per_page=80`, {
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
