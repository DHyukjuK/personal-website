"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SpotifyIssue =
  | "missing_env"
  | "refresh_failed"
  | "api_error"
  | "no_tracks"
  | "server_error"
  | "fetch_failed";

type Payload = {
  configured: boolean;
  listening: {
    track: string;
    artists: string;
    trackUrl: string;
    isPlaying: boolean;
  } | null;
  issue?: SpotifyIssue;
  missingEnvKeys?: string[];
  spotifyStatus?: number;
};

const issueHint: Record<SpotifyIssue, string> = {
  missing_env:
    "Spotify isn’t connected yet. Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN in .env.local or Vercel, then restart or redeploy.",
  refresh_failed:
    "Spotify rejected the refresh token. Run scripts/spotify-exchange.mjs with your OAuth code or regenerate tokens in the Spotify dashboard.",
  api_error:
    "Spotify blocked the request. In the Developer Dashboard, add your Spotify user under User Management (development mode) and use scopes user-read-currently-playing and user-read-recently-played.",
  no_tracks:
    "No recent plays found. Listen to something on Spotify and check again.",
  server_error:
    "The Spotify API route failed. Check server logs.",
  fetch_failed:
    "Couldn’t load Spotify status. Refresh the page or open /api/spotify."
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
            issue: "fetch_failed"
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
    const missing =
      data.issue === "missing_env" && data.missingEnvKeys?.length
        ? ` Unset or empty: ${data.missingEnvKeys.join(", ")}.`
        : "";
    const status =
      data.spotifyStatus != null
        ? ` Spotify HTTP status: ${data.spotifyStatus}.`
        : "";
    return (
      <div className="border-t border-foreground/10 pt-8 text-[0.8125rem] leading-relaxed text-muted-foreground">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
          Spotify
        </p>
        <p className="mt-2 max-w-prose text-[0.8125rem]">
          {issueHint[data.issue]}
          {missing}
          {status}
        </p>
      </div>
    );
  }

  return null;
}
