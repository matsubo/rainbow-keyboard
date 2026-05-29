// i18n contract layer — single source of truth for supported locales.
// Keep this list, the BCP-47 map, and the dictionaries/<locale>.json files in sync.

export const locales = ['en', 'ja', 'es', 'fr', 'de', 'zh', 'ko', 'pt', 'it'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

// Canonical site URL (env-overridable) lives in ./site; re-exported here so the
// i18n layer stays the single import surface for routing/metadata code.
export { siteUrl } from './site'

// BCP-47 language tags used for <html lang>, hreflang, OG locale, and speech synthesis.
export const bcp47: Record<Locale, string> = {
  en: 'en-US',
  ja: 'ja-JP',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ko: 'ko-KR',
  pt: 'pt-BR',
  it: 'it-IT',
}

// Human-readable names (in their own language) for UI such as a language switcher.
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ko: '한국어',
  pt: 'Português',
  it: 'Italiano',
}

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

// Normalize an arbitrary string to a supported Locale, falling back to the default.
export const normalizeLocale = (value: string | undefined): Locale =>
  value && isLocale(value) ? value : defaultLocale

// Resolve the BCP-47 tag for any locale-ish string.
export const speechLangFor = (value: string | undefined): string =>
  bcp47[normalizeLocale(value)]
