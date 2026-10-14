import type { ReactNode } from 'react'
import { cn } from '#/lib/utils.ts'

interface SectionHeadingProps {
  eyebrow: string
  children: ReactNode
  className?: string
}

/** Eyebrow label plus a large section title; left-aligned on phones. */
function SectionHeading({ eyebrow, children, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3.5 text-left md:items-center md:text-center',
        className,
      )}
    >
      <p className="eyebrow m-0">{eyebrow}</p>
      <h2 className="section-title m-0">{children}</h2>
    </div>
  )
}

export { SectionHeading }
