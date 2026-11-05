import type { ReactNode } from 'react'
import { cn } from '#/lib/utils.ts'

interface SectionHeadingProps {
  eyebrow: string
  children: ReactNode
  className?: string
}

/**
 * Eyebrow label plus a large section title; left-aligned on phones. The
 * eyebrow is part of the heading, so the heading text says what the section
 * is ("How it works: …"), not just the slogan.
 */
function SectionHeading({ eyebrow, children, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start text-left md:items-center md:text-center',
        className,
      )}
    >
      <h2 className="section-title m-0">
        <span className="eyebrow mb-3.5 block">{eyebrow}</span>
        <span className="sr-only">: </span>
        {children}
      </h2>
    </div>
  )
}

export { SectionHeading }
