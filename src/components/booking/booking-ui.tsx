import type { ReactNode } from 'react'
import { ArrowLeft, Phone } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { bookContent } from '#/content/book'
import { useLocale } from '#/i18n/locale-context'
import { cn } from '#/lib/utils'

// Small pieces the booking pages share, in the style of the auth cards
// (AuthCard, reset-password): white/8 fields, the coral error colour.

export function StepHeader({
  step,
  of,
  onBack,
  shopName,
}: {
  /** 1-based; `of` + 1 fills the bar (done). */
  step: number
  of: number
  onBack?: () => void
  shopName: string
}) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  const fill = Math.min(step / of, 1)

  return (
    <div className="mb-7">
      <div className="flex h-9 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={c.back}
            className="-ml-2 flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-white/8 hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-foreground/65">
          {shopName}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={c.progress(Math.min(step, of), of)}
        aria-valuemin={0}
        aria-valuemax={of}
        aria-valuenow={Math.min(step, of)}
        className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-500 ease-smooth"
          style={{ width: `${fill * 100}%` }}
        />
      </div>
    </div>
  )
}

export function StepTitle({
  children,
  body,
}: {
  children: ReactNode
  body?: ReactNode
}) {
  return (
    <>
      <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
        {children}
      </h1>
      {body ? (
        <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
          {body}
        </p>
      ) : null}
    </>
  )
}

/** One choice in a list (a barber, a service). */
export function OptionRow({
  onClick,
  selected,
  children,
}: {
  onClick: () => void
  selected?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-4 rounded-2xl bg-white/8 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none',
        selected && 'ring-2 ring-foreground/60',
      )}
    >
      {children}
    </button>
  )
}

/** A round photo, or the name's initial when there's none. */
export function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      aria-hidden
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-bold"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}

export function Notice({
  tone = 'error',
  children,
  className,
}: {
  tone?: 'error' | 'info'
  children: ReactNode
  className?: string
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'm-0 rounded-2xl px-4 py-3 text-sm leading-normal',
        tone === 'error'
          ? 'bg-[#ff8a7e]/12 text-[#ff8a7e]'
          : 'bg-white/8 text-foreground/80',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** The shop's phone as a button: the way on when the page can't book. */
export function CallShopButton({
  phone,
  className,
}: {
  phone: string | null
  className?: string
}) {
  const { locale } = useLocale()
  if (!phone) return null
  return (
    <Button asChild size="lg" className={cn('w-full', className)}>
      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
        <Phone />
        {bookContent[locale].call(phone)}
      </a>
    </Button>
  )
}

export function Loading() {
  const { locale } = useLocale()
  return (
    <div role="status" className="flex flex-col gap-3" aria-live="polite">
      <span className="sr-only">{bookContent[locale].loading}</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden
          className="h-19 animate-pulse rounded-2xl bg-white/6 motion-reduce:animate-none"
        />
      ))}
    </div>
  )
}

export function LoadFailed({ onRetry }: { onRetry: () => void }) {
  const { locale } = useLocale()
  const c = bookContent[locale]
  return (
    <div className="flex flex-col items-start gap-4">
      <Notice>{c.loadFailed}</Notice>
      <Button type="button" variant="outline" onClick={onRetry}>
        {c.retry}
      </Button>
    </div>
  )
}

/** A labelled text field, as on the reset-password page. */
export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  // The message sits outside the label, so it isn't read as the field's name.
  return (
    <div>
      <label className="block">
        <span className="text-sm text-foreground/65">{label}</span>
        <span className="mt-1.5 block">{children}</span>
      </label>
      {error ? (
        <span role="alert" className="mt-1.5 block text-sm text-[#ff8a7e]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-sm text-foreground/50">{hint}</span>
      ) : null}
    </div>
  )
}
