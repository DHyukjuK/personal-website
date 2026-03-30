import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { formatPacePerMile } from "@/lib/utils";
import type { RunHighlights as RunHighlightsType } from "@/lib/types";

export function RunHighlights({ highlights }: { highlights: RunHighlightsType }) {
  const blocks = [
    {
      label: "Longest",
      run: highlights.longest,
      detail: `${highlights.longest.distanceMiles.toFixed(2)} mi`
    },
    {
      label: "Quickest pace",
      run: highlights.fastest,
      detail: formatPacePerMile(highlights.fastest.pacePerMileSeconds)
    },
    {
      label: "Most recent",
      run: highlights.latest,
      detail: format(new Date(highlights.latest.date), "MMM d, yyyy")
    }
  ] as const;

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Highlights
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {blocks.map((b) => (
          <Card
            key={b.label}
            className="border-border/80 p-4 sm:p-5 hover:border-border"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {b.label}
            </p>
            <p className="mt-2 line-clamp-2 font-medium leading-snug text-foreground">
              {b.run.name}
            </p>
            <p className="mt-2 text-sm tabular-nums text-muted-foreground">
              {b.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
