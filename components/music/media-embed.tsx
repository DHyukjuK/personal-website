import { cn } from "@/lib/utils";

type MediaEmbedProps = {
  title: string;
  url: string;
  /** default: bordered card; minimal: lighter ring, calmer on dense grids */
  frame?: "default" | "minimal";
};

export function MediaEmbed({ title, url, frame = "default" }: MediaEmbedProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-muted/15",
        frame === "default" && "border border-border bg-card",
        frame === "minimal" && "ring-1 ring-inset ring-foreground/[0.06]"
      )}
    >
      <div className="relative aspect-video w-full">
        <iframe
          title={title}
          src={url}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
