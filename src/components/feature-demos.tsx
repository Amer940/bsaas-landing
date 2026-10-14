import {
  ArrowUp,
  Check,
  ChevronRight,
  Plus,
  Repeat,
  User,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '#/lib/utils.ts'
import type { FeatureDemos } from '#/content/feature-demos'

/*
 * Pieces of the chairo app rebuilt in HTML for the feature cards. They are
 * illustrations: the cards hide them from screen readers and describe the
 * feature in their own heading instead.
 */

const AVATAR_TONES = ['#8c7b6b', '#6b7a8c', '#8c6b78', '#7a8c6b', '#8c826b']

function Avatar({ name, className }: { name: string; className?: string }) {
  const tone = AVATAR_TONES[name.charCodeAt(0) % AVATAR_TONES.length]
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-bold text-white/90',
        className,
      )}
      style={{ background: `linear-gradient(160deg, ${tone}, #3a3633)` }}
    >
      {name[0]}
    </span>
  )
}

/** Rounded panel that groups rows, like the app's list cards. */
function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-[20px] bg-white/7 shadow-[inset_0_1px_0_rgba(255,255,255,.1),inset_0_0_0_1px_rgba(255,255,255,.06)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function ScheduleDemo({ data }: { data: FeatureDemos['schedule'] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-6 gap-1.5">
        {data.days.map((day, i) => (
          <span
            key={day}
            className={cn(
              'flex flex-col items-center rounded-xl py-1.5 leading-tight',
              i === data.activeDay
                ? 'bg-foreground text-background'
                : 'bg-white/6',
            )}
          >
            <span className="text-[0.625rem] font-semibold opacity-60">
              {day}
            </span>
            <span className="text-[0.9375rem] font-bold">{data.dates[i]}</span>
          </span>
        ))}
      </div>

      <div className="flex items-baseline justify-between text-[0.8125rem]">
        <span className="font-bold">{data.date}</span>
        <span className="text-foreground/50">{data.summary}</span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {data.rows.map((row) => (
          <li key={row.time} className="flex items-center gap-2.5">
            <span
              className={cn(
                'w-10 shrink-0 text-[0.75rem] font-semibold tabular-nums',
                row.kind === 'done' || row.kind === 'free'
                  ? 'text-foreground/40'
                  : 'text-foreground/80',
              )}
            >
              {row.time}
            </span>
            <ScheduleRow row={row} data={data} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScheduleRow({
  row,
  data,
}: {
  row: FeatureDemos['schedule']['rows'][number]
  data: FeatureDemos['schedule']
}) {
  const box = 'flex min-h-12 flex-1 items-center gap-2.5 rounded-xl px-2.5'

  if (row.kind === 'break') {
    return (
      <div className="relative flex-1">
        <span className="absolute -top-1 left-0 right-0 h-px bg-foreground/70">
          <span className="absolute -left-1 -top-[3px] size-[7px] rounded-full bg-foreground" />
        </span>
        <div
          className={cn(box, 'justify-between bg-white/5')}
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 6px, transparent 6px 12px)',
          }}
        >
          <span className="leading-tight">
            <span className="block text-[0.8125rem] font-bold">
              {data.breakTitle}
            </span>
            <span className="block text-[0.6875rem] text-foreground/55">
              {data.breakNote}
            </span>
          </span>
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[0.625rem] font-extrabold uppercase text-background">
            {data.now}
          </span>
        </div>
      </div>
    )
  }

  if (row.kind === 'free') {
    return (
      <div
        className={cn(
          box,
          'justify-between border border-dashed border-white/12 text-[0.8125rem]',
        )}
      >
        <span className="text-foreground/60">{data.free}</span>
        <span className="flex items-center gap-1 font-bold">
          <Plus className="size-3.5" strokeWidth={2.5} />
          {data.book}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        box,
        'bg-white/7',
        row.kind === 'done' && 'opacity-45',
        row.current && 'ring-[1.5px] ring-foreground/85',
      )}
    >
      {row.guest ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/8">
          <User className="size-3.5" />
        </span>
      ) : (
        <Avatar name={row.name ?? ''} className="size-7 text-[0.6875rem]" />
      )}
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[0.8125rem] font-bold">
          {row.name}
        </span>
        <span className="block truncate text-[0.6875rem] text-foreground/55">
          {row.service} · {row.until}
        </span>
      </span>
      {row.kind === 'done' ? (
        <Check className="size-3.5 text-foreground/60" />
      ) : (
        <span className="text-[0.75rem] font-bold tabular-nums">
          {row.price}
        </span>
      )}
    </div>
  )
}

function BookingDemo({ data }: { data: FeatureDemos['booking'] }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2">
        {data.barbers.map((barber, i) => (
          <span
            key={barber.name}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-2xl py-3',
              i === 0
                ? 'bg-white/10 ring-[1.5px] ring-foreground/85'
                : 'bg-white/5 opacity-60',
            )}
          >
            <Avatar name={barber.name} className="size-10" />
            <span className="text-center leading-tight">
              <span className="block text-[0.8125rem] font-bold">
                {barber.name}
              </span>
              <span className="block text-[0.625rem] text-foreground/55">
                {barber.note}
              </span>
            </span>
          </span>
        ))}
      </div>

      <Panel className="flex items-center justify-between px-4 py-3">
        <span className="leading-tight">
          <span className="block text-[0.9375rem] font-bold">
            {data.service.name}
          </span>
          <span className="block text-[0.6875rem] text-foreground/55">
            {data.service.meta}
          </span>
        </span>
        <span className="text-[0.9375rem] font-bold">{data.service.price}</span>
      </Panel>

      <div className="flex items-center gap-1.5">
        <span className="mr-1 text-[0.75rem] font-bold text-foreground/60">
          {data.day}
        </span>
        {data.times.map((time, i) => (
          <span
            key={time}
            className={cn(
              'flex-1 rounded-full py-1.5 text-center text-[0.75rem] font-bold tabular-nums',
              i === data.activeTime
                ? 'bg-foreground text-background'
                : 'bg-white/7 text-foreground/70',
            )}
          >
            {time}
          </span>
        ))}
      </div>
    </div>
  )
}

function RecurringDemo({ data }: { data: FeatureDemos['recurring'] }) {
  return (
    <Panel className="px-3.5">
      {data.rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center gap-3 border-white/8 py-3 not-first:border-t"
        >
          <Avatar name={row.name} />
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-bold">{row.name}</span>
            <span className="block truncate text-[0.75rem] text-foreground/55">
              {row.rule}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/8 px-2 py-1 text-[0.6875rem] font-bold">
            <Repeat className="size-3" strokeWidth={2.5} />
            {data.badge}
          </span>
        </div>
      ))}
    </Panel>
  )
}

const hatched = {
  backgroundImage:
    'repeating-linear-gradient(135deg, rgba(255,255,255,.28) 0 2px, transparent 2px 6px)',
}

function EarningsDemo({ data }: { data: FeatureDemos['earnings'] }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Panel className="px-4 pt-3.5 pb-3">
        <span className="eyebrow block text-[0.625rem]">{data.label}</span>
        <span className="mt-1 flex items-center gap-2">
          <span className="text-[2rem] leading-none font-bold tracking-[-0.03em] tabular-nums">
            {data.amount}
          </span>
          <span className="flex items-center gap-0.5 rounded-full bg-[#2d4a33] px-1.5 py-0.5 text-[0.625rem] font-bold text-[#8fe0a0]">
            <ArrowUp className="size-2.5" strokeWidth={3} />
            {data.change}
          </span>
        </span>
        <span className="mt-1 block text-[0.6875rem] text-foreground/50">
          {data.note}
        </span>

        <div className="mt-3 grid h-16 grid-cols-7 items-end gap-2">
          {data.bars.map((bar, i) => (
            <span key={i} className="flex h-full flex-col justify-end gap-0.5">
              {bar.booked > 0 && (
                <span
                  className="rounded-md bg-white/4 ring-1 ring-white/12 ring-inset"
                  style={{ height: `${bar.booked * 100}%`, ...hatched }}
                />
              )}
              {bar.done > 0 && (
                <span
                  className="rounded-md bg-foreground"
                  style={{ height: `${bar.done * 100}%` }}
                />
              )}
              {bar.done + bar.booked === 0 && (
                <span className="h-0.5 rounded-full bg-white/12" />
              )}
            </span>
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-2 text-center text-[0.625rem] font-bold">
          {data.days.map((day, i) => (
            <span
              key={i}
              className={
                i === data.activeDay ? 'text-foreground' : 'text-foreground/45'
              }
            >
              {day}
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-3 text-[0.625rem] text-foreground/50">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-[3px] bg-foreground" />
            {data.done}
          </span>
          <span className="flex items-center gap-1">
            <span
              className="size-2 rounded-[3px] ring-1 ring-white/20 ring-inset"
              style={hatched}
            />
            {data.booked}
          </span>
        </div>
      </Panel>

      <Panel className="flex items-center gap-3 px-3.5 py-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/8">
          <X className="size-3.5" strokeWidth={2.5} />
        </span>
        <span className="leading-tight">
          <span className="block text-[0.8125rem] font-bold">
            {data.noShows}
          </span>
          <span className="block text-[0.6875rem] text-foreground/55">
            {data.noShowsNote}
          </span>
        </span>
      </Panel>
    </div>
  )
}

function TeamDemo({ data }: { data: FeatureDemos['team'] }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3 rounded-[20px] bg-foreground px-3.5 py-3 text-background">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background text-[0.8125rem] font-bold text-foreground">
          {data.request.count}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-sm font-bold">{data.request.title}</span>
          <span className="block truncate text-[0.6875rem] opacity-65">
            {data.request.note}
          </span>
        </span>
        <ChevronRight className="size-4" strokeWidth={2.5} />
      </div>
      <Panel className="px-3.5">
        {data.rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center gap-3 border-white/8 py-3 not-first:border-t"
          >
            <Avatar name={row.name} />
            <span className="min-w-0 flex-1 truncate text-sm font-bold">
              {row.name}
            </span>
            <span className="flex gap-1">
              {row.week.map((state, i) => (
                <span
                  key={i}
                  className={cn(
                    'flex size-5.5 items-center justify-center rounded-full text-[0.625rem] font-extrabold',
                    state === 1 && 'bg-foreground text-background',
                    state === 0.5 && 'bg-white/30 text-background',
                    state === 0 && 'bg-white/6 text-foreground/35',
                  )}
                >
                  {data.days[i]}
                </span>
              ))}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  )
}

export {
  Avatar,
  BookingDemo,
  EarningsDemo,
  Panel,
  RecurringDemo,
  ScheduleDemo,
  ScheduleRow,
  TeamDemo,
}
