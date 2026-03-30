#!/usr/bin/env node
/**
 * Exchange a Spotify OAuth authorization code for tokens.
 *
 * 1. Create an app at https://developer.spotify.com/dashboard
 * 2. In the dashboard, add this Redirect URI exactly (Settings → Redirect URIs):
 *    https://davidhkwon.vercel.app
 * 3. Open authorize URL in browser, approve, copy `code` from redirect URL.
 * 4. Run:
 *    node scripts/spotify-exchange.mjs PASTE_CODE "https://davidhkwon.vercel.app"
 *
 * Scopes requested: user-read-currently-playing user-read-recently-played
 *
 * 5. Put SPOTIFY_REFRESH_TOKEN=... in .env.local and restart npm run dev.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadDotEnvLocal({ required = true } = {}) {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    if (required) {
      console.error("Missing .env.local in project root.");
      process.exit(1);
    }
    return;
  }
  const raw = fs.readFileSync(envPath, "utf8");
  for (let line of raw.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

/** Must match a Redirect URI in the Spotify app settings (scheme + host + path exactly). */
const DEFAULT_SPOTIFY_REDIRECT_URI = "https://davidhkwon.vercel.app";

const code = process.argv[2];
const redirectUri = process.argv[3] ?? DEFAULT_SPOTIFY_REDIRECT_URI;

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played"
].join(" ");

if (!code) {
  loadDotEnvLocal({ required: false });
  const cid = process.env.SPOTIFY_CLIENT_ID?.trim() || "YOUR_CLIENT_ID";
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(cid)}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.error(`Usage: node scripts/spotify-exchange.mjs <CODE> [redirect_uri]

Open this URL in a browser (Redirect URI in Spotify dashboard must match exactly):

${authUrl}

Then:
  node scripts/spotify-exchange.mjs "PASTE_CODE" "${redirectUri}"
`);
  process.exit(1);
}

loadDotEnvLocal();

const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error(
    "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first."
  );
  process.exit(1);
}

const body = new URLSearchParams({
  grant_type: "authorization_code",
  code,
  redirect_uri: redirectUri
});

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
  },
  body
});

const json = await res.json();

if (!res.ok) {
  console.error("Spotify returned an error:", res.status);
  console.error(JSON.stringify(json, null, 2));
  process.exit(1);
}

if (!json.refresh_token) {
  console.error("Unexpected response (no refresh_token):", json);
  process.exit(1);
}

console.log("\nSuccess. Add or replace in .env.local:\n");
console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`);
console.log("\nScopes:", json.scope ?? "(not in response)");
console.log("\nThen restart npm run dev.\n");
