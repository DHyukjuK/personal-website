import { format } from "date-fns";
import { formatPacePerMile } from "@/lib/utils";
import type { RunSummary } from "@/lib/types";

export function RecentRuns({ runs }: { runs: RunSummary[] }) {
  if (runs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 p-8 text-sm text-muted-foreground">
        No run activities in this batch yet. Outdoor, virtual, and trail runs from
        Strava will show here when available.
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Recent runs
      </p>
      <p className="mt-1 max-w-prose text-sm text-muted-foreground">
        The latest handful from Strava, with titles and pacing the way I logged
        them.
      </p>
      <div className="mt-5 divide-y divide-border/80 rounded-xl border border-border/80">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:px-5"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug text-foreground">{run.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {format(new Date(run.date), "EEEE, MMM d, yyyy")}
              </p>
            </div>
            <div className="flex shrink-0 gap-6 text-sm tabular-nums text-muted-foreground sm:text-right">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80">
                  Distance
                </p>
                <p className="mt-0.5 text-foreground/90">
                  {run.distanceMiles.toFixed(2)} mi
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80">
                  Pace
                </p>
                <p className="mt-0.5 text-foreground/90">
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
