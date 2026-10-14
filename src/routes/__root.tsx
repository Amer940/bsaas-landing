import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'

import { LocaleProvider } from '#/i18n/locale-context'

import '../styles.css'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <LocaleProvider>
      <Outlet />
    </LocaleProvider>
  )
}
