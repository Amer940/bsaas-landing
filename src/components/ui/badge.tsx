import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '#/lib/utils.ts'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-white/8 text-foreground/80',
        info: 'bg-[#7cb4ff]/12 text-[#7cb4ff]',
        success: 'bg-[#6fdc9a]/12 text-[#6fdc9a]',
        warning: 'bg-[#f5c451]/12 text-[#f5c451]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
