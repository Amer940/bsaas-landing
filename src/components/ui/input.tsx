import * as React from 'react'
import { Button } from './button'
import { cn } from '#/lib/utils.ts'

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-lg border-none bg-white/8 px-4 text-base text-foreground outline-none transition-shadow duration-250 placeholder:text-foreground/45 focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-[#ff8a7e]/70',
        className,
      )}
      {...props}
    />
  )
}

interface EmailInputProps {
  placeholder?: string
  buttonLabel?: string
  onSubmit?: (email: string) => void
  disabled?: boolean
  className?: string
}

function EmailInput({
  placeholder = 'Enter Email',
  buttonLabel = 'Sign Up',
  onSubmit,
  disabled,
  className,
}: EmailInputProps) {
  const [value, setValue] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 w-full max-w-105 rounded-full bg-white/8 p-1.5 pl-5 focus-within:ring-2 focus-within:ring-foreground/30',
        className,
      )}
    >
      <input
        type="email"
        required
        aria-label={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex-1 min-w-0 bg-transparent outline-none border-none',
          'font-sans text-base md:text-[0.9375rem] text-foreground placeholder:text-foreground/45',
        )}
      />
      <Button variant="submit" type="submit" disabled={disabled}>
        {buttonLabel}
      </Button>
    </form>
  )
}

export { Input, EmailInput }
