import KeyboardDisplay from '@/components/keyboard-display'
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
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-0 overflow-hidden relative">
      <h1 className="sr-only">{dictionary.heading}</h1>
      <KeyboardDisplay dictionary={dictionary} speechLang={speechLangFor(current)} />
      <GoogleAnalytics gaId="G-WX3ZJHM72Z" />
      <footer className="fixed bottom-4 right-4 text-xs text-gray-600 z-10">
        <span>v{version}</span>
        <span className="mx-2">|</span>
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-200"
        >
          GitHub
        </Link>
      </footer>
    </main>
  )
}
