export type ParishVideo = { id: string; title: string; description: string; thumbnail: string | null };

const sampleVideos: ParishVideo[] = [
  { id: "", title: "Próximamente: celebraciones parroquiales", description: "Los videos aparecerán cuando se configure el canal de YouTube.", thumbnail: null },
];

export async function getYouTubeVideos(): Promise<ParishVideo[]> {
  const key = env.youtubeApiKey;
  const channelId = env.youtubeChannelId;
  if (!key || !channelId) return sampleVideos;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.search = new URLSearchParams({ part: "snippet", channelId, type: "video", order: "date", maxResults: "6", key }).toString();
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`YouTube API returned ${response.status}`);
    const data = await response.json() as { items?: Array<{ id: { videoId?: string }; snippet: { title: string; description: string; thumbnails?: { medium?: { url: string } } } }> };
    return data.items?.flatMap((item) => item.id.videoId ? [{
      id: item.id.videoId, title: item.snippet.title, description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url ?? null,
    }] : []) ?? [];
  } catch (error) {
    console.error("Could not load YouTube videos", error);
    return sampleVideos;
  }
}
import { env } from "@/lib/env";
