"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Payload = {
  configured: boolean;
  listening: {
    track: string;
    artists: string;
    trackUrl: string;
    isPlaying: boolean;
  } | null;
};

export function NowPlaying() {
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/spotify");
        const json = (await res.json()) as Payload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ configured: false, listening: null });
      }
    }

    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!data?.configured || !data.listening) return null;

  const { track, artists, trackUrl, isPlaying } = data.listening;

  return (
    <div className="border-t border-foreground/10 pt-8 text-[0.8125rem] leading-relaxed text-muted-foreground">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
        {isPlaying ? "Listening" : "Last played"}
      </p>
      <p className="mt-2">
        <Link
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline decoration-foreground/20 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
        >
          {track}
        </Link>
        <span className="text-muted-foreground"> — {artists}</span>
        {isPlaying ? (
          <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-green-600 dark:bg-green-500" />
        ) : null}
      </p>
    </div>
  );
}
