import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MediaEmbed } from "@/components/music/media-embed";
import type { Recording } from "@/lib/types";
import { cn } from "@/lib/utils";

type RecordingCardProps = {
  recording: Recording;
};

export function RecordingCard({ recording }: RecordingCardProps) {
  return (
    <Card
      className={cn(
        "space-y-4",
        recording.featured &&
          "border-foreground/20 bg-muted/20 md:col-span-2 md:p-8 md:py-8"
      )}
    >
      <div className="space-y-1">
        {recording.featured ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Featured
          </p>
        ) : null}
        <h3 className="font-sans text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {recording.title}
        </h3>
        {recording.context ? (
          <p className="text-[11px] leading-snug text-muted-foreground">
            {recording.context}
          </p>
        ) : (
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            {recording.instrument} · {recording.year}
          </p>
        )}
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
        {recording.description}
      </p>
      {recording.embedUrl ? (
        <>
          <MediaEmbed title={recording.title} url={recording.embedUrl} />
          {recording.watchUrl ? (
            <p className="text-[11px] text-muted-foreground">
              <Link
                href={recording.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-foreground/20 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
              >
                Open on YouTube
              </Link>
            </p>
          ) : null}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-foreground/20 bg-background/50 px-4 py-8 text-center text-sm text-muted-foreground">
          Performance link coming soon. I’ll drop the embed here when the video
          is up.
        </div>
      )}
    </Card>
  );
}
