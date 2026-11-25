import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AuthCard } from '#/components/auth-card'
import { BookingSummaryCard } from '#/components/booking/booking-summary'
import {
  CallShopButton,
  LoadFailed,
  Loading,
  Notice,
  StepTitle,
} from '#/components/booking/booking-ui'
import { Button } from '#/components/ui/button'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { localizePath } from '#/i18n/translations'
import {
  cancelBooking,
  fetchWebShop,
  getBooking,
  hintOf,
} from '#/lib/web-booking'
import type { BookingSummary } from '#/lib/web-booking'

// Where a web booking's cancel link lands. Opening it only reads the booking
// (a mail scanner opening the link first changes nothing); cancelling takes a
// tap and a confirm. Past the shop's cancel cutoff, the page says to call.

/** Bosnian shops; used if the shop's own zone can't be read. */
const FALLBACK_TIME_ZONE = 'Europe/Sarajevo'

export function CancelBookingPage({ token }: { token: string }) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const query = useQuery({
    queryKey: ['web-booking', 'cancel', token],
    queryFn: () => getBooking(token),
    retry: (count, error) => hintOf(error) === 'failed' && count < 2,
  })
  const shopCode = query.data?.booking.shop.code
  // BookingSummary has no time zone; the shop's comes from its booking link.
  const zone = useQuery({
    queryKey: ['web-booking', shopCode, 'shop'],
    queryFn: () => fetchWebShop(shopCode as string),
    enabled: !!shopCode,
  })
  const [cancelled, setCancelled] = useState<BookingSummary>()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tooLate, setTooLate] = useState(false)

  async function handleCancel() {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const result = await cancelBooking(token)
      setCancelled(result.booking)
    } catch (e) {
      const hint = hintOf(e)
      if (hint === 'cancel_too_late') setTooLate(true)
      else setError(c.errors[hint])
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  if (query.isPending || (shopCode && zone.isPending)) {
    return (
      <AuthCard homeLabel={c.home}>
        <Loading />
      </AuthCard>
    )
  }

  if (query.isError) {
    const hint = hintOf(query.error)
    return (
      <AuthCard homeLabel={c.home}>
        {hint === 'not_found' || hint === 'invalid_input' ? (
          <StepTitle body={c.notFoundBody}>{c.notFoundTitle}</StepTitle>
        ) : (
          <LoadFailed onRetry={() => void query.refetch()} />
        )}
      </AuthCard>
    )
  }

  const booking = cancelled ?? query.data.booking
  const timeZone = zone.data?.timezone ?? FALLBACK_TIME_ZONE
  const isCancelled = booking.status === 'cancelled'
  const canCancel = query.data.can_cancel && !isCancelled && !tooLate

  let title = c.cancelTitle
  let body: string | undefined = c.cancelBody
  if (cancelled) {
    title = c.cancelledTitle
    body = c.cancelledBody
  } else if (isCancelled) {
    title = c.alreadyCancelledTitle
    body = undefined
  } else if (booking.status !== 'booked') {
    title = c.pastTitle
    body = undefined
  } else if (!canCancel) {
    body = c.tooLateBody
  }

  return (
    <AuthCard homeLabel={c.home}>
      <div role={cancelled ? 'status' : undefined} className="animate-fade-up">
        <StepTitle body={body}>{title}</StepTitle>
      </div>
      <div className="mt-6">
        <BookingSummaryCard booking={booking} timeZone={timeZone} />
      </div>

      {error ? <Notice className="mt-5">{error}</Notice> : null}

      {canCancel ? (
        confirming ? (
          <div className="mt-7">
            <p className="m-0 text-base font-bold">{c.cancelConfirm}</p>
            <div className="mt-4 flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                onClick={() => void handleCancel()}
                disabled={busy}
              >
                {busy ? c.cancelling : c.cancelButton}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => setConfirming(false)}
                disabled={busy}
              >
                {c.keepButton}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="mt-7 w-full"
            onClick={() => setConfirming(true)}
          >
            {c.cancelButton}
          </Button>
        )
      ) : booking.status === 'booked' && !cancelled ? (
        <CallShopButton phone={booking.shop.phone} className="mt-7" />
      ) : null}

      {cancelled || isCancelled ? (
        <Button asChild variant="outline" size="lg" className="mt-7 w-full">
          <a href={localizePath(`/book/${booking.shop.code}`, locale)}>
            {c.bookAgain}
          </a>
        </Button>
      ) : null}
    </AuthCard>
  )
}
