import { createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AuthCard } from '#/components/auth-card'
import { BookingFlow, ShopUnavailable } from '#/components/booking/booking-flow'
import { LoadFailed, Loading } from '#/components/booking/booking-ui'
import { NotFoundPage } from '#/components/not-found-page'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { noindexHead } from '#/i18n/seo'
import { routeLocale } from '#/i18n/translations'
import { fetchWebShop } from '#/lib/web-booking'

// A shop's booking link: chairo.app/book/<shop code>, what an owner pastes
// into their Google Business Profile. The page loads for anyone, with no
// captcha or sign-in (Google's link checker has to load it); Turnstile only
// runs in front of sending a code. An unknown code is the site's 404; a shop
// that can't take web bookings right now shows how to reach it instead.

// Same shape the server enforces (businesses_referral_code_format).
const CODE_FORMAT = /^[A-Z0-9-]{4,20}$/

function normalizeCode(code: string) {
  return code.replace(/\s/g, '').toUpperCase()
}

export const Route = createFileRoute('/{-$locale}/book/$code')({
  // Reads its link in the browser; never prerendered, kept out of search.
  ssr: false,
  head: ({ params }) =>
    noindexHead(bookContent[routeLocale(params.locale)].metaTitle),
  beforeLoad: ({ params }) => {
    if (!CODE_FORMAT.test(normalizeCode(params.code))) throw notFound()
  },
  component: BookPage,
})

function BookPage() {
  const code = normalizeCode(Route.useParams().code)
  const { locale } = useLocale()
  const c = bookContent[locale]
  const query = useQuery({
    queryKey: ['web-booking', code, 'shop'],
    queryFn: () => fetchWebShop(code),
    // Read fresh on each visit: the owner may have switched booking off.
    // Not again on focus: coming back from the mail app mid-booking must
    // not reload the page under the person.
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  if (query.isSuccess && !query.data) return <NotFoundPage />

  return (
    <AuthCard homeLabel={c.home}>
      {/* Once the shop is read, a later failed refetch keeps the page. */}
      {query.data ? (
        query.data.bookable ? (
          // TODO: web booking should also need the shop's active subscription
          // once subscriptions have a backend (web_booking_shop's `bookable`).
          <BookingFlow code={code} shop={query.data} />
        ) : (
          <ShopUnavailable shop={query.data} />
        )
      ) : query.isError ? (
        <LoadFailed onRetry={() => void query.refetch()} />
      ) : (
        <Loading />
      )}
    </AuthCard>
  )
}
