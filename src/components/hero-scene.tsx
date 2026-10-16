import {
  ArrowLeftRight,
  Bell,
  CalendarDays,
  ChartNoAxesColumn,
  Check,
  Clock,
  House,
  MapPin,
  Plus,
  Store,
  User,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { Avatar } from './feature-demos'
import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { featureDemos, heroDemo, stepDemos } from '#/content/feature-demos'
import type { FeatureDemos, HeroDemo } from '#/content/feature-demos'

/*
 * The hero illustration: the barber's "Today" screen in front of a client's
 * phone, with a new-booking toast and a weekly total on top. It is drawn on a
 * 590×680 artboard whose spacing and font size are tied to its width, so the
 * whole scene scales like an image. Font sizes inside are in `em` and only set
 * on text, so they never compound.
 */
const artboard = {
  '--spacing': 'calc(100cqw / 147.5)', // 4 artboard px
  fontSize: 'calc(100cqw / 36.875)', // 16 artboard px
} as CSSProperties

type Entrance = 'hero-rise' | 'hero-drop' | 'hero-pop' | 'fade-up'

/** Style for `animate-enter`: which keyframes to play, and when. */
function enter(name: Entrance, delay: number, duration?: number) {
  return {
    '--enter': name,
    '--enter-delay': `${delay}ms`,
    ...(duration && { '--enter-duration': `${duration}ms` }),
  } as CSSProperties
}

/**
 * Counts up to `target` while `ref`'s entrance animation plays. Without one
 * (reduced motion, or it already finished before hydration) it stays at
 * `target`, so the number never resets in front of the visitor.
 */
function useCountUp(
  target: number,
  ref: RefObject<HTMLElement | null>,
  duration = 1200,
) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    const entrance = ref.current?.getAnimations()[0]
    if (!entrance || entrance.playState === 'finished') return
    const delay = entrance.effect?.getTiming().delay ?? 0
    const elapsed =
      typeof entrance.currentTime === 'number' ? entrance.currentTime : 0

    let frame = 0
    let start: number | undefined
    const tick = (now: number) => {
      start ??= now + Math.max(0, delay - elapsed)
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      setValue(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, ref, duration])

  return value
}

function HeroScene({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  const { locale } = useLocale()
  const data = heroDemo[locale]
  const schedule = featureDemos[locale].schedule
  const toast = stepDemos[locale].booking

  return (
    <div className={cn('@container', className)}>
      <div
        role="img"
        aria-label={label}
        className="relative aspect-[590/680] w-full select-none"
        style={artboard}
      >
        <div aria-hidden="true">
          <ClientPhone data={data.client} />
          <BarberPhone data={data} schedule={schedule} />

          {/* New booking toast */}
          <div
            className="absolute top-[8.2%] left-[5.3%] z-20 flex w-[50.5%] animate-enter items-center gap-3.5 rounded-[1.75em] bg-[#232323] p-3.5 pr-4.5 shadow-[0_20px_40px_rgba(0,0,0,.5),inset_0_0_0_1px_rgba(255,255,255,.08)]"
            style={enter('hero-drop', 1500, 700)}
          >
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-[#8fe0a0] text-[#13361d]">
              <Check className="size-4.5" strokeWidth={3} />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[0.9375em] font-bold">
                {toast.toastTitle}
              </span>
              <span className="block truncate text-[0.75em] text-foreground/60">
                {toast.toastBody}
              </span>
            </span>
            <X className="size-4 shrink-0 text-foreground/70" />
          </div>

          <WeekCard data={data.week} />
        </div>
      </div>
    </div>
  )
}

function WeekCard({ data }: { data: HeroDemo['week'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(data.count, ref)

  return (
    <div
      ref={ref}
      className="absolute top-[70.7%] left-[12%] z-20 w-[40.3%] animate-enter rounded-[1.75em] bg-[#1e1e1e] px-4.5 py-4 shadow-[0_24px_48px_rgba(0,0,0,.55),inset_0_0_0_1px_rgba(255,255,255,.08)]"
      style={enter('hero-rise', 700)}
    >
      <span className="block text-[0.6875em] font-bold tracking-[0.075em] text-foreground/50 uppercase">
        {data.label}
      </span>
      <span className="mt-2 flex items-baseline gap-2.5">
        <span className="text-[2.25em] leading-none font-bold tracking-[-0.03em] tabular-nums">
          {count}
        </span>
        <span className="text-[0.8125em] text-foreground/70">{data.note}</span>
      </span>
    </div>
  )
}

/** The barber's "Today" screen, in front. */
function BarberPhone({
  data,
  schedule,
}: {
  data: HeroDemo
  schedule: FeatureDemos['schedule']
}) {
  // The afternoon: lunch break through 16:00.
  const rows = schedule.rows.slice(3, 8)

  return (
    <div
      className="absolute top-[3.2%] left-[36%] z-10 flex h-[91.6%] w-[50%] animate-enter flex-col rounded-[2.875em] bg-[#0b0b0b] px-5 pt-12.5 shadow-[0_40px_80px_rgba(0,0,0,.55),inset_0_0_0_1.5px_rgba(255,255,255,.1)]"
      style={enter('hero-rise', 0)}
    >
      <div className="flex justify-end gap-2">
        <span className="flex items-center gap-0.5 rounded-full bg-white/8 p-0.5">
          <Avatar name="Kenan" className="size-6.5 text-[0.625em]" />
          <span className="flex size-6.5 items-center justify-center rounded-full bg-foreground text-background">
            <Store className="size-3.5" strokeWidth={2.3} />
          </span>
        </span>
        <span className="relative flex size-7.5 items-center justify-center rounded-full bg-white/8">
          <Bell className="size-3.5" strokeWidth={2.3} />
          <span
            className="absolute -top-1 -right-1 flex size-4 animate-enter items-center justify-center rounded-full bg-foreground text-[0.5625em] font-extrabold text-background ring-2 ring-[#0b0b0b]"
            style={enter('hero-pop', 1750, 500)}
          >
            3
          </span>
        </span>
      </div>

      <div className="animate-enter" style={enter('fade-up', 250, 600)}>
        <span className="mt-5 block text-[0.625em] text-foreground/45">
          {data.date}
        </span>
        <span className="mt-1.5 flex items-center gap-3">
          <span className="text-[3.5em] leading-[0.85] font-bold tracking-[-0.04em]">
            {data.left.count}
          </span>
          <span className="leading-snug">
            <span className="block text-[0.6875em] text-foreground/85">
              {data.left.title}
            </span>
            <span className="block text-[0.6875em] text-foreground/55">
              {data.left.note}
            </span>
          </span>
        </span>
      </div>

      <ul className="m-0 mt-4 list-none rounded-[1.25em] bg-white/7 px-3 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,.1),inset_0_0_0_1px_rgba(255,255,255,.06)]">
        {rows.map((row, i) => (
          <li
            key={row.time}
            className="flex h-10.5 animate-enter items-center gap-2.5 border-white/8 not-first:border-t"
            style={enter('fade-up', 400 + i * 110, 600)}
          >
            <span
              className={cn(
                'w-8 shrink-0 text-[0.625em] font-bold tabular-nums',
                row.kind === 'free' && 'text-foreground/45',
              )}
            >
              {row.time}
            </span>
            <TodayRow row={row} schedule={schedule} />
          </li>
        ))}
      </ul>

      <div
        className="mt-3.5 flex animate-enter gap-2"
        style={enter('fade-up', 1000, 600)}
      >
        <span className="flex items-center gap-1 rounded-full bg-white/14 px-3 py-1.5 text-[0.625em] font-bold">
          <Plus className="size-3" strokeWidth={2.5} />
          {data.bookClient}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/7 px-3 py-1.5 text-[0.625em] font-bold">
          <Clock className="size-3" strokeWidth={2.5} />
          {data.blockTime}
        </span>
      </div>

      <div className="mt-auto mb-3 flex items-center gap-1 self-center rounded-full bg-white/6 p-1">
        <span className="flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-2 text-[0.6875em] font-bold">
          <House className="size-3.5" strokeWidth={2.3} />
          {data.today}
        </span>
        {[CalendarDays, ChartNoAxesColumn, User].map((Icon, i) => (
          <span key={i} className="flex size-8 items-center justify-center">
            <Icon className="size-3.5" strokeWidth={2.3} />
          </span>
        ))}
      </div>
      <span className="mb-2 h-1 w-24 self-center rounded-full bg-foreground/90" />
    </div>
  )
}

function TodayRow({
  row,
  schedule,
}: {
  row: FeatureDemos['schedule']['rows'][number]
  schedule: FeatureDemos['schedule']
}) {
  if (row.kind === 'free') {
    return (
      <span className="flex flex-1 items-center gap-2">
        <span className="flex-1 rounded-[0.9em] border border-dashed border-white/15 px-2.5 py-1.5 text-[0.625em] text-foreground/70">
          {schedule.free}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1.5 text-[0.625em] font-bold">
          <Plus className="size-3" strokeWidth={2.5} />
          {schedule.book}
        </span>
      </span>
    )
  }

  const isBreak = row.kind === 'break'

  return (
    <>
      {isBreak || row.guest ? (
        <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-white/8">
          {isBreak ? (
            <Clock className="size-3.5" strokeWidth={2.3} />
          ) : (
            <User className="size-3.5" strokeWidth={2.3} />
          )}
        </span>
      ) : (
        <Avatar name={row.name ?? ''} className="size-6.5 text-[0.625em]" />
      )}
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[0.6875em] font-bold">
          {isBreak ? schedule.breakTitle : row.name}
        </span>
        <span className="block truncate text-[0.5625em] text-foreground/55">
          {isBreak ? schedule.breakNote : `${row.service} · ${row.price}`}
        </span>
      </span>
      {isBreak ? (
        <span className="rounded-full bg-foreground px-2 py-0.5 text-[0.5625em] font-bold text-background">
          {schedule.now}
        </span>
      ) : (
        <span className="text-[0.5625em] text-foreground/45 tabular-nums">
          {row.until}
        </span>
      )}
    </>
  )
}

/** Backdrop of the booking card's photo: warm grey, lit behind the head. */
const photoBackdrop = {
  background: [
    'radial-gradient(ellipse 60% 45% at 62% 30%, rgba(214,200,182,.45), transparent 70%)',
    'linear-gradient(180deg, #73695f, #443e38 65%, #282522)',
  ].join(', '),
}

/**
 * Stand-in for the barber's photo, softened like an out-of-focus portrait:
 * shoulders, and a round head with dark hair on top, the face across the
 * middle and a beard below. The face is clipped by the head so it never
 * spills past it.
 */
function Portrait() {
  return (
    <span className="absolute inset-0 blur-[1.5px]">
      {/* Shoulders, running off the bottom of the card. */}
      <span className="absolute top-[63%] left-1/2 h-[70%] w-[88%] -translate-x-1/2 rounded-[50%_50%_0_0/45%_45%_0_0] bg-[linear-gradient(180deg,#3a332d,#211d1a_60%)]" />
      {/* Neck, tucked under the beard. */}
      <span className="absolute top-[52%] left-1/2 h-[16%] w-[14%] -translate-x-1/2 rounded-b-[40%] bg-[linear-gradient(180deg,#5e5146,#7d6c5c)]" />
      <span className="absolute top-[9%] left-1/2 aspect-square w-[47%] -translate-x-1/2 overflow-hidden rounded-full bg-[#26211d]">
        {/* Hair: a slight sheen on the crown. */}
        <span className="absolute inset-x-0 top-0 h-[40%] bg-[radial-gradient(ellipse_60%_80%_at_45%_20%,rgba(255,255,255,.12),transparent_70%)]" />
        {/* Face: an ellipse wider than the head, clipped to it. */}
        <span className="absolute top-[27%] -right-[6%] -left-[6%] h-[50%] rounded-[50%/25%_25%_75%_75%] bg-[radial-gradient(ellipse_at_45%_35%,#cdbcaa,#b4a18d_55%,#988673)]" />
      </span>
    </span>
  )
}

/** The client's app, tilted behind the barber's phone and partly covered. */
function ClientPhone({ data }: { data: HeroDemo['client'] }) {
  const actionIcons = [ArrowLeftRight, MapPin, X]

  return (
    <div
      className="absolute top-[14.6%] left-[1.4%] flex h-[77.5%] w-[40%] rotate-[-3deg] animate-enter flex-col overflow-hidden rounded-[2.25em] bg-[#191919] p-3.5 pt-8 opacity-90 shadow-[0_30px_60px_rgba(0,0,0,.45),inset_0_0_0_1.5px_rgba(255,255,255,.1)]"
      style={enter('hero-rise', 150)}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="flex size-5.5 items-center justify-center rounded-full bg-[#2f5f4a]">
            {/* Brko = moustache */}
            <svg viewBox="0 0 16 16" className="size-3.5 fill-white">
              <path d="M8 8.2c-.9-1.3-2.4-1.9-3.6-1.2-.9.5-1.4 1.6-2.4 1.7.8.9 2.3 1.4 3.6 1 1-.3 1.8-.9 2.4-1.5.6.6 1.4 1.2 2.4 1.5 1.3.4 2.8-.1 3.6-1-1-.1-1.5-1.2-2.4-1.7-1.2-.7-2.7-.1-3.6 1.2z" />
            </svg>
          </span>
          <span className="text-[0.625em] font-semibold text-foreground/85">
            {data.salon}
          </span>
        </span>
        <span className="flex items-center gap-0.5 rounded-full bg-white/8 p-0.5">
          <Avatar
            name="Dino"
            className="size-5.5 text-[0.5em] ring-1 ring-white/70"
          />
          <span className="flex size-5.5 items-center justify-center text-foreground/60">
            <Store className="size-2.5" />
          </span>
        </span>
      </div>

      <span className="mt-3 text-[0.9375em] font-bold">{data.greeting}</span>

      <div className="relative mt-2.5 flex h-50 shrink-0 flex-col items-start overflow-hidden rounded-[1.25em] p-2.5 ring-1 ring-white/10">
        <span className="absolute inset-0" style={photoBackdrop} />
        <Portrait />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/55 to-transparent" />
        <span className="relative rounded-full bg-black/35 px-2 py-0.5 text-[0.5em] font-semibold text-foreground/85">
          {data.day}
        </span>
        <span className="relative mt-auto text-[2.5em] leading-none font-bold tracking-[-0.04em]">
          {data.time}
        </span>
        <span className="relative mt-1 text-[0.5625em] text-foreground/75">
          {data.details}
        </span>
        <span className="relative mt-2 flex gap-1.5">
          {data.actions.map((action, i) => {
            const Icon = actionIcons[i]
            return (
              <span
                key={action}
                className="flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[0.5em] font-semibold whitespace-nowrap"
              >
                <Icon className="size-2.5" strokeWidth={2.5} />
                {action}
              </span>
            )
          })}
        </span>
      </div>

      <div className="mt-2 rounded-[1em] bg-white/6 px-3 py-2.5 leading-tight ring-1 ring-white/8">
        <span className="block text-[0.5em] text-foreground/50">
          {data.again.eyebrow}
        </span>
        <span className="block text-[0.6875em] font-bold">
          {data.again.title}
        </span>
        <span className="block text-[0.5em] text-foreground/50">
          {data.again.note}
        </span>
      </div>

      <div className="mt-2 h-16 rounded-[1em] bg-white/6 px-3 py-2.5 text-[0.625em] font-bold ring-1 ring-white/8">
        {data.nextLabel}
      </div>

      <div className="mt-auto flex items-center gap-2.5 self-center">
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[0.5625em] font-semibold">
          <House className="size-3" />
          {data.home}
        </span>
        <CalendarDays className="size-3.5 text-foreground/70" />
      </div>
      <span className="mt-3 mb-1 h-1 w-20 self-center rounded-full bg-foreground/80" />
    </div>
  )
}

export { HeroScene }
