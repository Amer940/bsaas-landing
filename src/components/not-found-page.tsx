import { useLocation } from '@tanstack/react-router'
import { AuthCard } from '#/components/auth-card'
import { Button } from '#/components/ui/button'
import { notFoundContent } from '#/content/not-found'
import { LocaleProvider } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import { DEFAULT_LOCALE, LOCALES } from '#/i18n/translations'
import type { Locale } from '#/i18n/translations'

/**
 * Any URL no route matches, including a bad locale prefix. Rendered from the
 * root route, above the `{-$locale}` layout, so the locale is read off the
 * path itself: `/en/...` is English, everything else Bosnian.
 *
 * Pages serves index.html for every path, so this still answers 200; the
 * noindex from AuthCard keeps it out of search results.
 */
function NotFoundPage() {
  const first = useLocation({ select: (l) => l.pathname.split('/')[1] })
  const locale: Locale =
    first !== DEFAULT_LOCALE &&
    (LOCALES as ReadonlyArray<string>).includes(first)
      ? (first as Locale)
      : DEFAULT_LOCALE
  const c = notFoundContent[locale]

  return (
    <LocaleProvider locale={locale}>
      <AuthCard metaTitle={c.metaTitle} homeLabel={c.home}>
        <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
          {c.title}
        </h1>
        <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
          {c.body}
        </p>
        <Button asChild variant="outline" className="mt-7">
          <LocalizedLink to="/">{c.home}</LocalizedLink>
        </Button>
      </AuthCard>
    </LocaleProvider>
  )
}

export { NotFoundPage }
