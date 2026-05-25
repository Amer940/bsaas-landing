import * as React from 'react'
import { Button } from './button'
import { cn } from '#/lib/utils.ts'

interface EmailInputProps {
  placeholder?: string
  buttonLabel?: string
  onSubmit?: (email: string) => void
  className?: string
}

function EmailInput({
  placeholder = 'Enter Email',
  buttonLabel = 'Sign Up',
  onSubmit,
  className,
}: EmailInputProps) {
  const [value, setValue] = React.useState('')

  const handleSubmit = () => {
    onSubmit?.(value)
  }

  return (
    <div
      className={cn(
        'flex items-center h-10 w-99 rounded-full bg-white pr-1 py-1 pl-5',
        className,
      )}
    >
      <input
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex-1 min-w-0 bg-transparent outline-none border-none',
          'font-sans text-[0.75rem] font-medium tracking-[-0.015em]',
          'text-foreground placeholder:text-muted-fg',
        )}
      />
      <Button variant="submit" onClick={handleSubmit}>
        {buttonLabel}
      </Button>
    </div>
  )
}

export { EmailInput }
