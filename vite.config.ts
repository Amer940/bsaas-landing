import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { landingContent } from './src/content/landing'
import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_URL,
  localizePath,
} from './src/i18n/translations'
import type { Locale } from './src/i18n/translations'

/** Unlocalized paths of the `{-$locale}` routes. */
const PAGES = [
  '/',
  '/privacy',
  '/terms',
  '/support',
  '/delete-account',
  '/delete-account/confirm',
  '/reset-password',
  '/email-changed',
]

const OG_LOCALE: Record<Locale, string> = { bs: 'bs_BA', en: 'en_US' }

/** Sets the content of `<meta property|name="key" content="...">`. */
function setMeta(html: string, key: string, content: string) {
  const escaped = content.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  return html.replace(
    new RegExp(`(<meta\\s+(?:property|name)="${key}"\\s+content=")[^"]*(")`),
    `$1${escaped}$2`,
  )
}

/**
 * Writes an HTML file per locale and page (`en.html`, `en/privacy.html`, …)
 * with that locale's lang, title and share tags, so link-preview crawlers
 * that don't run JS see the right language. The app itself is unchanged.
 */
function localeHtml(): Plugin {
  return {
    name: 'locale-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      if (!('index.html' in bundle)) return
      const asset = bundle['index.html']
      if (asset.type !== 'asset') return
      const template = String(asset.source)

      for (const locale of LOCALES) {
        const { title, description } = landingContent[locale].meta
        const image = `${SITE_URL}/og-image-${locale}.jpg`

        for (const page of PAGES) {
          const path = localizePath(page, locale)
          let html = template
            .replace(/<html lang="[^"]*">/, `<html lang="${locale}">`)
            .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
          html = setMeta(html, 'description', description)
          html = setMeta(html, 'og:locale', OG_LOCALE[locale])
          html = setMeta(html, 'og:url', SITE_URL + path)
          html = setMeta(html, 'og:title', title)
          html = setMeta(html, 'og:description', description)
          html = setMeta(html, 'og:image', image)
          html = setMeta(html, 'twitter:image', image)

          if (locale === DEFAULT_LOCALE && page === '/') {
            asset.source = html
          } else {
            this.emitFile({
              type: 'asset',
              fileName: `${path.slice(1)}.html`,
              source: html,
            })
          }
        }
      }
    },
  }
}

const config = defineConfig({
  plugins: [tailwindcss(), TanStackRouterVite(), viteReact(), localeHtml()],
})

export default config
