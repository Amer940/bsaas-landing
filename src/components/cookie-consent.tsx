import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  translations,
  localeFromPathname,
  localizePath,
} from '#/i18n/translations'
import {
  ANALYTICS_ENABLED,
  OPEN_CONSENT_EVENT,
  initAnalytics,
  readConsent,
  saveConsent,
  trackPageView,
} from '#/lib/analytics'
import type { Consent } from '#/lib/analytics'

/** Admin pages are never tracked and don't show the banner. */
const isAdmin = (pathname: string) =>
  pathname === '/admin' || pathname.startsWith('/admin/')

/**
 * Asks for consent to Google Analytics cookies, and sends page views once
 * given. Rendered only in the browser, so prerendered HTML has no banner.
 * It sits in the root shell, outside LocaleProvider, so it reads the locale
 * from the path itself.
 */
function CookieConsent() {
  const pathname = useLocation({ select: (l) => l.pathname })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!ANALYTICS_ENABLED) return
    initAnalytics()
    if (readConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  useEffect(() => {
    if (!isAdmin(pathname)) trackPageView(pathname)
  }, [pathname])

  if (!ANALYTICS_ENABLED || !open || isAdmin(pathname)) return null

  const locale = localeFromPathname(pathname)
  const t = translations[locale]

  const choose = (consent: Consent) => {
    saveConsent(consent)
    setOpen(false)
    if (consent === 'granted') trackPageView(pathname)
  }

  return (
    <div
      role="region"
      aria-label={t['cookies.title']}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-background/95 p-5 text-sm text-foreground/80 shadow-2xl backdrop-blur md:inset-x-auto md:right-6 md:bottom-6"
    >
      <p className="m-0 font-semibold text-foreground">{t['cookies.title']}</p>
      <p className="mt-2 mb-0 leading-relaxed">
        {t['cookies.body']}{' '}
        <a
          href={localizePath('/privacy', locale)}
          className="text-foreground underline underline-offset-2 hover:text-foreground/70"
        >
          {t['cookies.learnMore']}
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="default" onClick={() => choose('granted')}>
          {t['cookies.accept']}
        </Button>
        <Button
          size="default"
          variant="outline"
          onClick={() => choose('denied')}
        >
          {t['cookies.reject']}
        </Button>
      </div>
    </div>
  )
}

export { CookieConsent }
