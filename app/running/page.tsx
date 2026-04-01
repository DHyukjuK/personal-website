import Link from "next/link";
import { Container } from "@/components/ui/container";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { DriftingParticles } from "@/components/home/drifting-particles";
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
    "Strava isn't configured yet. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN in .env.local, then restart the dev server.",
  token_refresh_failed:
    "Strava rejected the refresh token. Regenerate one with the OAuth flow and update your env vars.",
  activities_unauthorized:
    "Strava returned 401/403. Re-authorize the app with the activity:read scope.",
  activities_error:
    "Strava's activities API returned an error. Try again later or check your API limits."
};

export default async function RunningPage() {
  const state = await getStravaDashboardState();

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="running-atmosphere absolute inset-0" />
        <DriftingParticles />
      </div>

      <Container className="relative z-[2] max-w-2xl py-16 lowercase md:py-24">
        <RevealOnView>
          <header className="space-y-5">
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              running
            </h1>
            <p className="max-w-lg text-[0.9375rem] leading-[1.75] text-muted-foreground">
              i&apos;ve been running more seriously lately — training for
              the brooklyn half marathon this april. mostly though i just
              like getting out and clearing my head.{" "}
              <Link
                href={STRAVA_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-foreground/18 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
              >
                see more on strava
              </Link>
              .
            </p>
          </header>
        </RevealOnView>

        {state.ok ? (
          <div className="mt-16 space-y-16 md:mt-20 md:space-y-20">
            <RevealOnView delayMs={60}>
              <SummaryCards stats={state.dashboard} />
            </RevealOnView>

            <RevealOnView delayMs={80}>
              <WeeklyMileage bins={state.dashboard.weeklyMileage} />
            </RevealOnView>

            {state.dashboard.highlights ? (
              <RevealOnView delayMs={100}>
                <RunHighlights highlights={state.dashboard.highlights} />
              </RevealOnView>
            ) : null}

            <RevealOnView delayMs={120}>
              <RecentRuns runs={state.dashboard.recentRuns} />
            </RevealOnView>
          </div>
        ) : (
          <div className="mt-16 space-y-3 border-l-2 border-dashed border-border pl-5 text-[0.8125rem] text-muted-foreground md:mt-20">
            <p>{issueHint[state.issue]}</p>
            {state.issue === "missing_env" && state.missingEnvKeys?.length ? (
              <p className="text-[0.75rem] text-muted-foreground/70">
                Unset or empty: {state.missingEnvKeys.join(", ")}.
              </p>
            ) : null}
            {state.stravaStatus != null ? (
              <p className="text-[0.75rem] text-muted-foreground/70">
                Strava HTTP status: {state.stravaStatus}
              </p>
            ) : null}
          </div>
        )}

        <RevealOnView delayMs={80}>
          <p className="mt-20 text-center text-[0.8125rem] italic text-muted-foreground/40 md:mt-28">
            just keep going.
          </p>
        </RevealOnView>
      </Container>
    </>
  );
}
