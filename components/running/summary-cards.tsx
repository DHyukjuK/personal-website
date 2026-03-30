import { Card } from "@/components/ui/card";
import { formatPacePerMile } from "@/lib/utils";
import type { StravaDashboard } from "@/lib/types";

const cardClass =
  "border-border/80 p-4 sm:p-5 hover:border-border sm:min-h-[5.75rem]";

export function SummaryCards({ stats }: { stats: StravaDashboard }) {
  const items = [
    {
      label: "Total miles",
      value: `${stats.totalDistanceMiles.toFixed(1)} mi`
    },
    {
      label: "Average pace",
      value: formatPacePerMile(stats.averagePacePerMileSeconds)
    },
    {
      label: "Runs",
      value: String(stats.runCount)
    },
    {
      label: "This month",
      value: `${stats.milesThisMonth.toFixed(1)} mi`
    },
    {
      label: "Avg / week",
      value: `${stats.avgWeeklyMiles.toFixed(1)} mi`
    }
  ] as const;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
        {items.map((item) => (
          <Card key={item.label} className={cardClass}>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 font-serif text-xl tracking-tight text-foreground sm:text-2xl">
              {item.value}
            </p>
          </Card>
        ))}
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground/90">
        Totals and averages are from the latest activities pulled from Strava—not
        lifetime stats.
      </p>
    </div>
  );
}
