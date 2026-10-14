import { cn } from '#/lib/utils.ts'

/** The "chairo." wordmark. */
function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-2xl font-extrabold tracking-[-0.04em] text-foreground',
        className,
      )}
    >
      chairo
      <span
        aria-hidden="true"
        className="mt-2 size-[0.3em] rounded-full bg-current"
      />
    </span>
  )
}

export { Logo }
