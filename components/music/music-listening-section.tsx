"use client";

import { SpotifySection } from "@/components/home/spotify-section";
import { StreamingProfileLinks } from "@/components/music/streaming-profile-links";

export function MusicListeningSection() {
  return (
    <div className="space-y-8 md:space-y-9">
      <StreamingProfileLinks />
      <div className="border-t border-foreground/[0.08] pt-8 dark:border-white/[0.07] md:pt-9">
        <SpotifySection variant="music" />
      </div>
    </div>
  );
}
