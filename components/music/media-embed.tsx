type MediaEmbedProps = {
  title: string;
  url: string;
};

export function MediaEmbed({ title, url }: MediaEmbedProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
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
