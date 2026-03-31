import type { CSSProperties } from "react";
import Link from "next/link";

import { musicStreamingProfiles } from "@/config/music-streaming";
import {
  StreamingBrandIcon,
  streamingBrandHex
} from "@/components/music/streaming-brand-icons";
import { cn } from "@/lib/utils";

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-3.5 w-3.5 opacity-45", className)}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M10 6.5v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M6 1h4v4M10 1 5 6" />
    </svg>
  );
}

const spotifyHex = streamingBrandHex("spotify");
const appleHex = streamingBrandHex("appleMusic");

export function StreamingProfileLinks() {
  return (
    <nav
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4"
      aria-label="Streaming profiles"
    >
      <Link
        href={musicStreamingProfiles.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group relative flex min-h-[3.25rem] items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3",
          "text-[0.8125rem] font-medium text-foreground",
          "transition-[border-color,box-shadow,transform] duration-300 ease-out",
          "hover:-translate-y-px hover:shadow-md",
          "border-foreground/[0.12] bg-gradient-to-br from-background via-background to-[color-mix(in_srgb,var(--spotify-tint)_22%,transparent)]",
          "hover:border-[color-mix(in_srgb,var(--spotify-tint)_35%,hsl(var(--foreground)))]",
          "dark:from-background/80 dark:via-background/60 dark:to-[color-mix(in_srgb,var(--spotify-tint)_14%,transparent)]"
        )}
        style={
          {
            ["--spotify-tint" as string]: `#${spotifyHex}`
          } as CSSProperties
        }
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--spotify-tint)_12%,hsl(var(--muted)))] shadow-inner ring-1 ring-inset ring-black/[0.04] dark:bg-[color-mix(in_srgb,var(--spotify-tint)_18%,hsl(var(--muted)))] dark:ring-white/[0.06]"
          style={{ color: `#${spotifyHex}` }}
        >
          <StreamingBrandIcon brand="spotify" className="h-[1.15rem] w-[1.15rem]" />
        </span>
        <span className="min-w-0 flex-1 text-left leading-snug">
          <span className="block text-foreground">Spotify</span>
          <span className="mt-0.5 block text-[0.7rem] font-normal text-muted-foreground">
            Open profile & playlists
          </span>
        </span>
        <ExternalIcon className="shrink-0 opacity-40 transition-opacity group-hover:opacity-70" />
      </Link>

      <Link
        href={musicStreamingProfiles.appleMusic}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group relative flex min-h-[3.25rem] items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3",
          "text-[0.8125rem] font-medium text-foreground",
          "transition-[border-color,box-shadow,transform] duration-300 ease-out",
          "hover:-translate-y-px hover:shadow-md",
          "border-foreground/[0.12] bg-gradient-to-br from-background via-background to-[color-mix(in_srgb,var(--apple-tint)_20%,transparent)]",
          "hover:border-[color-mix(in_srgb,var(--apple-tint)_32%,hsl(var(--foreground)))]",
          "dark:from-background/80 dark:via-background/60 dark:to-[color-mix(in_srgb,var(--apple-tint)_12%,transparent)]"
        )}
        style={
          {
            ["--apple-tint" as string]: `#${appleHex}`
          } as CSSProperties
        }
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--apple-tint)_10%,hsl(var(--muted)))] shadow-inner ring-1 ring-inset ring-black/[0.04] dark:bg-[color-mix(in_srgb,var(--apple-tint)_16%,hsl(var(--muted)))] dark:ring-white/[0.06]"
          style={{ color: `#${appleHex}` }}
        >
          <StreamingBrandIcon brand="appleMusic" className="h-[1.15rem] w-[1.15rem]" />
        </span>
        <span className="min-w-0 flex-1 text-left leading-snug">
          <span className="block text-foreground">Apple Music</span>
          <span className="mt-0.5 block text-[0.7rem] font-normal text-muted-foreground">
            Open profile & library
          </span>
        </span>
        <ExternalIcon className="shrink-0 opacity-40 transition-opacity group-hover:opacity-70" />
      </Link>
    </nav>
  );
}
