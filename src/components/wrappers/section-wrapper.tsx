import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils.ts'

const sectionVariants = cva('py-20 w-full max-w-[76.5rem] mx-auto', {
  variants: {
    border: {
      none: '',
      sides: 'border-x border-[var(--border)]',
    },
  },
  defaultVariants: {
    border: 'none',
  },
})

function Section({
  className,
  border,
  ...props
}: React.ComponentProps<'section'> & VariantProps<typeof sectionVariants>) {
  return (
    <section
      className={cn(sectionVariants({ border }), className)}
      {...props}
    />
  )
}

export { Section, sectionVariants }
