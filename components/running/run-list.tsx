import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { formatPace } from "@/lib/utils";
import type { RunSummary } from "@/lib/types";

type RunListProps = {
  runs: RunSummary[];
};

export function RunList({ runs }: RunListProps) {
  if (runs.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          No runs available yet. Connect Strava to load activity.
        </p>
      </Card>
    );
  }

  const maxDistance = Math.max(...runs.map((run) => run.distanceKm));

  return (
    <div className="space-y-3">
      {runs.map((run) => (
        <Card key={run.id} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{run.name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(run.date), "MMM d, yyyy")}
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{run.distanceKm.toFixed(2)} km</p>
              <p>{formatPace(run.pacePerKmSeconds)}</p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-foreground/70"
              style={{ width: `${(run.distanceKm / maxDistance) * 100}%` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
