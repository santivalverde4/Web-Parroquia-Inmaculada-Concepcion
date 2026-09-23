export type ParishPost = { id: string; message: string; createdAt: string; url: string | null };

const samplePosts: ParishPost[] = [
  { id: "sample", message: "Próximamente publicaremos noticias y actividades de la parroquia.", createdAt: "", url: null },
];

export async function getFacebookPosts(): Promise<ParishPost[]> {
  const token = env.facebookAccessToken;
  const pageId = env.facebookPageId;
  if (!token || !pageId) return samplePosts;

  const url = new URL(`https://graph.facebook.com/v23.0/${encodeURIComponent(pageId)}/posts`);
  url.search = new URLSearchParams({ fields: "id,message,created_time,permalink_url", limit: "6", access_token: token }).toString();
  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error(`Facebook API returned ${response.status}`);
    const data = await response.json() as { data?: Array<{ id: string; message?: string; created_time: string; permalink_url?: string }> };
    return data.data?.filter((post) => post.message).map((post) => ({
      id: post.id, message: post.message ?? "", createdAt: post.created_time, url: post.permalink_url ?? null,
    })) ?? [];
  } catch (error) {
    console.error("Could not load Facebook posts", error);
    return samplePosts;
  }
}
import { env } from "@/lib/env";
