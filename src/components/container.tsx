import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils.ts'

const containerVariants = cva('w-full max-w-[76.5rem] mx-auto px-4', {
  variants: {
    border: {
      none: '',
      bottom: 'border-b border-[var(--border)]',
    },
  },
  defaultVariants: {
    border: 'none',
  },
})

function Container({
  className,
  border,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof containerVariants>) {
  return (
    <div className={cn(containerVariants({ border }), className)} {...props} />
  )
}

export { Container, containerVariants }
