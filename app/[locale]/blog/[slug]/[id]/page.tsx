import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BlogPostClient from "./BlogPostClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!post) return {};

  const title = isAr ? post.title_ar : post.title_en;
  const fallbackDescription = isAr ? post.excerpt_ar : post.excerpt_en;
  const description = (post.meta_description || fallbackDescription || "").slice(0, 160);
  const keywords = post.meta_keywords ? post.meta_keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : undefined;
  const urlPath = `${post.slug || "article"}/${post.id}`;
  const ogTitle = post.og_title || title;
  const ogDescription = post.og_description || description;
  const ogImage = post.og_image || post.image_url;

  return {
    title: isAr ? `${title} | عقار أونلاين` : `${title} | Aqar Online`,
    description,
    keywords,
    alternates: {
      canonical: post.canonical_url || `/${locale}/blog/${urlPath}`,
      languages: { ar: `/ar/blog/${urlPath}`, en: `/en/blog/${urlPath}` },
    },
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `https://www.aqqaronline.com/${locale}/blog/${urlPath}`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
      locale: isAr ? "ar_EG" : "en_US",
      type: "article",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: post.image_alt || title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}