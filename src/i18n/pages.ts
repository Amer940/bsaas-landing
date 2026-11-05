import { DEFAULT_LOCALE, LOCALES, SITE_URL, localizePath } from './translations'

/**
 * The public pages, prerendered at build time for every locale and listed in
 * sitemap.xml with their language versions (see vite.config.ts). The other
 * routes render in the browser only (`ssr: false`) and are kept out of
 * search results.
 */
export const INDEXED_PAGES = [
  '/',
  '/privacy',
  '/terms',
  '/support',
  '/delete-account',
] as const

export type IndexedPage = (typeof INDEXED_PAGES)[number]

/** `pages` for tanstackStart(): one entry per page and locale, and llms.txt. */
export function prerenderPages() {
  const llmsTxt = {
    path: '/llms.txt',
    prerender: { enabled: true },
    sitemap: { exclude: true },
  }
  return [
    ...INDEXED_PAGES.flatMap((page) => {
      const alternateRefs = [
        ...LOCALES.map((locale) => ({
          hreflang: locale,
          href: SITE_URL + localizePath(page, locale),
        })),
        {
          hreflang: 'x-default',
          href: SITE_URL + localizePath(page, DEFAULT_LOCALE),
        },
      ]
      return LOCALES.map((locale) => ({
        path: localizePath(page, locale),
        prerender: { enabled: true },
        sitemap: { alternateRefs },
      }))
    }),
    llmsTxt,
  ]
}
