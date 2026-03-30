#!/usr/bin/env node
/**
 * Exchange a Strava OAuth authorization code for tokens.
 *
 * 1. Open the authorize URL in your browser, approve, get `code` from the redirect URL.
 * 2. Run (same redirect_uri as in that URL, default: production site):
 *
 *    node scripts/strava-exchange.mjs PASTE_CODE_HERE
 *    node scripts/strava-exchange.mjs PASTE_CODE_HERE "https://davidhkwon.vercel.app"
 *
 * 3. Copy the printed STRAVA_REFRESH_TOKEN= line into .env.local and restart `npm run dev`.
 *
 * Requires STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env.local (not the refresh token).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadDotEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local in project root.");
    process.exit(1);
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

const code = process.argv[2];
const redirectUri = process.argv[3] ?? "https://davidhkwon.vercel.app";

if (!code) {
  console.error(
    'Usage: node scripts/strava-exchange.mjs <AUTHORIZATION_CODE> [redirect_uri]\nExample: node scripts/strava-exchange.mjs "abc123..." "https://davidhkwon.vercel.app"'
  );
  process.exit(1);
}

loadDotEnvLocal();

const clientId = process.env.STRAVA_CLIENT_ID?.trim();
const clientSecret = process.env.STRAVA_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error(
    "Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env.local first."
  );
  process.exit(1);
}

const body = new URLSearchParams({
  client_id: clientId,
  client_secret: clientSecret,
  code,
  grant_type: "authorization_code",
  redirect_uri: redirectUri
});

const res = await fetch("https://www.strava.com/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body
});

const json = await res.json();

if (!res.ok) {
  console.error("Strava returned an error:", res.status);
  console.error(JSON.stringify(json, null, 2));
  process.exit(1);
}

if (!json.refresh_token) {
  console.error("Unexpected response (no refresh_token):", json);
  process.exit(1);
}

console.log("\nSuccess. Add or replace this line in .env.local:\n");
console.log(`STRAVA_REFRESH_TOKEN=${json.refresh_token}`);
console.log("\nScopes:", json.scope ?? "(not in response)");
console.log("\nThen restart the dev server (npm run dev).\n");
