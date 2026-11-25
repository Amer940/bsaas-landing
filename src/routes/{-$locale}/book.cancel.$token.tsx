import { createFileRoute } from '@tanstack/react-router'
import { CancelBookingPage } from '#/components/booking/cancel-booking'
import { bookContent } from '#/content/book'
import { noindexHead } from '#/i18n/seo'
import { routeLocale } from '#/i18n/translations'

// The cancel link in a web booking's emails: chairo.app/book/cancel/<token>
// (/en/... for bookings made in English). See CancelBookingPage.

export const Route = createFileRoute('/{-$locale}/book/cancel/$token')({
  // Reads its link in the browser; never prerendered, kept out of search.
  ssr: false,
  head: ({ params }) =>
    noindexHead(bookContent[routeLocale(params.locale)].cancelMetaTitle),
  component: CancelPage,
})

function CancelPage() {
  const { token } = Route.useParams()
  return <CancelBookingPage token={token} />
}
