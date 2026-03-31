"use client";

import { useEffect, useState } from "react";

import type { SpotifyNowPayload, SpotifyPlayback } from "@/lib/spotify";

/** Poll your own API often; server caches Spotify responses (see `lib/spotify.ts`). */
const POLL_MS = 15_000;

export type SpotifySectionState =
  | { phase: "loading" }
  | { phase: "setup"; missingEnv: string[] }
  | { phase: "auth" }
  | { phase: "error"; message: string }
  | { phase: "empty" }
  | { phase: "ready"; playback: SpotifyPlayback };

function mapPayload(raw: unknown): SpotifySectionState {
  if (!raw || typeof raw !== "object" || !("ok" in raw)) {
    return { phase: "error", message: "Something went wrong." };
  }
  const p = raw as SpotifyNowPayload;
  if (!p.ok) {
    if (p.reason === "setup") {
      return { phase: "setup", missingEnv: p.missingEnv };
    }
    if (p.reason === "auth") {
      return { phase: "auth" };
    }
    return {
      phase: "error",
      message: p.detail?.trim() || "Something went wrong."
    };
  }
  if (!p.now) {
    return { phase: "empty" };
  }
  return { phase: "ready", playback: p.now };
}

export function useSpotifyNow(): SpotifySectionState {
  const [state, setState] = useState<SpotifySectionState>({
    phase: "loading"
  });

  useEffect(() => {
    let alive = true;

    async function pull() {
      try {
        const res = await fetch("/api/spotify", { cache: "no-store" });
        const raw: unknown = await res.json();
        if (!alive) return;
        setState(mapPayload(raw));
      } catch {
        if (alive) {
          setState({ phase: "error", message: "Could not load." });
        }
      }
    }

    pull();
    const id = window.setInterval(pull, POLL_MS);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  return state;
}
