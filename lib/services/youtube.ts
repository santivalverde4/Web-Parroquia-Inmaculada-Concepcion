import { env } from "@/lib/env";

/**
 * Videos del canal de YouTube de la parroquia.
 *
 * Se leen de la lista de "subidas" del canal (playlistItems): cuesta 1
 * unidad de la cuota diaria de la API (search costaria 100) y devuelve los
 * videos en el orden exacto en que se publicaron.
 *
 * Sin YOUTUBE_API_KEY, o si la API falla, devuelve una lista vacia y la
 * pagina muestra el reproductor de la lista de subidas (ver
 * uploadsEmbedUrl), que no necesita key.
 */

/** Canal oficial: youtube.com/@parroquiainmaculadaconcepc4976 */
const PARISH_CHANNEL_ID = "UCpRrUdCoKniNe62Vl46ajIQ";

export const channelId = env.youtubeChannelId ?? PARISH_CHANNEL_ID;
export const channelUrl = `https://www.youtube.com/channel/${channelId}`;

/** La lista de subidas de un canal tiene el mismo ID con "UU" en vez de "UC". */
const uploadsPlaylistId = `UU${channelId.slice(2)}`;

/** Reproductor de la lista de subidas: siempre empieza por el video mas nuevo. */
export const uploadsEmbedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${uploadsPlaylistId}&rel=0`;

export type ParishVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  /** Miniatura grande para el video destacado. */
  poster: string | null;
  /** Miniatura mediana para las tarjetas. */
  thumbnail: string | null;
};

type Thumbnail = { url: string };
type PlaylistItem = {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: { videoId?: string };
    thumbnails?: Partial<
      Record<"medium" | "high" | "standard" | "maxres", Thumbnail>
    >;
  };
  contentDetails?: { videoPublishedAt?: string };
};

/** Videos que YouTube deja en la lista pero ya no se pueden ver. */
const unavailableTitles = new Set(["Private video", "Deleted video"]);

export async function getYouTubeVideos(limit = 7): Promise<ParishVideo[]> {
  const key = env.youtubeApiKey;
  if (!key) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.search = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId: uploadsPlaylistId,
    // Se piden unos de mas por si alguno es privado o fue borrado: asi la
    // grilla siempre se llena. Sigue costando 1 unidad de cuota.
    maxResults: String(Math.min(limit + 5, 50)),
    key,
  }).toString();

  try {
    // Se guarda una hora en cache: la pagina no consulta la API en cada visita.
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok)
      throw new Error(`YouTube API returned ${response.status}`);
    const data = (await response.json()) as { items?: PlaylistItem[] };
    const videos = (data.items ?? []).flatMap(({ snippet, contentDetails }) => {
      const id = snippet.resourceId.videoId;
      if (!id || unavailableTitles.has(snippet.title)) return [];
      const thumbs = snippet.thumbnails ?? {};
      return [
        {
          id,
          title: snippet.title,
          description: snippet.description,
          publishedAt: contentDetails?.videoPublishedAt ?? snippet.publishedAt,
          poster:
            (thumbs.maxres ?? thumbs.standard ?? thumbs.high)?.url ?? null,
          thumbnail: (thumbs.high ?? thumbs.medium)?.url ?? null,
        },
      ];
    });
    return videos.slice(0, limit);
  } catch (error) {
    console.error("Could not load YouTube videos", error);
    return [];
  }
}
