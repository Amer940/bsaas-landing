import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Share,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Panel, ScheduleRow } from './feature-demos'
import type { FeatureDemos, StepDemos } from '#/content/feature-demos'

/*
 * App screens for the "How it works" steps, built from the same pieces as the
 * feature cards. Decorative: the steps describe themselves in text.
 */

/** A bare app screen: rounded, dark, sized to its content. */
function AppScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-[32px] bg-[#0e0e0e] p-4.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.09),0_30px_60px_rgba(0,0,0,.45)]">
      {children}
    </div>
  )
}

function ScreenHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-full bg-white/8">
        <ArrowLeft className="size-4" />
      </span>
      <span className="text-center text-[0.75rem] font-semibold text-foreground/60">
        {title}
      </span>
      {action ? (
        <span className="rounded-full bg-foreground px-3 py-1.5 text-[0.75rem] font-bold text-background">
          {action}
        </span>
      ) : (
        <span className="w-9" />
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="pl-1 text-[0.6875rem] text-foreground/55">{label}</span>
      <span className="rounded-2xl bg-white/7 px-3.5 py-3 text-[0.875rem] font-semibold">
        {value}
      </span>
    </div>
  )
}

function SettingsScreen({ data }: { data: StepDemos['settings'] }) {
  return (
    <AppScreen>
      <ScreenHeader title={data.header} action={data.save} />
      <h4 className="m-0 mt-1 text-xl font-bold tracking-[-0.02em]">
        {data.title}
      </h4>
      <div
        className="relative flex h-24 items-end rounded-2xl bg-[#3a3128] p-2.5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 3px, transparent 3px 9px)',
        }}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#1d4a3a] text-[0.625rem] font-extrabold tracking-wider text-[#e8dcc4] ring-4 ring-[#0e0e0e]/60">
          BRKO
        </span>
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[0.625rem] font-bold">
          <Camera className="size-3" />
          {data.cover}
        </span>
      </div>
      {data.fields.map((field) => (
        <Field key={field.label} {...field} />
      ))}
      <Panel className="px-3.5">
        {data.rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 border-white/8 py-3 not-first:border-t"
          >
            <span className="flex-1 text-[0.8125rem] font-bold">
              {row.label}
            </span>
            <span className="text-[0.75rem] text-foreground/55">
              {row.value}
            </span>
            <ChevronRight className="size-3.5 text-foreground/50" />
          </div>
        ))}
      </Panel>
    </AppScreen>
  )
}

/** Deterministic QR-looking pattern: three finder squares plus noise. */
function FakeQr({ seed }: { seed: string }) {
  const size = 21
  let state = [...seed].reduce((n, ch) => n * 31 + ch.charCodeAt(0), 7)
  const random = () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9)
  const modules: Array<[number, number]> = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inFinder(x, y) && random() > 0.52) modules.push([x, y])
    }
  }
  const finders = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ]

  return (
    <svg viewBox={`-1 -1 ${size + 2} ${size + 2}`} className="size-full">
      <rect
        x="-1"
        y="-1"
        width={size + 2}
        height={size + 2}
        rx="2"
        fill="#f2efe6"
      />
      {modules.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          fill="#141414"
        />
      ))}
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`} fill="none" stroke="#141414">
          <rect x={x + 0.5} y={y + 0.5} width="6" height="6" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#141414" />
        </g>
      ))}
    </svg>
  )
}

function CodeScreen({ data }: { data: StepDemos['code'] }) {
  return (
    <AppScreen>
      <ScreenHeader title={data.title} />
      <div>
        <h4 className="m-0 mt-1 text-xl font-bold tracking-[-0.02em]">
          {data.title}
        </h4>
        <p className="m-0 mt-1 text-[0.75rem] leading-normal text-foreground/55">
          {data.body}
        </p>
      </div>
      <Panel className="flex flex-col gap-3 p-3.5">
        <span className="eyebrow text-[0.625rem]">{data.codeLabel}</span>
        <span className="grid grid-cols-6 gap-1.5">
          {[...data.code].map((char, i) => (
            <span
              key={i}
              className="flex h-10 items-center justify-center rounded-xl bg-white/8 text-base font-extrabold"
            >
              {char}
            </span>
          ))}
        </span>
        <span className="grid grid-cols-2 gap-2 text-[0.8125rem] font-bold">
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-white/8">
            <Copy className="size-3.5" />
            {data.copy}
          </span>
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground">
            <Share className="size-3.5" />
            {data.share}
          </span>
        </span>
      </Panel>
      <Panel className="flex items-center gap-3.5 p-3">
        <span className="size-22 shrink-0 overflow-hidden rounded-xl">
          <FakeQr seed={data.code} />
        </span>
        <span className="leading-tight">
          <span className="block text-[0.875rem] font-bold">
            {data.qrTitle}
          </span>
          <span className="mt-1 block text-[0.6875rem] text-foreground/55">
            {data.qrBody}
          </span>
        </span>
      </Panel>
    </AppScreen>
  )
}

function NewBookingScreen({
  data,
  schedule,
}: {
  data: StepDemos['booking']
  schedule: FeatureDemos['schedule']
}) {
  // The afternoon of the schedule, with the last booking as the new one.
  const rows = schedule.rows
    .slice(-4)
    .map((row, i, all) =>
      i === all.length - 1
        ? { ...row, current: true }
        : { ...row, current: false },
    )

  return (
    <AppScreen>
      <div className="flex items-center gap-3 rounded-2xl bg-[#222] p-3 shadow-[0_12px_30px_rgba(0,0,0,.5),inset_0_0_0_1px_rgba(255,255,255,.08)]">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8fe0a0] text-[#13361d]">
          <Check className="size-4" strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.875rem] font-bold">
            {data.toastTitle}
          </span>
          <span className="block truncate text-[0.6875rem] text-foreground/60">
            {data.toastBody}
          </span>
        </span>
        <X className="size-3.5 text-foreground/60" />
      </div>

      <div className="grid grid-cols-6 gap-1">
        {schedule.days.map((day, i) => (
          <span
            key={day}
            className={
              i === schedule.activeDay
                ? 'flex flex-col items-center rounded-xl bg-foreground py-1 leading-tight text-background'
                : 'flex flex-col items-center rounded-xl bg-white/6 py-1 leading-tight'
            }
          >
            <span className="text-[0.5625rem] font-semibold opacity-60">
              {day}
            </span>
            <span className="text-[0.8125rem] font-bold">
              {schedule.dates[i]}
            </span>
          </span>
        ))}
      </div>

      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {rows.map((row, i) => (
          <li key={row.time} className="relative flex items-center gap-2.5">
            <span className="w-10 shrink-0 text-[0.75rem] font-semibold text-foreground/80 tabular-nums">
              {row.time}
            </span>
            <ScheduleRow row={row} data={schedule} />
            {i === rows.length - 1 && (
              <span className="absolute -top-1.5 right-2 rounded-full bg-[#8fe0a0] px-1.5 py-px text-[0.5625rem] font-extrabold text-[#13361d] uppercase">
                {data.newBadge}
              </span>
            )}
          </li>
        ))}
      </ul>
    </AppScreen>
  )
}

export { CodeScreen, NewBookingScreen, SettingsScreen }
