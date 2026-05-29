import Link from "next/link"
import { locales, localeNames, type Locale } from "@/lib/i18n"

interface LanguageSwitcherProps {
  current: Locale
  label: string
}

// Each locale is its own page at /<locale>, so a plain link swaps language.
export default function LanguageSwitcher({ current, label }: LanguageSwitcherProps) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {locales.map((locale) => {
        const isCurrent = locale === current
        return (
          <Link
            key={locale}
            href={`/${locale}`}
            hrefLang={locale}
            aria-current={isCurrent ? "page" : undefined}
            className={
              isCurrent
                ? "text-gray-300"
                : "text-gray-600 hover:text-gray-300"
            }
          >
            {localeNames[locale]}
          </Link>
        )
      })}
    </nav>
  )
}
