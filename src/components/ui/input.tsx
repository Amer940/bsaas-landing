import * as React from 'react'
import { Button } from './button'
import { cn } from '#/lib/utils.ts'

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
        'flex items-center h-10 md:w-99 w-full rounded-full bg-white pr-1 py-1 pl-5',
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
          'font-sans text-[0.75rem] font-medium tracking-[-0.015em]',
          'text-foreground placeholder:text-muted-fg',
        )}
      />
      <Button variant="submit" type="submit" disabled={disabled}>
        {buttonLabel}
      </Button>
    </form>
  )
}

export { EmailInput }
