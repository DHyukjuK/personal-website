import { format } from "date-fns";
import { formatPacePerMile } from "@/lib/utils";
import type { RunHighlights as RunHighlightsType } from "@/lib/types";

export function RunHighlights({
  highlights
}: {
  highlights: RunHighlightsType;
}) {
  const blocks = [
    {
      label: "longest",
      run: highlights.longest,
      detail: `${highlights.longest.distanceMiles.toFixed(2)} mi`
    },
    {
      label: "quickest pace",
      run: highlights.fastest,
      detail: formatPacePerMile(highlights.fastest.pacePerMileSeconds)
    },
    {
      label: "most recent",
      run: highlights.latest,
      detail: format(
        new Date(highlights.latest.date),
        "MMM d, yyyy"
      ).toLowerCase()
    }
  ] as const;

  return (
    <div>
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/60">
        highlights
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        {blocks.map((b) => (
          <div
            key={b.label}
            className="border-l-2 border-teal-500/25 pl-4 dark:border-teal-400/20"
          >
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.12em] text-teal-600/60 dark:text-teal-400/50">
              {b.label}
            </p>
            <p className="mt-1.5 line-clamp-2 text-[0.9375rem] font-medium leading-snug text-foreground/85">
              {b.run.name.toLowerCase()}
            </p>
            <p className="mt-1 text-[0.8125rem] tabular-nums text-muted-foreground/70">
              {b.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
