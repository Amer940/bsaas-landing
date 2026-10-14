import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import { LocaleProvider } from '#/i18n/locale-context'
import { localeFromParam } from '#/i18n/translations'
import type { Locale } from '#/i18n/translations'

export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    if (!localeFromParam(params.locale)) throw notFound()
  },
  component: LocaleLayout,
})

function LocaleLayout() {
  const { locale } = Route.useParams()

  return (
    <LocaleProvider locale={localeFromParam(locale) as Locale}>
      <Outlet />
    </LocaleProvider>
  )
}
