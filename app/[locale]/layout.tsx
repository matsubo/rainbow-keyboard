import type { Metadata } from 'next'
import '../globals.css'
import { getDictionary } from '@/lib/dictionaries'
import { GTM, GTMNoscript } from '@/components/gtm'
import { locales, defaultLocale, bcp47, normalizeLocale, siteUrl } from '@/lib/i18n'

// Pre-render one static page per supported locale.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const current = normalizeLocale(locale)
  const dictionary = await getDictionary(current)

  // hreflang map for every supported locale + an x-default pointing at the default.
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [bcp47[l], `/${l}`]),
  )
  languages['x-default'] = `/${defaultLocale}`

  return {
    metadataBase: new URL(siteUrl),
    title: dictionary.title,
    description: dictionary.description,
    authors: [{ name: 'Yuki Matsukura', url: 'https://x.com/matsubokkuri' }],
    alternates: {
      canonical: `/${current}`,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: 'Rainbow Keyboard',
      title: dictionary.title,
      description: dictionary.description,
      url: `/${current}`,
      locale: bcp47[current],
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.title,
      description: dictionary.description,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const lang = normalizeLocale(locale)
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  // Keep no whitespace between <html>/<body> tags to avoid hydration errors.
  return (
    <html lang={lang}>
      <head>{gtmId && <GTM gtmId={gtmId} />}</head>
      <body>
        {gtmId && <GTMNoscript gtmId={gtmId} />}
        {children}
      </body>
    </html>
  )
}
