/**
 * Server-only Spotify Web API helpers.
 * Requires SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.
 *
 * One-time setup: create an app at https://developer.spotify.com/dashboard
 * and complete the authorization code flow to obtain a refresh token with scopes:
 * user-read-currently-playing, user-read-recently-played
 *
 * Apple Music does not expose a comparable “now playing” API for public websites.
 */

export type SpotifyListening = {
  track: string;
  artists: string;
  trackUrl: string;
  isPlaying: boolean;
};

function spotifyConfigured(): boolean {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN
  );
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
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

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
};

function mapTrack(track: SpotifyTrack): Omit<SpotifyListening, "isPlaying"> {
  return {
    track: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    trackUrl: track.external_urls.spotify
  };
}

export async function getSpotifyListening(): Promise<{
  configured: boolean;
  listening: SpotifyListening | null;
}> {
  if (!spotifyConfigured()) {
    return { configured: false, listening: null };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { configured: true, listening: null };
  }

  const headers = { Authorization: `Bearer ${accessToken}` };

  const current = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers, cache: "no-store" }
  );

  if (current.status === 200) {
    const data = (await current.json()) as {
      is_playing?: boolean;
      item?: SpotifyTrack | null;
    };
    if (data.item) {
      return {
        configured: true,
        listening: {
          ...mapTrack(data.item),
          isPlaying: Boolean(data.is_playing)
        }
      };
    }
  }

  const recent = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers, cache: "no-store" }
  );
  if (!recent.ok) {
    return { configured: true, listening: null };
  }
  const recentData = (await recent.json()) as {
    items?: { track: SpotifyTrack }[];
  };
  const track = recentData.items?.[0]?.track;
  if (!track) {
    return { configured: true, listening: null };
  }
  return {
    configured: true,
    listening: {
      ...mapTrack(track),
      isPlaying: false
    }
  };
}
