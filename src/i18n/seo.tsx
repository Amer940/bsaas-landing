import { useLocation } from '@tanstack/react-router'
import { useLocale } from './locale-context'
import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_URL,
  localizePath,
  unlocalizePath,
} from './translations'

interface SeoProps {
  title: string
  description?: string
}

/**
 * Page title, description, canonical URL and hreflang alternates.
 * React 19 hoists these tags into <head>.
 */
function Seo({ title, description }: SeoProps) {
  const { locale } = useLocale()
  const path = unlocalizePath(useLocation({ select: (l) => l.pathname }))

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={SITE_URL + localizePath(path, locale)} />
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
