"use client";

import { SpotifySection } from "@/components/home/spotify-section";
import { StreamingProfileLinks } from "@/components/music/streaming-profile-links";

export function MusicListeningSection() {
  return (
    <section
      className="relative pb-16 md:pb-20"
      aria-labelledby="music-listening-heading"
    >
      <div className="mx-auto max-w-3xl space-y-9 md:space-y-11">
        <header className="space-y-5 md:space-y-6">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Listening
          </p>
          <h1
            id="music-listening-heading"
            className="font-serif text-[2rem] font-normal leading-[1.12] tracking-[-0.02em] text-foreground md:text-[2.35rem]"
          >
            What I&apos;m hearing
          </h1>
          <p className="max-w-[40ch] text-[0.9375rem] leading-[1.75] text-muted-foreground md:max-w-[48ch] md:text-[0.95rem]">
            Streaming is a big part of how I find music. Here&apos;s what
            I&apos;m playing on Spotify right now (or the last thing in my
            history), plus links to my profiles if you want playlists or the
            long tail of what I save elsewhere.
          </p>
        </header>

        <div className="music-listening-panel space-y-8 rounded-[1.35rem] border border-foreground/12 p-6 shadow-[0_24px_60px_-28px_rgba(45,30,75,0.18)] ring-1 ring-inset ring-white/70 dark:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.65)] dark:ring-white/[0.06] md:space-y-9 md:p-8">
          <StreamingProfileLinks />
          <div className="relative border-t border-foreground/[0.08] pt-8 dark:border-white/[0.07] md:pt-9">
            <SpotifySection variant="music" />
          </div>
        </div>
      </div>
    </section>
  );
}
