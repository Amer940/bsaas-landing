import type { Locale } from '#/i18n/translations'

// Dates on the booking pages. Days are the shop's local dates ('YYYY-MM-DD',
// as bookable_days returns them) and times are minutes after the shop's
// midnight (as available_slots returns them), so nothing here depends on the
// visitor's own time zone.

const INTL_LOCALE: Record<Locale, string> = { bs: 'bs-BA', en: 'en-GB' }

/** Today's date at the shop. */
export function todayIn(timeZone: string, now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** A date key `days` later (or earlier, when negative). */
export function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function utcDate(day: string) {
  return new Date(`${day}T12:00:00Z`)
}

/** "pon" / "Mon" */
export function weekdayShort(day: string, locale: Locale) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(utcDate(day))
}

/** "25" */
export function dayOfMonth(day: string) {
  return String(Number(day.slice(8, 10)))
}

/** "novembar 2026" / "November 2026" */
export function monthLabel(day: string, locale: Locale) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcDate(day))
}

/** "srijeda, 25. novembar" / "Wednesday 25 November" */
export function longDay(day: string, locale: Locale) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(utcDate(day))
}

/** 570 → "09:30" */
export function minutesLabel(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** A booking's start, at the shop: "srijeda, 25. novembar 2026. u 09:30". */
export function startsAtParts(iso: string, timeZone: string, locale: Locale) {
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(date)
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(date)
  return { day, time }
}

/** 30 → "30 KM", 12.5 → "12,50 KM" / "12.50 KM". */
export function priceLabel(price: number, locale: Locale) {
  const whole = Number.isInteger(price)
  const amount = new Intl.NumberFormat(INTL_LOCALE[locale], {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price)
  return `${amount} KM`
}
