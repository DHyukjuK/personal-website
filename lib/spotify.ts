/**
 * Server-only Spotify Web API helpers.
 * Requires SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.
 *
 * Dashboard: https://developer.spotify.com/dashboard
 * Scopes: user-read-currently-playing, user-read-recently-played, user-top-read
 * In development mode, add your Spotify user under User Management.
 */

export type SpotifyListening = {
  track: string;
  artists: string;
  trackUrl: string;
  isPlaying: boolean;
};

export type SpotifyTopTrack = {
  name: string;
  artists: string;
  url: string;
  imageUrl: string | null;
};

export type SpotifyTopArtist = {
  name: string;
  url: string;
  imageUrl: string | null;
};

export type SpotifyIssue =
  | "missing_env"
  | "refresh_failed"
  | "api_error"
  | "no_tracks";

export type SpotifyPayload = {
  configured: boolean;
  listening: SpotifyListening | null;
  /** Present when nothing is playing / in recent history but API otherwise works. */
  listeningIssue?: "no_tracks";
  issue?: SpotifyIssue;
  missingEnvKeys?: string[];
  spotifyStatus?: number;
  topTracks: SpotifyTopTrack[];
  topArtists: SpotifyTopArtist[];
  /** True if top endpoints returned 403 (re-authorize with user-top-read). */
  topDataUnavailable?: boolean;
};

const SPOTIFY_ENV_KEYS = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_REFRESH_TOKEN"
] as const;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CURRENT_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const TOP_TRACKS_URL =
  "https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term";
const TOP_ARTISTS_URL =
  "https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
  album?: { images?: { url: string }[] };
};

type SpotifyArtistFull = {
  name: string;
  external_urls: { spotify: string };
  images?: { url: string }[];
};

export function missingSpotifyEnvKeys(): string[] {
  return SPOTIFY_ENV_KEYS.filter((k) => !process.env[k]?.trim());
}

function spotifyConfigured(): boolean {
  return missingSpotifyEnvKeys().length === 0;
}

function mapTrack(track: SpotifyTrack, isPlaying: boolean): SpotifyListening {
  return {
    track: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    trackUrl: track.external_urls.spotify,
    isPlaying
  };
}

function pickImage(images?: { url: string }[]): string | null {
  if (!images?.length) return null;
  return images[0]?.url ?? null;
}

async function getAccessToken(): Promise<{ token: string | null; status: number }> {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) {
    return { token: null, status: 0 };
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
    cache: "no-store"
  });

  if (!res.ok) {
    return { token: null, status: res.status };
  }

  const data = (await res.json()) as { access_token?: string };
  return { token: data.access_token ?? null, status: res.status };
}

async function resolveListening(
  headers: HeadersInit
): Promise<{
  listening: SpotifyListening | null;
  issue?: SpotifyIssue;
  spotifyStatus?: number;
}> {
  const current = await fetch(CURRENT_URL, { headers, cache: "no-store" });

  if (current.status === 200) {
    const data = (await current.json()) as {
      is_playing?: boolean;
      item?: SpotifyTrack | null;
    };
    if (data.item) {
      return { listening: mapTrack(data.item, Boolean(data.is_playing)) };
    }
  }

  if (current.status !== 204 && current.status !== 200) {
    if (current.status === 401 || current.status === 403) {
      return {
        listening: null,
        issue: "api_error",
        spotifyStatus: current.status
      };
    }
  }

  const recent = await fetch(RECENT_URL, { headers, cache: "no-store" });
  if (!recent.ok) {
    return {
      listening: null,
      issue: "api_error",
      spotifyStatus: recent.status
    };
  }

  const recentData = (await recent.json()) as {
    items?: { track: SpotifyTrack }[];
  };
  const track = recentData.items?.[0]?.track;
  if (!track) {
    return { listening: null, issue: "no_tracks" };
  }

  return { listening: mapTrack(track, false) };
}

async function fetchTopTracks(
  headers: HeadersInit
): Promise<{ items: SpotifyTopTrack[]; forbidden: boolean }> {
  const res = await fetch(TOP_TRACKS_URL, { headers, cache: "no-store" });
  if (res.status === 403 || res.status === 401) {
    return { items: [], forbidden: true };
  }
  if (!res.ok) {
    return { items: [], forbidden: false };
  }
  const data = (await res.json()) as { items?: SpotifyTrack[] };
  const items = (data.items ?? []).map((t) => ({
    name: t.name,
    artists: t.artists.map((a) => a.name).join(", "),
    url: t.external_urls.spotify,
    imageUrl: pickImage(t.album?.images)
  }));
  return { items, forbidden: false };
}

async function fetchTopArtists(
  headers: HeadersInit
): Promise<{ items: SpotifyTopArtist[]; forbidden: boolean }> {
  const res = await fetch(TOP_ARTISTS_URL, { headers, cache: "no-store" });
  if (res.status === 403 || res.status === 401) {
    return { items: [], forbidden: true };
  }
  if (!res.ok) {
    return { items: [], forbidden: false };
  }
  const data = (await res.json()) as { items?: SpotifyArtistFull[] };
  const items = (data.items ?? []).map((a) => ({
    name: a.name,
    url: a.external_urls.spotify,
    imageUrl: pickImage(a.images)
  }));
  return { items, forbidden: false };
}

export async function getSpotifyPayload(): Promise<SpotifyPayload> {
  if (!spotifyConfigured()) {
    return {
      configured: false,
      listening: null,
      topTracks: [],
      topArtists: [],
      issue: "missing_env",
      missingEnvKeys: missingSpotifyEnvKeys()
    };
  }

  const { token, status: tokenStatus } = await getAccessToken();
  if (!token) {
    return {
      configured: true,
      listening: null,
      topTracks: [],
      topArtists: [],
      issue: "refresh_failed",
      spotifyStatus: tokenStatus || undefined
    };
  }

  const headers = { Authorization: `Bearer ${token}` };

  const [listeningResult, topTracksResult, topArtistsResult] = await Promise.all([
    resolveListening(headers),
    fetchTopTracks(headers),
    fetchTopArtists(headers)
  ]);

  const topDataUnavailable =
    topTracksResult.forbidden || topArtistsResult.forbidden;

  const base: SpotifyPayload = {
    configured: true,
    listening: listeningResult.listening,
    topTracks: topTracksResult.items,
    topArtists: topArtistsResult.items,
    topDataUnavailable: topDataUnavailable || undefined
  };

  if (listeningResult.issue === "api_error") {
    return {
      ...base,
      issue: "api_error",
      spotifyStatus: listeningResult.spotifyStatus
    };
  }

  if (listeningResult.issue === "no_tracks" && !listeningResult.listening) {
    return {
      ...base,
      listening: null,
      listeningIssue: "no_tracks"
    };
  }

  return base;
}
