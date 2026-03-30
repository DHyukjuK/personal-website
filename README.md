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

## Secrets and security

- **Never commit** `.env`, `.env.local`, or any file that contains real keys. This repo’s `.gitignore` already excludes them; keep `.env.example` as placeholders only.
- **Store secrets only** in Vercel **Project → Settings → Environment Variables** (Production / Preview) or in local `.env.local`. `STRAVA_*` is read **only on the server** (`lib/strava.ts`); API routes return **public data** (activity summaries), not your client secret or refresh token.
- **Do not** paste Client Secret, refresh tokens, or `.env` contents into chats, screenshots, or issues. If a secret is ever exposed, **rotate it** in the Strava API settings and update Vercel + `.env.local`.

## Deployment (Vercel)

1. Sign in at [vercel.com](https://vercel.com) (GitHub login is easiest).
2. **Add New… → Project** → import **`DHyukjuK/personal-website`**.
3. Framework defaults (Next.js) are fine. Click **Deploy**.
4. After the first deploy, open **Project → Settings → Environment Variables** and add the same keys as `.env.example` (production + preview if you want), e.g. `STRAVA_*` for `/running`.
5. Redeploy from the **Deployments** tab so new env vars apply.

Optional: install globally with `npm i -g vercel`, then from this folder run `vercel` and follow the prompts to link the repo.
