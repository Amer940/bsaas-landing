import * as React from 'react'
import { cn } from '#/lib/utils.ts'

function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full md:max-w-306 mx-auto md:px-4 px-3', className)}
      {...props}
    />
  )
}

export { Container }
