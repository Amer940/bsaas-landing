import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils.ts'

const sectionVariants = cva('w-full max-w-[1440px] mx-auto px-2 md:px-0', {
  variants: {
    border: {
      none: '',
      sides: 'border-x border-[var(--border)]',
    },
    padding: {
      default: 'md:py-20 py-10',
      small: 'md:pt-[48px] md:pb-[50px] pt-[32px] pb-[20px]',
    },
  },
  defaultVariants: {
    border: 'none',
    padding: 'default',
  },
})

function Section({
  className,
  border,
  padding,
  ...props
}: React.ComponentProps<'section'> & VariantProps<typeof sectionVariants>) {
  return (
    <section
      className={cn(sectionVariants({ border, padding }), className)}
      {...props}
    />
  )
}

export { Section, sectionVariants }
