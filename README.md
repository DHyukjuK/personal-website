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

## Deployment (Vercel)

1. Import this repo into Vercel.
2. Add Strava environment variables in project settings.
3. Deploy.
