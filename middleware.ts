import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale, isLocale, type Locale } from '@/lib/i18n'

// Parse the Accept-Language header and pick the best supported locale.
// Falls back to the default locale when nothing matches.
function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language')
  if (!header) return defaultLocale

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q) : 1 }
    })
    .filter((entry) => Number.isFinite(entry.q))
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }
  return defaultLocale
}

function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (hasLocalePrefix(pathname)) return NextResponse.next()

  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Skip Next internals, API routes, and any path containing a dot (static files,
  // robots.txt, sitemap.xml, icons, manifest, etc.).
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
