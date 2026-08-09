import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AREAS } from '@/lib/data/areas'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.aqqaronline.com'

  // جيب كل العقارات المعتمدة من Supabase
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('listings')
    .select('id, updated_at')
    .eq('status', 'approved')

  const propertyUrls: MetadataRoute.Sitemap = (properties || []).flatMap((p) => [
    {
      url: `${baseUrl}/ar/properties/${p.id}`,
      lastModified: new Date(p.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/properties/${p.id}`,
      lastModified: new Date(p.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ])

  const areaUrls: MetadataRoute.Sitemap = AREAS.flatMap((area) => [
    {
      url: `${baseUrl}/ar/properties/area/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/en/properties/area/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
  ])

  // جيب كل مقالات المدونة المنشورة
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, updated_at, created_at')
    .eq('published', true)

  const blogUrls: MetadataRoute.Sitemap = (posts || []).flatMap((post) => {
    const urlPath = post.slug || post.id
    return [
      {
        url: `${baseUrl}/ar/blog/${urlPath}`,
        lastModified: new Date(post.updated_at || post.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/en/blog/${urlPath}`,
        lastModified: new Date(post.updated_at || post.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ]
  })

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/ar`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ar/properties`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/en/properties`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/ar/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/ar/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/ar/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/en/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...areaUrls,
    ...blogUrls,
    ...propertyUrls,
  ]
}