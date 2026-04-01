import { formatPacePerMile } from "@/lib/utils";
import type { StravaDashboard } from "@/lib/types";

export function SummaryCards({ stats }: { stats: StravaDashboard }) {
  const items = [
    { label: "total miles", value: `${stats.totalDistanceMiles.toFixed(1)}` },
    {
      label: "average pace",
      value: formatPacePerMile(stats.averagePacePerMileSeconds)
    },
    { label: "runs", value: String(stats.runCount) },
    { label: "this month", value: `${stats.milesThisMonth.toFixed(1)} mi` },
    { label: "avg / week", value: `${stats.avgWeeklyMiles.toFixed(1)} mi` }
  ] as const;

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 md:gap-x-12 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
              {item.label}
            </p>
            <p className="mt-1.5 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[0.6875rem] leading-relaxed text-muted-foreground/50">
        totals and averages are from the latest activities pulled from strava.
      </p>
    </div>
  );
}
