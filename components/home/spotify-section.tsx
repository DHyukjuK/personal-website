"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSpotifyNow } from "@/components/home/use-spotify-now";
import type { SpotifyPlayback, SpotifyPlaybackMode } from "@/lib/spotify";
import { cn } from "@/lib/utils";

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-foreground/10 bg-muted/20",
        "p-5 md:p-6"
      )}
    >
      {children}
    </div>
  );
}

function CardSkeleton() {
  return (
    <CardShell>
      <div className="animate-pulse space-y-4">
        <div className="h-2.5 w-24 rounded bg-muted-foreground/15" />
        <div className="h-3 max-w-md rounded bg-muted-foreground/10" />
        <div className="h-3 w-28 rounded bg-muted-foreground/12" />
        <div className="h-6 max-w-xs rounded bg-muted-foreground/15" />
        <div className="h-4 max-w-[14rem] rounded bg-muted-foreground/10" />
      </div>
    </CardShell>
  );
}

export function SpotifySection() {
  const state = useSpotifyNow();

  return (
    <section
      className="border-t border-foreground/10 pt-8 md:pt-10"
      aria-label="Spotify listening activity"
    >
      {state.phase === "loading" ? <CardSkeleton /> : null}

      {state.phase === "setup" ? (
        <CardShell>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Spotify
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Listening activity isn&apos;t connected yet. Add{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem]">
              {state.missingEnv.join(", ")}
            </code>{" "}
            to your env file, then run{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem]">
              npm run spotify:exchange
            </code>{" "}
            and restart the dev server.
          </p>
        </CardShell>
      ) : null}

      {state.phase === "auth" ? (
        <CardShell>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Spotify
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Can&apos;t refresh the Spotify link. Run{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem]">
              npm run spotify:exchange
            </code>{" "}
            with a new authorization code and update your refresh token.
          </p>
        </CardShell>
      ) : null}

      {state.phase === "error" ? (
        <CardShell>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Spotify
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {state.message}
          </p>
        </CardShell>
      ) : null}

      {state.phase === "empty" ? (
        <CardShell>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Spotify
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
            What I&apos;m playing now, or the last thing in my Spotify listening
            history.
          </p>
          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground/90">
            No recent activity from Spotify yet. Private listening hides this;
            the site also needs to use the same Spotify account you listen with.
          </p>
        </CardShell>
      ) : null}

      {state.phase === "ready" ? (
        <PlaybackCard playback={state.playback} />
      ) : null}
    </section>
  );
}

function playbackStatusLabel(mode: SpotifyPlaybackMode): string {
  switch (mode) {
    case "now":
      return "Now playing on Spotify";
    case "recent":
      return "Recently played on Spotify";
    case "paused":
      return "Paused on Spotify";
  }
}

function PlaybackCard({ playback }: { playback: SpotifyPlayback }) {
  const status = playbackStatusLabel(playback.mode);

  return (
    <CardShell>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 space-y-4">
          <header className="space-y-2">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Spotify
            </p>
            <p className="max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground">
              My listening activity—live playback or the most recent track from
              my history.
            </p>
          </header>

          <div className="flex items-center gap-2">
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/90">
              {status}
            </span>
            {playback.mode === "now" ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/85"
                aria-hidden
              />
            ) : null}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-medium leading-snug tracking-tight text-foreground md:text-xl">
              <Link
                href={playback.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground/85"
              >
                {playback.name}
              </Link>
            </h2>
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
              {playback.artists}
            </p>
            {playback.album ? (
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground/75">
                {playback.album}
              </p>
            ) : null}
          </div>
        </div>

        {playback.imageUrl ? (
          <Link
            href={playback.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mx-auto shrink-0 overflow-hidden rounded-md border border-foreground/10 bg-muted/40 sm:mx-0"
            aria-label="Open on Spotify"
          >
            <Image
              src={playback.imageUrl}
              alt=""
              width={88}
              height={88}
              className="h-[4.5rem] w-[4.5rem] object-cover transition-opacity duration-300 group-hover:opacity-90 sm:h-[5rem] sm:w-[5rem]"
              unoptimized
            />
          </Link>
        ) : null}
      </div>
    </CardShell>
  );
}
