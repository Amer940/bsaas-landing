import * as React from 'react'
import { cn } from '#/lib/utils.ts'

function Section({ className, ...props }: React.ComponentProps<'section'>) {
  return <section className={cn('py-20', className)} {...props} />
}

export { Section }
