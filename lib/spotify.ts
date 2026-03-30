/**
 * Server-only Spotify Web API helpers.
 * Requires SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.
 *
 * Dashboard: https://developer.spotify.com/dashboard
 * Scopes: user-read-currently-playing, user-read-recently-played
 * In development mode, add your Spotify user under User Management.
 */

export type SpotifyListening = {
  track: string;
  artists: string;
  trackUrl: string;
  isPlaying: boolean;
};

export type SpotifyIssue =
  | "missing_env"
  | "refresh_failed"
  | "api_error"
  | "no_tracks";

export type SpotifyPayload = {
  configured: boolean;
  listening: SpotifyListening | null;
  issue?: SpotifyIssue;
  missingEnvKeys?: string[];
  spotifyStatus?: number;
};

const SPOTIFY_ENV_KEYS = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_REFRESH_TOKEN"
] as const;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CURRENT_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
};

export function missingSpotifyEnvKeys(): string[] {
  return SPOTIFY_ENV_KEYS.filter((k) => !process.env[k]?.trim());
}

function spotifyConfigured(): boolean {
  return missingSpotifyEnvKeys().length === 0;
}

function mapTrack(
  track: SpotifyTrack,
  isPlaying: boolean
): SpotifyListening {
  return {
    track: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    trackUrl: track.external_urls.spotify,
    isPlaying
  };
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

export async function getSpotifyPayload(): Promise<SpotifyPayload> {
  if (!spotifyConfigured()) {
    return {
      configured: false,
      listening: null,
      issue: "missing_env",
      missingEnvKeys: missingSpotifyEnvKeys()
    };
  }

  const { token, status: tokenStatus } = await getAccessToken();
  if (!token) {
    return {
      configured: true,
      listening: null,
      issue: "refresh_failed",
      spotifyStatus: tokenStatus || undefined
    };
  }

  const headers = { Authorization: `Bearer ${token}` };

  const current = await fetch(CURRENT_URL, { headers, cache: "no-store" });

  if (current.status === 200) {
    const data = (await current.json()) as {
      is_playing?: boolean;
      item?: SpotifyTrack | null;
    };
    if (data.item) {
      return {
        configured: true,
        listening: mapTrack(data.item, Boolean(data.is_playing))
      };
    }
  }

  if (current.status !== 204 && current.status !== 200) {
    if (current.status === 401 || current.status === 403) {
      return {
        configured: true,
        listening: null,
        issue: "api_error",
        spotifyStatus: current.status
      };
    }
  }

  const recent = await fetch(RECENT_URL, { headers, cache: "no-store" });
  if (!recent.ok) {
    return {
      configured: true,
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
    return {
      configured: true,
      listening: null,
      issue: "no_tracks"
    };
  }

  return {
    configured: true,
    listening: mapTrack(track, false)
  };
}
