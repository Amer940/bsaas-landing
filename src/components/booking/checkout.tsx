import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Field, Notice, StepTitle } from '#/components/booking/booking-ui'
import { PhoneField } from '#/components/booking/phone-field'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { toE164 } from '#/lib/phone'
import type { CountryCode } from '#/lib/phone'
import { useTurnstile } from '#/lib/turnstile'
import {
  BookingError,
  bookRemembered,
  confirmCode,
  forgetDevice,
  hintOf,
  normalizeEmail,
  rememberDevice,
  rememberedDevice,
  sendCode,
} from '#/lib/web-booking'
import type {
  BookingHint,
  BookingRequest,
  BookingSummary,
} from '#/lib/web-booking'

// The last two steps of the booking page: the person's details, then the
// code from the email. Turnstile runs only here (not on page load), in front
// of sending a code and of booking with a remembered email.

export interface Details {
  firstName: string
  lastName: string
  email: string
  country: CountryCode
  phone: string
  note: string
}

const NAME_MAX = 40
const NOTE_MAX = 300
const CODE_LENGTH = 6
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** What the details step needs to build a booking. */
export interface SlotPick {
  code: string
  employeeId: string
  serviceId: string
  day: string
  minutes: number
}

type DetailErrors = Partial<Record<keyof Details, string>>

/** Booking ends: booked, or a refusal the flow handles (slot taken, limits). */
export interface CheckoutHandlers {
  onBooked: (booking: BookingSummary, email: string) => void
  onRefused: (hint: BookingHint) => void
}

function validate(
  details: Details,
  c: (typeof bookContent)['bs'],
): { errors: DetailErrors; phone: string | null } {
  const errors: DetailErrors = {}
  for (const key of ['firstName', 'lastName'] as const) {
    const value = details[key].trim()
    if (!value) errors[key] = c.required
    else if (value.length > NAME_MAX) errors[key] = c.nameTooLong
  }
  const email = details.email.trim()
  if (!email) errors.email = c.required
  else if (!EMAIL_FORMAT.test(email)) errors.email = c.emailInvalid
  const phone = details.phone.trim()
    ? toE164(details.phone, details.country)
    : null
  if (!details.phone.trim()) errors.phone = c.required
  else if (!phone) errors.phone = c.phoneInvalid
  if (details.note.trim().length > NOTE_MAX) errors.note = c.noteTooLong
  return { errors, phone }
}

function bookingRequest(
  pick: SlotPick,
  details: Details,
  phone: string,
  locale: BookingRequest['locale'],
): BookingRequest {
  const note = details.note.trim()
  return {
    code: pick.code,
    employee_id: pick.employeeId,
    service_id: pick.serviceId,
    date: pick.day,
    minutes: pick.minutes,
    first_name: details.firstName.trim(),
    last_name: details.lastName.trim(),
    email: normalizeEmail(details.email),
    phone,
    ...(note ? { note } : {}),
    locale,
  }
}

/** Hints that end the checkout: the flow takes over (back to times, call the shop). */
const FLOW_HINTS: ReadonlyArray<BookingHint> = [
  'slot_taken',
  'web_booking_off',
  'too_many_codes',
  'too_many_bookings',
  'no_show_limit',
]

/** The remembered device token is bad, expired or another email's: ask for a code. */
const STALE_DEVICE_HINTS: ReadonlyArray<BookingHint> = ['device_token_invalid']

export function Checkout({
  pick,
  details,
  onDetails,
  stage,
  onStage,
  handlers,
}: {
  pick: SlotPick
  details: Details
  onDetails: (details: Details) => void
  stage: 'details' | 'code'
  onStage: (stage: 'details' | 'code') => void
  handlers: CheckoutHandlers
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const turnstile = useTurnstile('web_booking')
  const [errors, setErrors] = useState<DetailErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [request, setRequest] = useState<BookingRequest | null>(null)
  const [resendAt, setResendAt] = useState(0)

  async function token() {
    try {
      return await turnstile.getToken()
    } catch {
      throw new BookingError('captcha_failed')
    }
  }

  /** Sends the code for `next`; true when it went out. */
  async function send(next: BookingRequest) {
    try {
      const result = await sendCode(next, await token())
      setResendAt(Date.now() + result.resend_after_seconds * 1000)
      return true
    } catch (error) {
      handle(hintOf(error))
      return false
    } finally {
      turnstile.reset()
    }
  }

  /** Changes fields and clears their messages. */
  function edit(patch: Partial<Details>) {
    onDetails({ ...details, ...patch })
    setErrors((current) => {
      const next = { ...current }
      for (const key of Object.keys(patch) as Array<keyof Details>) {
        delete next[key === 'country' ? 'phone' : key]
      }
      return next
    })
  }

  function handle(hint: BookingHint) {
    if (FLOW_HINTS.includes(hint)) handlers.onRefused(hint)
    else setFormError(c.errors[hint])
  }

  async function submitDetails(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    const checked = validate(details, c)
    setErrors(checked.errors)
    setFormError(null)
    if (Object.keys(checked.errors).length > 0 || !checked.phone) return

    const next = bookingRequest(pick, details, checked.phone, locale)
    setRequest(next)
    setBusy(true)

    const device = rememberedDevice(next.email)
    if (device) {
      try {
        const result = await bookRemembered(next, device, await token())
        handlers.onBooked(result.booking, next.email)
        return
      } catch (error) {
        const hint = hintOf(error)
        if (!STALE_DEVICE_HINTS.includes(hint)) {
          setBusy(false)
          handle(hint)
          return
        }
        forgetDevice(next.email)
      } finally {
        turnstile.reset()
      }
    }

    const sent = await send(next)
    setBusy(false)
    if (sent) onStage('code')
  }

  return (
    <>
      {stage === 'details' ? (
        <form onSubmit={submitDetails} noValidate className="animate-fade-up">
          <StepTitle body={c.detailsBody}>{c.detailsTitle}</StepTitle>
          <div className="mt-7 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={c.firstName} error={errors.firstName}>
                <Input
                  autoComplete="given-name"
                  value={details.firstName}
                  maxLength={NAME_MAX + 10}
                  onChange={(e) => edit({ firstName: e.target.value })}
                  aria-invalid={!!errors.firstName}
                  className="h-13 rounded-2xl px-5"
                />
              </Field>
              <Field label={c.lastName} error={errors.lastName}>
                <Input
                  autoComplete="family-name"
                  value={details.lastName}
                  maxLength={NAME_MAX + 10}
                  onChange={(e) => edit({ lastName: e.target.value })}
                  aria-invalid={!!errors.lastName}
                  className="h-13 rounded-2xl px-5"
                />
              </Field>
            </div>
            <Field
              label={c.email}
              error={errors.email}
              hint={
                rememberedDevice(details.email) ? c.rememberedHint : undefined
              }
            >
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={details.email}
                onChange={(e) => edit({ email: e.target.value })}
                aria-invalid={!!errors.email}
                className="h-13 rounded-2xl px-5"
              />
            </Field>
            <PhoneField
              country={details.country}
              onCountry={(country) => edit({ country })}
              value={details.phone}
              onChange={(phone) => edit({ phone })}
              error={errors.phone}
            />
            <Field label={c.note} error={errors.note} hint={c.noteHint}>
              <Textarea
                value={details.note}
                maxLength={NOTE_MAX}
                rows={2}
                onChange={(e) => edit({ note: e.target.value })}
                aria-invalid={!!errors.note}
                className="min-h-13 rounded-2xl border-none bg-white/8 px-5 py-3.5 text-base shadow-none focus-visible:ring-2 focus-visible:ring-foreground/30 md:text-base"
              />
            </Field>
          </div>

          {formError ? <Notice className="mt-5">{formError}</Notice> : null}

          <Button
            type="submit"
            size="lg"
            className="mt-7 w-full"
            disabled={busy}
          >
            {busy ? c.submittingDetails : c.submitDetails}
          </Button>
        </form>
      ) : request ? (
        <CodeStep
          request={request}
          resendAt={resendAt}
          onResend={async () => {
            setFormError(null)
            return send(request)
          }}
          onChangeEmail={() => {
            setFormError(null)
            onStage('details')
          }}
          onRefused={handle}
          onBooked={handlers.onBooked}
          error={formError}
          setError={setFormError}
        />
      ) : null}

      {/* Turnstile's box: empty unless Cloudflare wants a click. */}
      <div
        ref={turnstile.ref}
        className="mt-4 flex justify-center empty:hidden"
      />
    </>
  )
}

function useSecondsLeft(until: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (until <= Date.now()) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [until])
  return Math.max(0, Math.ceil((until - now) / 1000))
}

function CodeStep({
  request,
  resendAt,
  onResend,
  onChangeEmail,
  onRefused,
  onBooked,
  error,
  setError,
}: {
  request: BookingRequest
  resendAt: number
  onResend: () => Promise<boolean>
  onChangeEmail: () => void
  onRefused: (hint: BookingHint) => void
  onBooked: CheckoutHandlers['onBooked']
  error: string | null
  setError: (error: string | null) => void
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const secondsLeft = useSecondsLeft(resendAt)
  const input = useRef<HTMLInputElement>(null)

  async function confirm(value: string) {
    if (busy || value.length !== CODE_LENGTH) return
    setBusy(true)
    setError(null)
    setResent(false)
    try {
      const result = await confirmCode(request, value)
      rememberDevice(request.email, result.device_token)
      onBooked(result.booking, request.email)
    } catch (e) {
      const hint = hintOf(e)
      setBusy(false)
      if (hint === 'code_wrong') {
        setOtp('')
        input.current?.focus()
      }
      onRefused(hint)
    }
  }

  async function resend() {
    if (resending || secondsLeft > 0) return
    setResending(true)
    setResent(false)
    setOtp('')
    const sent = await onResend()
    setResending(false)
    setResent(sent)
    input.current?.focus()
  }

  return (
    <form
      className="animate-fade-up"
      onSubmit={(event) => {
        event.preventDefault()
        void confirm(otp)
      }}
      noValidate
    >
      <StepTitle body={c.codeBody(request.email)}>{c.codeTitle}</StepTitle>
      <label className="mt-7 block">
        <span className="text-sm text-foreground/65">{c.codeLabel}</span>
        <Input
          ref={input}
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={CODE_LENGTH}
          value={otp}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH)
            setOtp(next)
            if (next.length === CODE_LENGTH) void confirm(next)
          }}
          aria-invalid={!!error}
          className="mt-1.5 h-15 rounded-2xl px-5 text-center text-2xl font-extrabold tracking-[0.5em] tabular-nums"
        />
      </label>

      {error ? <Notice className="mt-5">{error}</Notice> : null}
      {resent && !error ? (
        <Notice tone="info" className="mt-5">
          {c.resent}
        </Notice>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="mt-7 w-full"
        disabled={busy || otp.length !== CODE_LENGTH}
      >
        {busy ? c.submittingCode : c.submitCode}
      </Button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        {secondsLeft > 0 ? (
          <span className="text-foreground/50" aria-live="polite">
            {c.resendIn(secondsLeft)}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void resend()}
            disabled={resending}
            className="text-foreground/80 underline underline-offset-4 disabled:opacity-50"
          >
            {c.resend}
          </button>
        )}
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-foreground/65 underline underline-offset-4"
        >
          {c.changeEmail}
        </button>
      </div>
    </form>
  )
}
