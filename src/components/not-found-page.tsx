import { useEffect } from 'react'
import { ClientOnly, useLocation } from '@tanstack/react-router'
import { AuthCard } from '#/components/auth-card'
import { Button } from '#/components/ui/button'
import { notFoundContent } from '#/content/not-found'
import { LocaleProvider } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import { localeFromPathname } from '#/i18n/translations'

/**
 * Any URL no route matches, including a bad locale prefix. Rendered from the
 * root route, above the `{-$locale}` layout, so the locale is read off the
 * path itself: `/en/...` is English, everything else Bosnian.
 *
 * Cloudflare Pages answers such paths with 404.html (the app shell) and a
 * 404 status, which keeps it out of search results. That shell has no page
 * in it, so this renders only once the app has taken over (ClientOnly).
 */
function NotFoundPage() {
  return (
    <ClientOnly>
      <NotFoundContent />
    </ClientOnly>
  )
}

function NotFoundContent() {
  const locale = useLocation({ select: (l) => localeFromPathname(l.pathname) })
  const c = notFoundContent[locale]

  // No route of its own to give it a head().
  useEffect(() => {
    document.title = c.metaTitle
  }, [c.metaTitle])

  return (
    <LocaleProvider locale={locale}>
      <AuthCard homeLabel={c.home}>
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
