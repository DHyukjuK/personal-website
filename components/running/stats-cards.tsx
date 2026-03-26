import { Card } from "@/components/ui/card";
import { formatPace } from "@/lib/utils";
import type { StravaDashboard } from "@/lib/types";

type StatsCardsProps = {
  stats: StravaDashboard;
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Total Distance
        </p>
        <p className="mt-2 font-serif text-2xl">{stats.totalDistanceKm.toFixed(1)} km</p>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Average Pace
        </p>
        <p className="mt-2 font-serif text-2xl">
          {formatPace(stats.averagePacePerKmSeconds || 0)}
        </p>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Recent Runs
        </p>
        <p className="mt-2 font-serif text-2xl">{stats.runCount}</p>
      </Card>
    </div>
  );
}
