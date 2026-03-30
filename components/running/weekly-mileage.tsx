import { Card } from "@/components/ui/card";
import type { WeeklyMileageBin } from "@/lib/types";

export function WeeklyMileage({ bins }: { bins: WeeklyMileageBin[] }) {
  const maxMiles = Math.max(...bins.map((b) => b.miles), 0.001);

  return (
    <Card className="border-border/80 p-5 sm:p-6 hover:border-border">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Recent weeks
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            Mileage by calendar week (Mon–Sun) from the same Strava snapshot.
          </p>
        </div>
      </div>
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
                      ? "w-full rounded-sm bg-muted/70"
                      : "w-full rounded-sm bg-foreground/15 dark:bg-foreground/20"
                  }
                  style={{ height: `${fill}%` }}
                  title={
                    bin.miles < 0.01 ? "No runs" : `${bin.miles.toFixed(1)} mi`
                  }
                />
              </div>
              <span className="whitespace-nowrap text-center text-[10px] tabular-nums text-muted-foreground">
                {bin.label}
              </span>
              <span className="text-[11px] tabular-nums text-muted-foreground/90">
                {bin.miles < 0.05 ? "—" : `${bin.miles.toFixed(1)}`}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
