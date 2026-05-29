import KeyboardDisplay from '@/components/keyboard-display'
import LanguageSwitcher from '@/components/language-switcher'
import { getDictionary } from '@/lib/dictionaries'
import { GoogleAnalytics } from '@next/third-parties/google'
import Link from 'next/link'
import { normalizeLocale, speechLangFor } from '@/lib/i18n'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const current = normalizeLocale(locale)
  const dictionary = await getDictionary(current)
  const version = process.env.npm_package_version || '0.1.0'
  const githubUrl = 'https://github.com/matsubo/rainbow-keyboard'

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black p-0">
      <h1 className="sr-only">{dictionary.heading}</h1>
      <KeyboardDisplay dictionary={dictionary} speechLang={speechLangFor(current)} />
      <GoogleAnalytics gaId="G-WX3ZJHM72Z" />
      <footer className="fixed bottom-3 left-3 z-10 flex flex-col gap-1 text-xs text-gray-600">
        <LanguageSwitcher current={current} label={dictionary.language} />
        <div className="flex items-center gap-2">
          <span>v{version}</span>
          <span>|</span>
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            GitHub
          </Link>
        </div>
      </footer>
    </main>
  )
}
