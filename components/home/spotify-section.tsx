"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSpotifyNow } from "@/components/home/use-spotify-now";
import {
  StreamingBrandIcon,
  streamingBrandHex
} from "@/components/music/streaming-brand-icons";
import type { SpotifyPlayback, SpotifyPlaybackMode } from "@/lib/spotify";
import { cn } from "@/lib/utils";

type SpotifyVariant = "default" | "music";

const spotifyHex = streamingBrandHex("spotify");

function SpotifyEyebrow({
  variant = "default",
  className
}: {
  variant?: SpotifyVariant;
  className?: string;
}) {
  const row = "text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground";
  if (variant !== "music") {
    return <p className={cn(row, className)}>Spotify</p>;
  }
  return (
    <p className={cn(row, "flex items-center gap-2", className)}>
      <span className="inline-flex opacity-95" style={{ color: `#${spotifyHex}` }}>
        <StreamingBrandIcon brand="spotify" className="h-3.5 w-3.5" />
      </span>
      Spotify
    </p>
  );
}

function CardShell({
  children,
  variant = "default"
}: {
  children: ReactNode;
  variant?: SpotifyVariant;
}) {
  return (
    <div
      className={cn(
        "p-5 md:p-6",
        variant === "music"
          ? cn(
              "rounded-2xl border border-foreground/10 bg-muted/25 shadow-[0_14px_42px_-26px_rgba(15,40,25,0.35)] ring-1 ring-inset ring-emerald-500/[0.09] dark:bg-muted/15 dark:shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)] dark:ring-emerald-400/[0.07]"
            )
          : "rounded-lg border border-foreground/10 bg-muted/20"
      )}
      style={
        variant === "music"
          ? ({
              borderLeftWidth: 3,
              borderLeftColor: `#${spotifyHex}`
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

function CardSkeleton({ variant = "default" }: { variant?: SpotifyVariant }) {
  return (
    <CardShell variant={variant}>
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

type SpotifySectionProps = {
  variant?: SpotifyVariant;
  className?: string;
};

export function SpotifySection({
  variant = "default",
  className
}: SpotifySectionProps) {
  const state = useSpotifyNow();

  return (
    <section
      className={cn(
        variant === "default" &&
          "border-t border-foreground/10 pt-8 md:pt-10",
        variant === "music" && "pt-0",
        className
      )}
      aria-label="Spotify listening activity"
    >
      {state.phase === "loading" ? <CardSkeleton variant={variant} /> : null}

      {state.phase === "setup" ? (
        <CardShell variant={variant}>
          <SpotifyEyebrow variant={variant} />
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
        <CardShell variant={variant}>
          <SpotifyEyebrow variant={variant} />
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
        <CardShell variant={variant}>
          <SpotifyEyebrow variant={variant} />
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {state.message}
          </p>
        </CardShell>
      ) : null}

      {state.phase === "empty" ? (
        <CardShell variant={variant}>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Spotify
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
            What I&apos;m playing now, or the last thing in my Spotify listening
            history.
          </p>
          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground/90">
            Nothing to show yet. After you play a track, it should appear here.
          </p>
        </CardShell>
      ) : null}

      {state.phase === "ready" ? (
        <PlaybackCard playback={state.playback} variant={variant} />
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

function PlaybackCard({
  playback,
  variant = "default"
}: {
  playback: SpotifyPlayback;
  variant?: SpotifyVariant;
}) {
  const status = playbackStatusLabel(playback.mode);

  return (
    <CardShell variant={variant}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 space-y-4">
          <header className="space-y-2">
            <SpotifyEyebrow variant={variant} />
            <p className="max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground">
              Either what&apos;s playing right now or the last track that showed
              up in my history.
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
            className={cn(
              "group relative mx-auto shrink-0 overflow-hidden border border-foreground/10 bg-muted/40 sm:mx-0",
              variant === "music"
                ? "rounded-xl shadow-[0_12px_28px_-12px_rgba(0,0,0,0.35)] ring-2 ring-black/[0.04] dark:ring-white/[0.08]"
                : "rounded-md"
            )}
            aria-label="Open on Spotify"
          >
            <Image
              src={playback.imageUrl}
              alt=""
              width={variant === "music" ? 104 : 88}
              height={variant === "music" ? 104 : 88}
              className={cn(
                "object-cover transition-[opacity,transform] duration-300 group-hover:opacity-90",
                variant === "music"
                  ? "h-[5.25rem] w-[5.25rem] group-hover:scale-[1.02] sm:h-[5.75rem] sm:w-[5.75rem]"
                  : "h-[4.5rem] w-[4.5rem] sm:h-[5rem] sm:w-[5rem]"
              )}
              unoptimized
            />
          </Link>
        ) : null}
      </div>
    </CardShell>
  );
}
