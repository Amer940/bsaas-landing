import type { IndexedPage } from './pages'
import type { Locale } from './translations'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, localizePath } from './translations'

const OG_LOCALE: Record<Locale, string> = { bs: 'bs_BA', en: 'en_US' }

/**
 * `head()` for a public page: title, description, share tags, canonical URL
 * and hreflang alternates. The site-wide tags are in routes/__root.tsx.
 */
export function pageHead({
  locale,
  page,
  title,
  description,
}: {
  locale: Locale
  page: IndexedPage
  title: string
  description: string
}) {
  const url = SITE_URL + localizePath(page, locale)
  const image = `${SITE_URL}/og-image-${locale}.jpg`

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:locale', content: OG_LOCALE[locale] },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { name: 'twitter:image', content: image },
    ],
    links: [
      { rel: 'canonical', href: url },
      ...LOCALES.map((l) => ({
        rel: 'alternate',
        hrefLang: l,
        href: SITE_URL + localizePath(page, l),
      })),
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: SITE_URL + localizePath(page, DEFAULT_LOCALE),
      },
    ],
  }
}

/** `head()` for a page kept out of search results (auth links, 404, admin). */
export function noindexHead(title: string) {
  return {
    meta: [{ title }, { name: 'robots', content: 'noindex' }],
  }
}

/** A `<script type="application/ld+json">` entry for `head().scripts`. */
export function jsonLdScript(data: unknown) {
  return {
    type: 'application/ld+json',
    // Inserted as raw HTML: `<` escaped so the JSON can't end the tag.
    children: JSON.stringify(data).replace(/</g, '\\u003c'),
  }
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

const HOME_LABEL: Record<Locale, string> = { bs: 'Početna', en: 'Home' }

/**
 * Schema.org data for a page under the home page: the page itself (as
 * `type`, e.g. ContactPage) and its breadcrumb trail.
 */
export function subpageSchema({
  locale,
  page,
  name,
  description,
  type = 'WebPage',
}: {
  locale: Locale
  page: IndexedPage
  name: string
  description: string
  type?: string
}) {
  const url = SITE_URL + localizePath(page, locale)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': type,
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORGANIZATION_ID },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: HOME_LABEL[locale],
            item: SITE_URL + localizePath('/', locale),
          },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  }
}
