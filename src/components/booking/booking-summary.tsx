import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { priceLabel, startsAtParts } from '#/lib/booking-time'
import type { BookingSummary } from '#/lib/web-booking'

/** A booking's reference, time, barber, service and shop, as one card. */
export function BookingSummaryCard({
  booking,
  timeZone,
}: {
  booking: BookingSummary
  timeZone: string
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const { day, time } = startsAtParts(booking.starts_at, timeZone, locale)
  const phone = booking.shop.phone

  const rows: Array<[string, React.ReactNode]> = [
    [c.when, `${day} ${c.at} ${time}`],
    [c.barber, booking.barber_name],
    [
      c.service,
      `${booking.service_name} · ${priceLabel(booking.price, locale)}`,
    ],
    [
      c.shop,
      <>
        {booking.shop.name}
        {booking.shop.address ? (
          <span className="block text-foreground/65">
            {booking.shop.address}
          </span>
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            className="block text-foreground/65 underline underline-offset-4"
          >
            {phone}
          </a>
        ) : null}
      </>,
    ],
  ]

  return (
    <div className="rounded-2xl bg-white/8 px-5 py-4">
      <span className="text-sm text-foreground/65">{c.reference}</span>
      <p className="m-0 mt-0.5 text-2xl font-extrabold tracking-[0.12em]">
        {booking.reference}
      </p>
      <dl className="m-0 mt-4 flex flex-col gap-3 border-t border-white/8 pt-4">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-foreground/50">{label}</dt>
            <dd className="m-0 mt-0.5 text-base leading-normal">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
