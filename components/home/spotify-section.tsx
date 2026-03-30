"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  listeningIssue?: "no_tracks";
  issue?: SpotifyIssue;
  missingEnvKeys?: string[];
  spotifyStatus?: number;
  topTracks: {
    name: string;
    artists: string;
    url: string;
    imageUrl: string | null;
  }[];
  topArtists: {
    name: string;
    url: string;
    imageUrl: string | null;
  }[];
  topDataUnavailable?: boolean;
};

const issueHint: Record<SpotifyIssue, string> = {
  missing_env:
    "Spotify isn’t connected yet. Set SPOTIFY_* in .env.local or Vercel, then restart or redeploy.",
  refresh_failed:
    "Spotify rejected the refresh token. Run scripts/spotify-exchange.mjs with a fresh OAuth code.",
  api_error:
    "Spotify blocked part of the request. Check the Developer Dashboard (User Management + scopes).",
  no_tracks:
    "No recent plays found.",
  server_error:
    "The Spotify API route failed. Check server logs.",
  fetch_failed:
    "Couldn’t load Spotify data. Refresh the page or open /api/spotify."
};

export function SpotifySection() {
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
            topTracks: [],
            topArtists: [],
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

  const showFatalError =
    data.issue &&
    data.issue !== "no_tracks" &&
    !(data.topTracks.length > 0 || data.topArtists.length > 0);

  const showListeningError =
    data.issue === "no_tracks" || data.listeningIssue === "no_tracks";

  return (
    <div className="border-t border-foreground/10 pt-8 text-[0.8125rem] leading-relaxed text-muted-foreground">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
        My Spotify
      </p>
      <p className="mt-2 max-w-prose text-[0.8125rem] text-muted-foreground">
        Listening activity from my account—live playback, last played, and top
        artists &amp; tracks (roughly the last few weeks).
      </p>

      {showFatalError ? (
        <p className="mt-4 max-w-prose text-[0.8125rem]">
          {issueHint[data.issue!]}
          {data.issue === "missing_env" && data.missingEnvKeys?.length
            ? ` Unset or empty: ${data.missingEnvKeys.join(", ")}.`
            : ""}
          {data.spotifyStatus != null
            ? ` Spotify HTTP status: ${data.spotifyStatus}.`
            : ""}
        </p>
      ) : null}

      {!showFatalError && data.issue && data.issue !== "no_tracks" ? (
        <p className="mt-4 max-w-prose text-[0.8125rem] text-amber-700/90 dark:text-amber-400/90">
          {issueHint[data.issue]}
          {data.spotifyStatus != null ? ` (${data.spotifyStatus})` : ""}
        </p>
      ) : null}

      {data.listening ? (
        <div className="mt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
            {data.listening.isPlaying ? "Now playing" : "Last played"}
          </p>
          <p className="mt-2">
            <Link
              href={data.listening.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/20 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
            >
              {data.listening.track}
            </Link>
            <span className="text-muted-foreground">
              {" "}
              — {data.listening.artists}
            </span>
            {data.listening.isPlaying ? (
              <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-green-600 dark:bg-green-500" />
            ) : null}
          </p>
        </div>
      ) : null}

      {showListeningError && !data.listening ? (
        <p className="mt-4 text-[0.8125rem] text-muted-foreground/90">
          Nothing in recent plays right now—top lists below still reflect my
          listening.
        </p>
      ) : null}

      {data.topDataUnavailable ? (
        <p className="mt-4 max-w-prose text-[0.8125rem] text-amber-700/90 dark:text-amber-400/90">
          Top artists &amp; tracks need the{" "}
          <code className="text-[0.75rem]">user-top-read</code> scope. Re-run{" "}
          <code className="text-[0.75rem]">npm run spotify:exchange</code> with
          a new OAuth code after updating scopes in the Spotify app.
        </p>
      ) : null}

      {data.topTracks.length > 0 ? (
        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
            Top tracks
          </p>
          <ul className="mt-3 space-y-3">
            {data.topTracks.map((t, i) => (
              <li key={`${t.url}-${i}`}>
                <Link
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-md transition-colors hover:bg-muted/50"
                >
                  {t.imageUrl ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={t.imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover"
                        unoptimized
                      />
                    </span>
                  ) : (
                    <span className="h-12 w-12 shrink-0 rounded bg-muted" />
                  )}
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="block font-medium text-foreground group-hover:underline">
                      {t.name}
                    </span>
                    <span className="block text-[0.8125rem] text-muted-foreground">
                      {t.artists}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.topArtists.length > 0 ? (
        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
            Top artists
          </p>
          <ul className="mt-3 flex flex-wrap gap-4">
            {data.topArtists.map((a, i) => (
              <li key={`${a.url}-${i}`}>
                <Link
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-[5.5rem] flex-col items-center gap-2 text-center"
                >
                  {a.imageUrl ? (
                    <span className="relative h-16 w-16 overflow-hidden rounded-full bg-muted ring-1 ring-foreground/10">
                      <Image
                        src={a.imageUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover"
                        unoptimized
                      />
                    </span>
                  ) : (
                    <span className="h-16 w-16 rounded-full bg-muted ring-1 ring-foreground/10" />
                  )}
                  <span className="line-clamp-2 text-[0.75rem] font-medium leading-snug text-foreground group-hover:underline">
                    {a.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
