import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Avatar,
  LoadFailed,
  Loading,
  Notice,
  OptionRow,
  StepTitle,
} from '#/components/booking/booking-ui'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import {
  addDays,
  dayOfMonth,
  longDay,
  minutesLabel,
  monthLabel,
  priceLabel,
  todayIn,
  weekdayShort,
} from '#/lib/booking-time'
import { cn } from '#/lib/utils'
import {
  fetchWebBarbers,
  fetchWebDays,
  fetchWebServices,
  fetchWebSlots,
} from '#/lib/web-booking'
import type { WebBarber, WebService, WebSlot } from '#/lib/web-booking'

// The first three steps of the booking page: barber, service, day and time.
// Each reads its list when it opens; the server decides what's bookable
// (the shop's booking window, notice and each barber's schedule).

/** How far ahead the day strip looks; bookable_days takes 62 days at most. */
const DAYS_AHEAD = 60

/** Thrown off by one of these lists means web booking was switched off. */
export type OnBlocked = (error: unknown) => void

function useBlockedCheck(error: unknown, onBlocked: OnBlocked) {
  useEffect(() => {
    if (error) onBlocked(error)
  }, [error, onBlocked])
}

export function BarberStep({
  code,
  selected,
  onPick,
  onBlocked,
}: {
  code: string
  selected?: string
  onPick: (barber: WebBarber) => void
  onBlocked: OnBlocked
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const query = useQuery({
    queryKey: ['web-booking', code, 'barbers'],
    queryFn: () => fetchWebBarbers(code),
  })
  useBlockedCheck(query.error, onBlocked)

  return (
    <>
      <StepTitle>{c.barberTitle}</StepTitle>
      <div className="mt-6">
        {query.isPending ? (
          <Loading />
        ) : query.isError ? (
          <LoadFailed onRetry={() => void query.refetch()} />
        ) : query.data.length === 0 ? (
          <Notice tone="info">{c.noBarbers}</Notice>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {query.data.map((barber) => (
              <li key={barber.employee_id}>
                <OptionRow
                  onClick={() => onPick(barber)}
                  selected={selected === barber.employee_id}
                >
                  <Avatar name={barber.display_name} url={barber.avatar_url} />
                  <span className="min-w-0 flex-1 truncate text-base font-bold">
                    {barber.display_name}
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-foreground/40" />
                </OptionRow>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export function ServiceStep({
  code,
  barber,
  selected,
  onPick,
  onBlocked,
}: {
  code: string
  barber: WebBarber
  selected?: string
  onPick: (service: WebService) => void
  onBlocked: OnBlocked
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const query = useQuery({
    queryKey: ['web-booking', code, 'services', barber.employee_id, locale],
    queryFn: () => fetchWebServices(code, barber.employee_id, locale),
  })
  useBlockedCheck(query.error, onBlocked)

  return (
    <>
      <StepTitle body={barber.display_name}>{c.serviceTitle}</StepTitle>
      <div className="mt-6">
        {query.isPending ? (
          <Loading />
        ) : query.isError ? (
          <LoadFailed onRetry={() => void query.refetch()} />
        ) : query.data.length === 0 ? (
          <Notice tone="info">{c.noServices}</Notice>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {query.data.map((service) => (
              <li key={service.service_id}>
                <OptionRow
                  onClick={() => onPick(service)}
                  selected={selected === service.service_id}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold">
                      {service.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-foreground/60">
                      {c.minutes(service.duration_minutes)}
                    </span>
                  </span>
                  <span className="shrink-0 text-base font-bold">
                    {priceLabel(service.price, locale)}
                  </span>
                </OptionRow>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export function TimeStep({
  code,
  timeZone,
  barber,
  service,
  day,
  selectedMinutes,
  notice,
  onDay,
  onPick,
  onBlocked,
}: {
  code: string
  timeZone: string
  barber: WebBarber
  service: WebService
  day?: string
  selectedMinutes?: number
  /** Shown above the times, e.g. after the picked time was taken. */
  notice?: string
  onDay: (day: string) => void
  onPick: (day: string, slot: WebSlot) => void
  onBlocked: OnBlocked
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const from = todayIn(timeZone)
  const to = addDays(from, DAYS_AHEAD)

  const days = useQuery({
    queryKey: [
      'web-booking',
      code,
      'days',
      barber.employee_id,
      service.service_id,
      from,
    ],
    queryFn: () =>
      fetchWebDays(code, barber.employee_id, service.service_id, from, to),
  })
  const activeDay = day ?? days.data?.[0]
  const slots = useQuery({
    queryKey: [
      'web-booking',
      code,
      'slots',
      barber.employee_id,
      service.service_id,
      activeDay,
    ],
    queryFn: () =>
      fetchWebSlots(
        code,
        barber.employee_id,
        service.service_id,
        activeDay as string,
      ),
    enabled: !!activeDay,
    // Times go fast; always read them fresh when the step opens.
    staleTime: 0,
    refetchOnMount: 'always',
  })
  useBlockedCheck(days.error ?? slots.error, onBlocked)

  // Keep the picked day in view when coming back to this step.
  const strip = useRef<HTMLDivElement>(null)
  useEffect(() => {
    strip.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [activeDay, days.data])

  // Desktop: arrows page the strip, and a vertical wheel scrolls it sideways
  // (a mouse has no sideways swipe). Arrows hide at either end.
  const [edges, setEdges] = useState({ start: true, end: true })
  useEffect(() => {
    const el = strip.current
    if (!el) return
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      })
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (el.scrollWidth <= el.clientWidth) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', update)
    }
  }, [days.data])
  const page = (dir: 1 | -1) => {
    const el = strip.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <>
      <StepTitle body={`${barber.display_name} · ${service.name}`}>
        {c.timeTitle}
      </StepTitle>
      {notice ? <Notice className="mt-5">{notice}</Notice> : null}
      <div className="mt-6">
        {days.isPending ? (
          <Loading />
        ) : days.isError ? (
          <LoadFailed onRetry={() => void days.refetch()} />
        ) : days.data.length === 0 || !activeDay ? (
          <Notice tone="info">{c.noDays}</Notice>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="m-0 text-sm font-bold text-foreground/65 first-letter:uppercase">
                {monthLabel(activeDay, locale)}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => page(-1)}
                  disabled={edges.start}
                  aria-label={c.earlierDays}
                  className="grid size-8 place-items-center rounded-full bg-white/8 transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => page(1)}
                  disabled={edges.end}
                  aria-label={c.laterDays}
                  className="grid size-8 place-items-center rounded-full bg-white/8 transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none disabled:opacity-30"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div
              ref={strip}
              className="-mx-6 mt-2 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-9 md:px-9"
            >
              {days.data.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDay(d)}
                  aria-pressed={d === activeDay}
                  aria-label={longDay(d, locale)}
                  className={cn(
                    'flex w-14 shrink-0 flex-col items-center rounded-2xl py-2.5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none',
                    d === activeDay
                      ? 'bg-foreground text-background'
                      : 'bg-white/8 hover:bg-white/12',
                  )}
                >
                  <span className="text-xs capitalize opacity-70">
                    {weekdayShort(d, locale)}
                  </span>
                  <span className="text-lg font-bold">{dayOfMonth(d)}</span>
                </button>
              ))}
            </div>

            <p className="m-0 mt-5 text-sm text-foreground/65 first-letter:uppercase">
              {longDay(activeDay, locale)}
            </p>
            <div className="mt-2">
              {slots.isPending ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      aria-hidden
                      className="h-12 animate-pulse rounded-xl bg-white/6 motion-reduce:animate-none"
                    />
                  ))}
                </div>
              ) : slots.isError ? (
                <LoadFailed onRetry={() => void slots.refetch()} />
              ) : slots.data.length === 0 ? (
                <Notice tone="info">{c.noSlots}</Notice>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.data.map((slot) => (
                    <button
                      key={slot.minutes}
                      type="button"
                      onClick={() => onPick(activeDay, slot)}
                      aria-pressed={
                        day === activeDay && selectedMinutes === slot.minutes
                      }
                      className={cn(
                        'h-12 rounded-xl text-base font-bold tabular-nums transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none',
                        day === activeDay && selectedMinutes === slot.minutes
                          ? 'bg-foreground text-background'
                          : 'bg-white/8 hover:bg-white/12',
                      )}
                    >
                      {minutesLabel(slot.minutes)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
