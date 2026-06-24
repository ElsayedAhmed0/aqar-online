import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BlogPostClient from "./BlogPostClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title_ar, title_en, excerpt_ar, excerpt_en, image_url")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!post) return {};

  const title = isAr ? post.title_ar : post.title_en;
  const description = isAr ? post.excerpt_ar : post.excerpt_en;

  return {
    title: isAr ? `${title} | عقار أونلاين` : `${title} | Aqar Online`,
    description,
    alternates: {
      canonical: `/${locale}/blog/${id}`,
      languages: { ar: `/ar/blog/${id}`, en: `/en/blog/${id}` },
    },
    openGraph: {
      title,
      description,
      url: `https://www.aqqaronline.com/${locale}/blog/${id}`,
      siteName: isAr ? "عقار أونلاين" : "Aqar Online",
      locale: isAr ? "ar_EG" : "en_US",
      type: "article",
      images: post.image_url
        ? [{ url: post.image_url, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}