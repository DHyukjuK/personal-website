import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { StatsCards } from "@/components/running/stats-cards";
import { RunList } from "@/components/running/run-list";
import {
  getStravaDashboardState,
  type StravaLoadIssue
} from "@/lib/strava";

export const metadata = {
  title: "Running"
};

const issueHint: Record<StravaLoadIssue, string> = {
  missing_env:
    "Strava isn’t configured yet. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN in .env.local (project root), then restart the dev server. On Vercel, add the same variables and redeploy.",
  token_refresh_failed:
    "Strava rejected the refresh token (often wrong secret, expired/revoked token, or typo). Regenerate a refresh token with the OAuth flow and update your env vars.",
  activities_unauthorized:
    "Strava returned 401/403 for activities. Re-authorize the app with the activity:read (or activity:read_all) scope so the token can read your activities.",
  activities_error:
    "Strava’s activities API returned an error. Try again later or check Strava’s status; confirm your API limits aren’t exceeded."
};

export default async function RunningPage() {
  const state = await getStravaDashboardState();

  return (
    <Container className="space-y-10 py-12">
      <Section
        title="Running"
        description="Recent Strava activity and lightweight summary statistics."
      >
        {state.ok ? (
          <div className="space-y-6">
            <StatsCards stats={state.dashboard} />
            <RunList runs={state.dashboard.recentRuns} />
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            <p>{issueHint[state.issue]}</p>
            {state.issue === "missing_env" && state.missingEnvKeys?.length ? (
              <p className="text-xs text-muted-foreground/90">
                Unset or empty: {state.missingEnvKeys.join(", ")}.
              </p>
            ) : null}
            {state.stravaStatus != null ? (
              <p className="text-xs text-muted-foreground/90">
                Strava HTTP status: {state.stravaStatus}
              </p>
            ) : null}
          </div>
        )}
      </Section>
    </Container>
  );
}
