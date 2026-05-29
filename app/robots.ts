import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/i18n'

// Next.js App Router serves this at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
