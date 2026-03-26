# Personal Website

A minimalist personal website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MDX blog content
- Strava API integration for running stats

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content locations

- Blog posts: `content/blog/*.mdx`
- Projects: `content/projects/projects.ts`
- Music recordings: `content/music/recordings.ts`
- Site config and social links: `config/site.ts`

## Strava setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `STRAVA_CLIENT_ID`
   - `STRAVA_CLIENT_SECRET`
   - `STRAVA_REFRESH_TOKEN`
3. Start dev server and open `/running`.

If env vars are missing, the running page shows a fallback state.

## GitHub

Remote: `https://github.com/DHyukjuK/personal-website` (branch `main`).

## Deployment (Vercel)

1. Sign in at [vercel.com](https://vercel.com) (GitHub login is easiest).
2. **Add New… → Project** → import **`DHyukjuK/personal-website`**.
3. Framework defaults (Next.js) are fine. Click **Deploy**.
4. After the first deploy, open **Project → Settings → Environment Variables** and add the same keys as `.env.example` (production + preview if you want):
   - `STRAVA_*` (if you use `/running`)
   - `SPOTIFY_*` (if you use the home “now playing” block)
5. Redeploy from the **Deployments** tab so new env vars apply.

Optional: install globally with `npm i -g vercel`, then from this folder run `vercel` and follow the prompts to link the repo.
