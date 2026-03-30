"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SpotifyIssue =
  | "missing_env"
  | "refresh_failed"
  | "api_error"
  | "no_tracks";

type Payload = {
  configured: boolean;
  listening: {
    track: string;
    artists: string;
    trackUrl: string;
    isPlaying: boolean;
  } | null;
  issue?: SpotifyIssue;
};

const issueHint: Record<SpotifyIssue, string> = {
  missing_env:
    "Spotify isn’t connected yet. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN to .env.local (local) or Vercel env, then redeploy.",
  refresh_failed:
    "Spotify rejected the refresh token. Regenerate it with the authorize flow, update the env vars, and redeploy.",
  api_error:
    "Spotify blocked the request. In the Developer Dashboard, add your Spotify user under User Management (development mode) and confirm scopes include recently played.",
  no_tracks:
    "No recent plays found. Listen to something on Spotify and refresh this page."
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
        if (!cancelled)
          setData({
            configured: false,
            listening: null,
            issue: "missing_env"
          });
      }
    }

    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (data === null) {
    return null;
  }

  if (data.listening) {
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

  if (data.issue) {
    return (
      <div className="border-t border-foreground/10 pt-8 text-[0.8125rem] leading-relaxed text-muted-foreground">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
          Spotify
        </p>
        <p className="mt-2 max-w-prose text-[0.8125rem]">{issueHint[data.issue]}</p>
      </div>
    );
  }

  return null;
}
