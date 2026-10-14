import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useLocale } from './locale-context'
import type { Locale } from './translations'
import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_URL,
  localizePath,
  unlocalizePath,
} from './translations'

const OG_LOCALE: Record<Locale, string> = { bs: 'bs_BA', en: 'en_US' }

interface SeoProps {
  title: string
  description?: string
}

/** Sets the content of a share-preview meta tag declared in index.html. */
function setMeta(attr: 'property' | 'name', key: string, content: string) {
  document
    .querySelector(`meta[${attr}="${key}"]`)
    ?.setAttribute('content', content)
}

/**
 * Page title, description, canonical URL and hreflang alternates.
 * React 19 hoists these tags into <head>. Open Graph / Twitter tags live
 * statically in index.html (for crawlers that don't run JS) and are
 * updated in place here so they aren't duplicated.
 */
function Seo({ title, description }: SeoProps) {
  const { locale } = useLocale()
  const path = unlocalizePath(useLocation({ select: (l) => l.pathname }))
  const url = SITE_URL + localizePath(path, locale)

  useEffect(() => {
    const image = `${SITE_URL}/og-image-${locale}.jpg`
    setMeta('property', 'og:locale', OG_LOCALE[locale])
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:title', title)
    if (description) setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:image', image)
  }, [locale, url, title, description])

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {LOCALES.map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={l}
          href={SITE_URL + localizePath(path, l)}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={SITE_URL + localizePath(path, DEFAULT_LOCALE)}
      />
    </>
  )
}

export { Seo }
