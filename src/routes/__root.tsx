import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { QueryClient } from '@tanstack/react-query'

import { NotFoundPage } from '#/components/not-found-page'
import {
  DEFAULT_LOCALE,
  SITE_URL,
  localeFromPathname,
} from '#/i18n/translations'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Site-wide tags. Pages add their own title, description, canonical and
  // share tags (see i18n/seo.ts); a page's meta replaces one set here.
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Chairo' },
      {
        property: 'og:image',
        content: `${SITE_URL}/og-image-${DEFAULT_LOCALE}.jpg`,
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { title: 'Chairo' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
  component: Outlet,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: ReactNode }) {
  const locale = useLocation({ select: (l) => localeFromPathname(l.pathname) })

  return (
    // The app shell (see vite.config.ts) is built once, in Bosnian, for pages
    // in either language; LocaleProvider corrects `lang` there after load.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
