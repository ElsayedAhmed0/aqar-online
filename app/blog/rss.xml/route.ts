import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function escapeXml(str: string) {
    return (str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET() {
    const baseUrl = "https://www.aqqaronline.com";
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(50);

    const items = (posts || [])
        .map((post) => {
            const urlPath = post.slug || post.id;
            const link = `${baseUrl}/ar/blog/${urlPath}`;
            return `
    <item>
      <title>${escapeXml(post.title_ar)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.meta_description || post.excerpt_ar || "")}</description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${post.image_url ? `<enclosure url="${escapeXml(post.image_url)}" type="image/jpeg" />` : ""}
    </item>`;
        })
        .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>عقار أونلاين | Aqar Online — المدونة العقارية</title>
    <link>${baseUrl}/ar/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>أحدث المقالات والنصائح العقارية من عقار أونلاين</description>
    <language>ar</language>${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
}