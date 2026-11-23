/**
 * Google Analytics 4, loaded only after the visitor accepts analytics
 * cookies in the consent banner. Without consent (or without a measurement
 * ID) no Google script is requested and no cookie is set.
 */

const GA_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID

export const ANALYTICS_ENABLED = import.meta.env.PROD && Boolean(GA_ID)

export type Consent = 'granted' | 'denied'

/** Bump to ask everyone again (e.g. after adding a new kind of cookie). */
const STORAGE_KEY = 'chairo-cookie-consent-v1'

/** Fired by the footer's "Cookie settings" link to reopen the banner. */
export const OPEN_CONSENT_EVENT = 'chairo:open-cookie-settings'

declare global {
  interface Window {
    dataLayer?: Array<unknown>
    gtag?: (...args: Array<unknown>) => void
  }
}

// Kept in memory too, for browsers that block storage.
let memoryConsent: Consent | null = null

export function readConsent(): Consent | null {
  if (memoryConsent) return memoryConsent
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function saveConsent(consent: Consent) {
  memoryConsent = consent
  try {
    localStorage.setItem(STORAGE_KEY, consent)
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
  if (consent === 'granted') loadAnalytics()
  else disableAnalytics()
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}

let loaded = false

function loadAnalytics() {
  if (!ANALYTICS_ENABLED || !GA_ID) return
  ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false
  if (loaded) {
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    return
  }
  loaded = true

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself, not an array.
    window.dataLayer!.push(arguments)
  }
  // Analytics only; nothing is used for ads.
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.gtag('js', new Date())
  // Page views are sent by trackPageView on every route change.
  window.gtag('config', GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

function disableAnalytics() {
  if (!GA_ID) return
  ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  // Remove the _ga cookies set while consent was given.
  const host = location.hostname
  const domains = [
    '',
    host,
    `.${host}`,
    `.${host.split('.').slice(-2).join('.')}`,
  ]
  for (const name of document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())) {
    if (!name.startsWith('_ga')) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
}

/** Restores analytics on page load if the visitor accepted earlier. */
export function initAnalytics() {
  if (readConsent() === 'granted') loadAnalytics()
}

/**
 * Sends a page view for the current path. The query string and hash are left
 * out: sign-in and reset links carry tokens there.
 */
export function trackPageView(pathname: string) {
  if (!loaded || !GA_ID || readConsent() !== 'granted') return
  window.gtag?.('event', 'page_view', {
    page_location: `${location.origin}${pathname}`,
    page_path: pathname,
    page_title: document.title,
  })
}
