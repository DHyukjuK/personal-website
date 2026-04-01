import type { WeeklyMileageBin } from "@/lib/types";

export function WeeklyMileage({ bins }: { bins: WeeklyMileageBin[] }) {
  const maxMiles = Math.max(...bins.map((b) => b.miles), 0.001);

  return (
    <div>
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
        recent weeks
      </p>
      <p className="mt-1 max-w-md text-[0.8125rem] leading-relaxed text-muted-foreground/70">
        mileage by calendar week from the latest strava snapshot.
      </p>
      <div className="mt-8 flex gap-2 sm:gap-3">
        {bins.map((bin) => {
          const fill =
            bin.miles <= 0
              ? 5
              : Math.max(12, (bin.miles / maxMiles) * 100);
          return (
            <div
              key={bin.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-[7.5rem] w-full flex-col justify-end">
                <div
                  className={
                    bin.miles <= 0
                      ? "w-full rounded-t-sm bg-muted/50"
                      : "w-full rounded-t-sm bg-foreground/12 dark:bg-foreground/18"
                  }
                  style={{ height: `${fill}%` }}
                  title={
                    bin.miles < 0.01 ? "No runs" : `${bin.miles.toFixed(1)} mi`
                  }
                />
              </div>
              <span className="whitespace-nowrap text-center text-[0.625rem] tabular-nums text-muted-foreground/60">
                {bin.label}
              </span>
              <span className="text-[0.6875rem] tabular-nums text-muted-foreground/80">
                {bin.miles < 0.05 ? "—" : `${bin.miles.toFixed(1)}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
