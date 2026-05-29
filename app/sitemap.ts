import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

// Next.js App Router serves this at /sitemap.xml.
// The app is a single-page experience served at the root route.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
