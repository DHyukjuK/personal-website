/**
 * Server-only: Spotify “now playing” or “last played”.
 *
 * Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 * Scopes: user-read-currently-playing, user-read-recently-played
 */

/** Where this row came from (drives labels in the UI). */
export type SpotifyPlaybackMode = "now" | "recent" | "paused";

export type SpotifyPlayback = {
  name: string;
  artists: string;
  /** Album title, or show name for podcasts. */
  album: string | null;
  href: string;
  imageUrl: string | null;
  mode: SpotifyPlaybackMode;
};

/** JSON from GET /api/spotify */
export type SpotifyNowPayload =
  | { ok: false; reason: "setup"; missingEnv: string[] }
  | { ok: false; reason: "auth" }
  | { ok: false; reason: "spotify"; detail?: string }
  | { ok: true; now: SpotifyPlayback | null };

const ENV = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_REFRESH_TOKEN"
] as const;

const ACCOUNTS = "https://accounts.spotify.com/api/token";
const CURRENT =
  "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode";
const RECENT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type PlayableItem = {
  name?: string;
  artists?: { name?: string }[];
  show?: { name?: string };
  album?: { name?: string; images?: { url?: string }[] };
  external_urls?: { spotify?: string };
  images?: { url?: string }[];
};

let tokenCache: { value: string; until: number } | null = null;

/**
 * Reuse the last successful playback payload so the client can poll `/api/spotify`
 * often without hitting Spotify’s Web API every time (rate limits / 429).
 */
let playbackPayloadCache: {
  payload: Extract<SpotifyNowPayload, { ok: true }>;
  until: number;
} | null = null;

const PLAYBACK_CACHE_TTL_MS = 35_000;

function missingEnv(): string[] {
  return ENV.filter((k) => !process.env[k]?.trim());
}

async function readJson<T>(res: Response): Promise<T | undefined> {
  const text = await res.text();
  if (!text.trim()) return undefined;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

function itemArtists(t: PlayableItem): string {
  const a = (t.artists ?? [])
    .map((x) => x.name)
    .filter(Boolean)
    .join(", ");
  if (a) return a;
  const show = t.show?.name?.trim();
  return show ?? "—";
}

function itemImage(t: PlayableItem): string | null {
  return (
    t.album?.images?.[0]?.url?.trim() ??
    t.images?.[0]?.url?.trim() ??
    null
  );
}

function itemHref(t: PlayableItem): string | null {
  const spotify = t.external_urls?.spotify?.trim();
  if (spotify) return spotify;
  const name = t.name?.trim();
  if (!name) return null;
  const q = [name, itemArtists(t)].filter((s) => s && s !== "—").join(" ");
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}

function playbackFromItem(
  t: PlayableItem,
  mode: SpotifyPlaybackMode
): SpotifyPlayback | null {
  const name = t.name?.trim();
  if (!name) return null;
  const href = itemHref(t);
  if (!href) return null;
  const album =
    t.album?.name?.trim() ?? t.show?.name?.trim() ?? null;
  return {
    name,
    artists: itemArtists(t),
    album,
    href,
    imageUrl: itemImage(t),
    mode
  };
}

async function refreshToken(): Promise<{ ok: true; token: string } | { ok: false }> {
  const id = process.env.SPOTIFY_CLIENT_ID?.trim();
  const secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN?.trim();
  if (!id || !secret || !refresh) return { ok: false };

  const res = await fetch(ACCOUNTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh
    }),
    cache: "no-store"
  });

  const body = await readJson<{ access_token?: string; expires_in?: number }>(
    res
  );
  if (!res.ok || !body?.access_token) {
    tokenCache = null;
    return { ok: false };
  }

  const sec = typeof body.expires_in === "number" ? body.expires_in : 3600;
  const until = Date.now() + Math.max(30_000, (sec - 120) * 1000);
  tokenCache = { value: body.access_token, until };
  return { ok: true, token: body.access_token };
}

async function bearer(): Promise<string | null> {
  if (tokenCache && Date.now() < tokenCache.until) {
    return tokenCache.value;
  }
  const r = await refreshToken();
  return r.ok ? r.token : null;
}

/**
 * Prefer live playback when `is_playing`; otherwise use recently-played so
 * idle listeners still see their last track (not only a paused queue item).
 */
async function fetchPlayback(token: string): Promise<SpotifyPlayback | null> {
  const h = { Authorization: `Bearer ${token}` };

  try {
    const [curRes, recRes] = await Promise.all([
      fetch(CURRENT, { headers: h, cache: "no-store" }),
      fetch(RECENT, { headers: h, cache: "no-store" })
    ]);

    const cur =
      curRes.status === 200
        ? await readJson<{
            is_playing?: boolean;
            item?: PlayableItem | null;
          }>(curRes)
        : undefined;

    let recentItem: PlayableItem | null = null;
    if (recRes.ok) {
      const rec = await readJson<{
        items?: { track?: PlayableItem | null }[];
      }>(recRes);
      recentItem = rec?.items?.[0]?.track ?? null;
    }

    if (cur?.item && cur.is_playing) {
      const p = playbackFromItem(cur.item, "now");
      if (p) return p;
    }

    if (recentItem) {
      const p = playbackFromItem(recentItem, "recent");
      if (p) return p;
    }

    if (cur?.item) {
      const p = playbackFromItem(cur.item, "paused");
      if (p) return p;
    }

    return null;
  } catch {
    return null;
  }
}

export async function getSpotifyNowPayload(): Promise<SpotifyNowPayload> {
  const miss = missingEnv();
  if (miss.length > 0) {
    return { ok: false, reason: "setup", missingEnv: miss };
  }

  if (playbackPayloadCache && Date.now() < playbackPayloadCache.until) {
    return playbackPayloadCache.payload;
  }

  try {
    const token = await bearer();
    if (!token) {
      playbackPayloadCache = null;
      return { ok: false, reason: "auth" };
    }
    const now = await fetchPlayback(token);
    const payload: Extract<SpotifyNowPayload, { ok: true }> = {
      ok: true,
      now
    };
    playbackPayloadCache = {
      payload,
      until: Date.now() + PLAYBACK_CACHE_TTL_MS
    };
    return payload;
  } catch (e) {
    playbackPayloadCache = null;
    console.error("[spotify]", e);
    return {
      ok: false,
      reason: "spotify",
      detail: e instanceof Error ? e.message : undefined
    };
  }
}
