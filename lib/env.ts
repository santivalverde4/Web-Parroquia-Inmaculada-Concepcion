import "server-only";

function optional(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export const env = {
  databaseUrl: optional("DATABASE_URL"),
  directUrl: optional("DIRECT_URL"),
  authSecret: optional("AUTH_SECRET") ?? optional("NEXTAUTH_SECRET"),
  youtubeApiKey: optional("YOUTUBE_API_KEY"),
  youtubeChannelId: optional("YOUTUBE_CHANNEL_ID"),
  facebookAccessToken: optional("FACEBOOK_ACCESS_TOKEN"),
  facebookPageId: optional("FACEBOOK_PAGE_ID"),
  googleMapsApiKey: optional("GOOGLE_MAPS_API_KEY"),
  parishMapQuery: optional("PARISH_MAP_QUERY"),
} as const;

export const hasDatabase = Boolean(env.databaseUrl);
export const hasAdminConfiguration = Boolean(env.databaseUrl && env.authSecret);
