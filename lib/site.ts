// Canonical site URL, overridable per environment.
// Falls back to the production domain when the env var is unset.
const DEFAULT_SITE_URL = 'https://rainbow-keyboard.teraren.com'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '')
