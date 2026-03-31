import Link from "next/link";

import { MediaEmbed } from "@/components/music/media-embed";
import type { Recording } from "@/lib/types";
import { cn } from "@/lib/utils";

type RecordingCardProps = {
  recording: Recording;
};

/**
 * Uniform performance card for the music page grid.
 */
export function RecordingCard({ recording }: RecordingCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-foreground/[0.08] bg-background/50 p-5 md:gap-5 md:p-6",
        "dark:border-white/[0.08] dark:bg-background/30"
      )}
    >
      <header className="space-y-2">
        <h3 className="font-sans text-base font-semibold leading-snug tracking-tight text-foreground md:text-[1.0625rem]">
          {recording.title}
        </h3>
        {recording.context ? (
          <p className="text-[0.6875rem] leading-relaxed text-muted-foreground md:text-[0.7rem]">
            {recording.context}
          </p>
        ) : (
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            {recording.instrument} · {recording.year}
          </p>
        )}
      </header>

      <p className="flex-1 text-[0.875rem] leading-[1.65] text-muted-foreground md:text-[0.9375rem] md:leading-[1.7]">
        {recording.description}
      </p>

      {recording.embedUrl ? (
        <div className="space-y-3">
          <MediaEmbed
            title={recording.title}
            url={recording.embedUrl}
            frame="minimal"
          />
          {recording.watchUrl ? (
            <p className="text-[0.6875rem] text-muted-foreground">
              <Link
                href={recording.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 underline decoration-foreground/15 underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-foreground/35"
              >
                Open on YouTube
              </Link>
            </p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl bg-muted/25 px-4 py-10 text-center text-sm text-muted-foreground ring-1 ring-inset ring-foreground/[0.05]">
          Video link coming soon. I’ll add the embed when it’s up.
        </div>
      )}
    </article>
  );
}
