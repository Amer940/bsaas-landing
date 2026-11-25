import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BookingSummaryCard } from '#/components/booking/booking-summary'
import {
  CallShopButton,
  Notice,
  StepHeader,
  StepTitle,
} from '#/components/booking/booking-ui'
import {
  BarberStep,
  ServiceStep,
  TimeStep,
} from '#/components/booking/booking-steps'
import { Checkout } from '#/components/booking/checkout'
import type { Details } from '#/components/booking/checkout'
import { StoreBadges } from '#/components/store-badges'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { DEFAULT_COUNTRY } from '#/lib/phone'
import { hintOf } from '#/lib/web-booking'
import type {
  BookingHint,
  BookingSummary,
  WebBarber,
  WebService,
  WebShop,
} from '#/lib/web-booking'

// The booking page's steps, one per screen, in the app's order: barber →
// service → day & time → details → email code → done. Nothing is held on the
// server until the code is confirmed; the time is checked again then, and if
// someone took it meanwhile the page goes back to the times with the details
// kept.

type Step = 'barber' | 'service' | 'time' | 'details' | 'code' | 'done'

const STEPS: Array<Step> = ['barber', 'service', 'time', 'details', 'code']

const EMPTY_DETAILS: Details = {
  firstName: '',
  lastName: '',
  email: '',
  country: DEFAULT_COUNTRY,
  phone: '',
  note: '',
}

export function BookingFlow({ code, shop }: { code: string; shop: WebShop }) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const queryClient = useQueryClient()

  const [step, setStep] = useState<Step>('barber')
  const [barber, setBarber] = useState<WebBarber>()
  const [service, setService] = useState<WebService>()
  const [day, setDay] = useState<string>()
  const [minutes, setMinutes] = useState<number>()
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS)
  const [timeNotice, setTimeNotice] = useState<string>()
  const [booked, setBooked] = useState<{
    booking: BookingSummary
    email: string
  }>()
  // A refusal only the shop can get past (booking off, a limit): its phone.
  const [blocked, setBlocked] = useState<BookingHint>()

  function go(next: Step) {
    setStep(next)
    window.scrollTo({ top: 0 })
  }

  const onBlocked = useCallback((error: unknown) => {
    if (hintOf(error) === 'web_booking_off') setBlocked('web_booking_off')
  }, [])

  function onRefused(hint: BookingHint) {
    if (hint === 'slot_taken') {
      setMinutes(undefined)
      setTimeNotice(c.slotTakenNotice)
      void queryClient.invalidateQueries({ queryKey: ['web-booking', code] })
      go('time')
      return
    }
    setBlocked(hint)
  }

  if (blocked) {
    return (
      <>
        <StepHeader
          step={STEPS.indexOf(step) + 1}
          of={STEPS.length}
          shopName={shop.name}
          onBack={
            blocked === 'web_booking_off'
              ? undefined
              : () => setBlocked(undefined)
          }
        />
        <ShopUnavailable
          shop={shop}
          message={
            blocked === 'web_booking_off' ? undefined : c.errors[blocked]
          }
        />
      </>
    )
  }

  if (step === 'done' && booked) {
    return (
      <>
        <StepHeader
          step={STEPS.length}
          of={STEPS.length}
          shopName={shop.name}
        />
        <div role="status" className="animate-fade-up">
          <StepTitle body={c.doneBody(booked.email)}>{c.doneTitle}</StepTitle>
        </div>
        <div className="mt-6">
          <BookingSummaryCard
            booking={booked.booking}
            timeZone={shop.timezone}
          />
        </div>
        <div className="mt-8 text-center">
          <p className="m-0 text-base font-bold">{c.appTitle}</p>
          <p className="m-0 mt-1 text-sm leading-normal text-foreground/50">
            {c.appBody}
          </p>
          <StoreBadges className="mt-4 justify-center" />
        </div>
      </>
    )
  }

  const back: Partial<Record<Step, Step>> = {
    service: 'barber',
    time: 'service',
    details: 'time',
    code: 'details',
  }
  const previous = back[step]

  return (
    <>
      <StepHeader
        step={STEPS.indexOf(step) + 1}
        of={STEPS.length}
        shopName={shop.name}
        onBack={
          previous
            ? () => {
                setTimeNotice(undefined)
                go(previous)
              }
            : undefined
        }
      />
      <div key={step} className="animate-fade-up">
        {step === 'barber' ? (
          <BarberStep
            code={code}
            selected={barber?.employee_id}
            onBlocked={onBlocked}
            onPick={(next) => {
              if (next.employee_id !== barber?.employee_id) {
                setService(undefined)
                setDay(undefined)
                setMinutes(undefined)
              }
              setBarber(next)
              go('service')
            }}
          />
        ) : step === 'service' && barber ? (
          <ServiceStep
            code={code}
            barber={barber}
            selected={service?.service_id}
            onBlocked={onBlocked}
            onPick={(next) => {
              if (next.service_id !== service?.service_id) {
                setDay(undefined)
                setMinutes(undefined)
              }
              setService(next)
              go('time')
            }}
          />
        ) : step === 'time' && barber && service ? (
          <TimeStep
            code={code}
            timeZone={shop.timezone}
            barber={barber}
            service={service}
            day={day}
            selectedMinutes={minutes}
            notice={timeNotice}
            onBlocked={onBlocked}
            onDay={(next) => {
              setTimeNotice(undefined)
              setDay(next)
            }}
            onPick={(nextDay, slot) => {
              setTimeNotice(undefined)
              setDay(nextDay)
              setMinutes(slot.minutes)
              go('details')
            }}
          />
        ) : (step === 'details' || step === 'code') &&
          barber &&
          service &&
          day &&
          minutes !== undefined ? (
          <Checkout
            pick={{
              code,
              employeeId: barber.employee_id,
              serviceId: service.service_id,
              day,
              minutes,
            }}
            details={details}
            onDetails={setDetails}
            stage={step}
            onStage={go}
            handlers={{
              onBooked: (booking, email) => {
                setBooked({ booking, email })
                go('done')
              },
              onRefused,
            }}
          />
        ) : null}
      </div>
    </>
  )
}

/** A shop that can't take web bookings now: who to call instead. */
export function ShopUnavailable({
  shop,
  message,
}: {
  shop: Pick<WebShop, 'name' | 'address' | 'phone'>
  /** Why, when it's about this booking rather than the shop. */
  message?: string
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  return (
    <div className="animate-fade-up">
      {message ? (
        <Notice>{message}</Notice>
      ) : (
        <StepTitle body={c.offBody}>{c.offTitle}</StepTitle>
      )}
      <div className="mt-6 rounded-2xl bg-white/8 px-5 py-4">
        <p className="m-0 text-base font-bold">{shop.name}</p>
        {shop.address ? (
          <p className="m-0 mt-1 text-sm leading-normal text-foreground/65">
            {shop.address}
          </p>
        ) : null}
        {shop.phone ? (
          <p className="m-0 mt-1 text-sm text-foreground/65">{shop.phone}</p>
        ) : null}
      </div>
      <CallShopButton phone={shop.phone} className="mt-6" />
    </div>
  )
}
