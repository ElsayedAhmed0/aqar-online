import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/*/admin',
        '/*/dashboard',
        '/*/login',
        '/*/register',
        '/*/forgot-password',
        '/*/reset-password',
        '/*/profile',
        '/*/wishlist',
        '/*/add-listing',
      ],
    },
    sitemap: 'https://www.aqqaronline.com/sitemap.xml',
  }
}