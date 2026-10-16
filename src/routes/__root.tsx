import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'

import { NotFoundPage } from '#/components/not-found-page'
import '../styles.css'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

function RootLayout() {
  return <Outlet />
}
