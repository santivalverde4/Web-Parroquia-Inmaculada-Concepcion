# Parroquia de la Inmaculada Concepción

Bilingual parish website built with Next.js. Spanish pages start at `/`; English pages start at `/en`. The public site runs without a database and displays honest placeholder content until parish details and integrations are configured.

## Local setup

1. Use Node.js 24 or newer and run `npm install`.
2. Complete the local `.env` file with the database URLs and `AUTH_SECRET`. If it does not exist, copy `.env.example` to `.env` first.
3. Run `npm run db:deploy` to create the PostgreSQL tables.
4. Set `SEED_ADMIN_EMAIL` and a unique `SEED_ADMIN_PASSWORD`, then run `npm run db:seed`.
5. Run `npm run dev` and open `http://localhost:3000`.

The administrator signs in at `/admin/login`. The dashboard is organized in tabs: home text, mass schedule and services, contact details, history (text and photo gallery), and projects. Every tab shows where its content appears on the site. Content that has not been edited falls back to the defaults in `lib/parishInfo.ts`, `lib/history.ts`, and `lib/projects.ts`, so the public site never looks empty. `db:seed` creates or updates the administrator account; remove the seed password from the environment after use if it is not needed again.

## Optional integrations

- `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` show the latest channel videos.
- `FACEBOOK_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID` show recent page posts.
- `GOOGLE_MAPS_API_KEY` (optional) switches the location map to the official Maps Embed API, which is free. Without it the page uses Google Maps' keyless embed. The key ends up in the page HTML, so restrict it to the site's domain and to the Maps Embed API in Google Cloud. The parish coordinates live in `lib/services/maps.ts`.

API credentials stay on the server. When an integration is absent, its public page shows a placeholder.

## Checks

Run `npm run type-check`, `npm run lint`, and `npm run build`.
