import * as React from 'react'
import { cn } from '#/lib/utils.ts'

function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full max-w-[76.5rem] mx-auto px-4', className)}
      {...props}
    />
  )
}

export { Container }
