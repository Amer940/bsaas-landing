import * as React from 'react'
import { cn } from '#/lib/utils.ts'

function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'w-full md:max-w-[1440px] mx-auto md:px-[109px] px-4',
        className,
      )}
      {...props}
    />
  )
}

export { Container }
