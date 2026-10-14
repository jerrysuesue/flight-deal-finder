# Flight Deal Finder

Build a SaaS landing page + authenticated app shell for Flight Price Notifier (機票降價通知), a product that watches popular flight routes from Taipei and emails the user when the cheapest fare drops to or below their target price — targeted at budget-driven travelers who don't care exactly when they fly, they just want a ticket under their budget.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/40bd0388-67d8-40c4-ace6-6a8c39ced2c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

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

Import the repository in Vercel; `vercel.json` sets the Vite build, the `dist/` output, and a rewrite to `index.html` so deep links like `/app` resolve client-side. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID` in the project's environment variables, and add the Vercel domain's `/sign-in` URL to the Supabase auth redirect allow list.
