import type { Locale } from '#/i18n/translations'

// Web booking: the booking link chairo.app/book/<shop code> and the cancel
// link from the confirmation email (book/cancel/<token>). The contract is in
// the app repo, docs/plans/web-booking.md §2: public read RPCs for the
// shop, barbers, services, days and times, and the Edge Function
// `web-booking` (supabase/functions/web-booking) for everything that writes.
//
// The Supabase client is loaded on first use, as in waitlist.ts.

async function client() {
  return (await import('./supabase')).supabase
}

/** Every refusal the server gives a reason for. Anything else is `failed`. */
export const BOOKING_HINTS = [
  'invalid_input',
  'captcha_failed',
  'web_booking_off',
  'slot_taken',
  'too_many_codes',
  'too_many_bookings',
  'no_show_limit',
  'code_wrong',
  'code_expired',
  'code_attempts',
  'resend_too_soon',
  'cancel_too_late',
  'not_found',
  'device_token_invalid',
  'failed',
] as const

export type BookingHint = (typeof BOOKING_HINTS)[number]

/** A refusal from the RPCs or the Edge Function, as one of BOOKING_HINTS. */
export class BookingError extends Error {
  constructor(
    readonly hint: BookingHint,
    /** With `resend_too_soon`: how long until a new code can be sent. */
    readonly resendAfterSeconds?: number,
  ) {
    super(hint)
    this.name = 'BookingError'
  }
}

export function toHint(value: unknown): BookingHint {
  return (BOOKING_HINTS as ReadonlyArray<unknown>).includes(value)
    ? (value as BookingHint)
    : 'failed'
}

/** The hint of any error thrown here; `failed` for anything unexpected. */
export function hintOf(error: unknown): BookingHint {
  return error instanceof BookingError ? error.hint : 'failed'
}

/** Refusals that mean "this has to go through the shop": the page offers its phone. */
export const CALL_SHOP_HINTS: ReadonlyArray<BookingHint> = [
  'web_booking_off',
  'too_many_codes',
  'too_many_bookings',
  'no_show_limit',
]

// --- Reads (anon RPCs) -------------------------------------------------------

export interface WebShop {
  name: string
  address: string | null
  phone: string | null
  logo_url: string | null
  timezone: string
  bookable: boolean
  cancel_cutoff_hours: number | null
}

export interface WebBarber {
  employee_id: string
  display_name: string
  avatar_url: string | null
}

export interface WebService {
  service_id: string
  name: string
  price: number
  duration_minutes: number
}

export interface WebSlot {
  /** Minutes after the shop's midnight. */
  minutes: number
  starts_at: string
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const supabase = await client()
  const { data, error } = await supabase.rpc(fn, args)
  if (error) {
    throw new BookingError(
      error.hint === 'web_booking_off' ? 'web_booking_off' : 'failed',
    )
  }
  return data as T
}

/** The shop behind a booking link, or null when no shop has that code. */
export function fetchWebShop(code: string) {
  return rpc<WebShop | null>('web_booking_shop', { p_code: code })
}

export function fetchWebBarbers(code: string) {
  return rpc<Array<WebBarber> | null>('web_bookable_barbers', {
    p_code: code,
  }).then((rows) => rows ?? [])
}

export async function fetchWebServices(
  code: string,
  employeeId: string,
  locale: Locale,
) {
  const rows = await rpc<Array<
    Omit<WebService, 'price'> & { price: number | string }
  > | null>('web_barber_services', {
    p_code: code,
    p_employee_id: employeeId,
    p_locale: locale,
  })
  return (rows ?? []).map((row) => ({ ...row, price: Number(row.price) }))
}

/** Shop-local dates in `from`..`to` with at least one free time. */
export async function fetchWebDays(
  code: string,
  employeeId: string,
  serviceId: string,
  from: string,
  to: string,
) {
  const rows = await rpc<Array<{ day: string }> | null>('web_bookable_days', {
    p_code: code,
    p_employee_id: employeeId,
    p_service_id: serviceId,
    p_from: from,
    p_to: to,
  })
  return (rows ?? []).map((row) => row.day)
}

export async function fetchWebSlots(
  code: string,
  employeeId: string,
  serviceId: string,
  date: string,
) {
  const rows = await rpc<Array<WebSlot> | null>('web_available_slots', {
    p_code: code,
    p_employee_id: employeeId,
    p_service_id: serviceId,
    p_date: date,
  })
  return rows ?? []
}

// --- Writes (Edge Function `web-booking`) ------------------------------------

export interface BookingRequest {
  code: string
  employee_id: string
  service_id: string
  date: string
  minutes: number
  first_name: string
  last_name: string
  email: string
  /** E.164 */
  phone: string
  note?: string
  locale: Locale
}

export interface BookingSummary {
  reference: string
  starts_at: string
  ends_at: string
  status: 'booked' | 'completed' | 'cancelled' | 'no_show'
  barber_name: string
  service_name: string
  price: number
  shop: {
    name: string
    address: string | null
    phone: string | null
    code: string
  }
}

type FunctionResult<T> =
  | ({ ok: true } & T)
  | { ok: false; error?: unknown; resend_after_seconds?: unknown }

async function call<T>(
  action: string,
  body: Record<string, unknown>,
): Promise<T> {
  const supabase = await client()
  const { data, error } = await supabase.functions.invoke<FunctionResult<T>>(
    'web-booking',
    { body: { action, ...body } },
  )
  let result: FunctionResult<T> | null = data
  // A refusal may come with an error status; its body still says why.
  if (error) {
    const response: unknown = (error as { context?: unknown }).context
    result =
      response instanceof Response
        ? ((await response.json().catch(() => null)) as FunctionResult<T>)
        : null
  }
  if (!result || typeof result !== 'object') throw new BookingError('failed')
  if (!result.ok) {
    const wait = result.resend_after_seconds
    throw new BookingError(
      toHint(result.error),
      typeof wait === 'number' ? wait : undefined,
    )
  }
  return result
}

export function sendCode(booking: BookingRequest, turnstileToken: string) {
  return call<{ resend_after_seconds: number }>('send_code', {
    booking,
    turnstile_token: turnstileToken,
  })
}

export function confirmCode(booking: BookingRequest, otp: string) {
  return call<{ booking: BookingSummary; device_token: string }>('confirm', {
    booking,
    otp,
  })
}

/** Books for an email this browser already confirmed (see rememberDevice). */
export function bookRemembered(
  booking: BookingRequest,
  deviceToken: string,
  turnstileToken: string,
) {
  return call<{ booking: BookingSummary }>('book', {
    booking,
    device_token: deviceToken,
    turnstile_token: turnstileToken,
  })
}

export function getBooking(cancelToken: string) {
  return call<{ booking: BookingSummary; can_cancel: boolean }>('get', {
    cancel_token: cancelToken,
  })
}

export function cancelBooking(cancelToken: string) {
  return call<{ booking: BookingSummary }>('cancel', {
    cancel_token: cancelToken,
  })
}

// --- Remembered email ----------------------------------------------------------
//
// After a confirmed code the server hands back a device token for that email,
// good for 90 days; with it, booking again with the same email skips the
// code. Kept in localStorage per email. Storage can be off or full (private
// mode), so every access is guarded: without it, the code is simply asked
// for again.

const DEVICE_KEY_PREFIX = 'chairo-booking-device:'
export const DEVICE_TOKEN_DAYS = 90
const DAY_MS = 24 * 60 * 60 * 1000

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function deviceKey(email: string) {
  return DEVICE_KEY_PREFIX + normalizeEmail(email)
}

export function rememberDevice(email: string, token: string, now = Date.now()) {
  try {
    localStorage.setItem(
      deviceKey(email),
      JSON.stringify({ token, expiresAt: now + DEVICE_TOKEN_DAYS * DAY_MS }),
    )
  } catch {
    // Not remembered; the next booking asks for a code.
  }
}

/** The device token for `email`, or null when there's none or it expired. */
export function rememberedDevice(email: string, now = Date.now()) {
  try {
    const raw = localStorage.getItem(deviceKey(email))
    if (!raw) return null
    const saved = JSON.parse(raw) as { token?: unknown; expiresAt?: unknown }
    if (
      typeof saved.token === 'string' &&
      typeof saved.expiresAt === 'number' &&
      saved.expiresAt > now
    ) {
      return saved.token
    }
    localStorage.removeItem(deviceKey(email))
    return null
  } catch {
    return null
  }
}

export function forgetDevice(email: string) {
  try {
    localStorage.removeItem(deviceKey(email))
  } catch {
    // Nothing to forget.
  }
}
