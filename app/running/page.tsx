import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { RecentRuns } from "@/components/running/recent-runs";
import { RunHighlights } from "@/components/running/run-highlights";
import { SummaryCards } from "@/components/running/summary-cards";
import { WeeklyMileage } from "@/components/running/weekly-mileage";
import {
  getStravaDashboardState,
  type StravaLoadIssue
} from "@/lib/strava";

export const metadata = {
  title: "Running"
};

const STRAVA_PROFILE = "https://www.strava.com/athletes/104430354";

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
    <Container className="space-y-16 py-12 md:space-y-20 md:py-16">
      <Section
        title="Running"
        description="A quiet snapshot of how I’ve been running lately, more about rhythm and consistency than mirroring my whole Strava feed."
      >
        {state.ok ? (
          <div className="space-y-14 md:space-y-16">
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              <Link
                href={STRAVA_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-foreground/15 underline-offset-[5px] transition-colors hover:decoration-foreground/35"
              >
                See more on Strava
              </Link>
              <span className="text-muted-foreground">
                {" "}
                for routes, full history, and the rest of what doesn’t belong on
                this page.
              </span>
            </p>

            <SummaryCards stats={state.dashboard} />

            <WeeklyMileage bins={state.dashboard.weeklyMileage} />

            {state.dashboard.highlights ? (
              <RunHighlights highlights={state.dashboard.highlights} />
            ) : null}

            <RecentRuns runs={state.dashboard.recentRuns} />
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
