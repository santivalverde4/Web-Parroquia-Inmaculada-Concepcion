# Parroquia de la Inmaculada Concepción

Bilingual parish website built with Next.js. Spanish pages start at `/`; English pages start at `/en`. The public site runs without a database and displays honest placeholder content until parish details and integrations are configured.

## Local setup

1. Use Node.js 24 or newer and run `npm install`.
2. Complete the local `.env` file with the database URLs and `AUTH_SECRET`. If it does not exist, copy `.env.example` to `.env` first.
3. Run `npm run db:deploy` to create the PostgreSQL tables.
4. Set `SEED_ADMIN_EMAIL` and a unique `SEED_ADMIN_PASSWORD`, then run `npm run db:seed`.
5. Run `npm run dev` and open `http://localhost:3000`.

The administrator signs in at `/admin/login`. The dashboard edits the home and history content in both languages, adds history photo links, and creates or edits projects. `db:seed` creates or updates the administrator account; remove the seed password from the environment after use if it is not needed again.

## Optional integrations

- `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` show the latest channel videos.
- `FACEBOOK_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID` show recent page posts.
- `PARISH_MAP_QUERY` sets the confirmed parish address. `GOOGLE_MAPS_API_KEY` additionally enables the static map image.

API credentials stay on the server. When an integration is absent, its public page shows a placeholder. Set `PARISH_MAP_QUERY` only after confirming the actual address.

## Checks

Run `npm run type-check`, `npm run lint`, and `npm run build`.
