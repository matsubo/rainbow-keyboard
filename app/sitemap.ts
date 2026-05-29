import type { MetadataRoute } from 'next'
import { locales, siteUrl, bcp47, defaultLocale } from '@/lib/i18n'

// Next.js App Router serves this at /sitemap.xml.
// One entry per locale, each declaring the full set of hreflang alternates.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [bcp47[locale], `${siteUrl}/${locale}`]),
  )

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }))
}
