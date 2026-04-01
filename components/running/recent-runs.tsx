import { format } from "date-fns";
import { formatPacePerMile } from "@/lib/utils";
import type { RunSummary } from "@/lib/types";

export function RecentRuns({ runs }: { runs: RunSummary[] }) {
  if (runs.length === 0) {
    return (
      <p className="text-[0.8125rem] italic text-muted-foreground/50">
        no run activities in this batch yet.
      </p>
    );
  }

  return (
    <div>
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
        recent runs
      </p>
      <p className="mt-1 max-w-prose text-[0.8125rem] text-muted-foreground/70">
        the latest from strava, with titles and pacing as i logged them.
      </p>
      <div className="mt-5 divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-medium leading-snug text-foreground/85">
                {run.name.toLowerCase()}
              </p>
              <p className="mt-1 text-[0.6875rem] text-muted-foreground/55">
                {format(
                  new Date(run.date),
                  "EEEE, MMM d, yyyy"
                ).toLowerCase()}
              </p>
            </div>
            <div className="flex shrink-0 gap-6 text-[0.8125rem] tabular-nums text-muted-foreground/70 sm:text-right">
              <div>
                <p className="text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground/45">
                  distance
                </p>
                <p className="mt-0.5 text-foreground/80">
                  {run.distanceMiles.toFixed(2)} mi
                </p>
              </div>
              <div>
                <p className="text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground/45">
                  pace
                </p>
                <p className="mt-0.5 text-foreground/80">
                  {formatPacePerMile(run.pacePerMileSeconds)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
