# Flight Deal Finder

Build a SaaS landing page + authenticated app shell for Flight Price Notifier (機票降價通知), a product that watches popular flight routes from Taipei and emails the user when the cheapest fare drops to or below their target price — targeted at budget-driven travelers who don't care exactly when they fly, they just want a ticket under their budget.

## Development

The backend is the Supabase project `wrykkeiqgscgmcpcfbxe`. `.env` holds its URL and publishable key (browser-safe; access is gated by row-level security). The database schema is in `drizzle/migrations/`.

Plain Vite + React single-page app with React Router (no SSR). Prefer working locally? You need [Bun](https://bun.sh) (or Node.js and npm).

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

`bun run build` (`vite build`) writes a static site to `dist/`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/sign-in` | Sign in (`/auth` is kept as an alias for older email/OAuth redirects) |
| `/sign-up` | Create an account |
| `/app` | Price alerts dashboard (signed-in only; `/dashboard` redirects here) |

## Deploying to Vercel

Import the repository in Vercel; `vercel.json` sets the Vite build, the `dist/` output, and a rewrite to `index.html` so deep links like `/app` resolve client-side. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (same values as `.env`) in the project's environment variables, and add the Vercel domain's `/sign-in` URL to the Supabase auth redirect allow list.
