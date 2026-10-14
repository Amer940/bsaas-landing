import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Logo } from '#/components/logo'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import { Seo } from '#/i18n/seo'
import {
  PASSWORD_MIN_LENGTH,
  resetPasswordContent,
} from '#/content/reset-password'
import { supabase } from '#/lib/supabase'
import { cn } from '#/lib/utils.ts'

// Where the password-reset email's button lands (the link is built in the
// app repo's supabase/functions/auth-email). The token is spent only when the
// form is sent, not on opening the page, so a mail scanner opening the link
// first can't use it up. Done, every session is signed out and the person
// goes back to the app to sign in.

export const Route = createFileRoute('/{-$locale}/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token_hash:
      typeof search.token_hash === 'string' ? search.token_hash : undefined,
  }),
  component: ResetPasswordPage,
})

type Status = 'form' | 'saving' | 'done' | 'expired'
type FieldErrors = { password?: string; confirm?: string; form?: string }

function ResetPasswordPage() {
  const { locale } = useLocale()
  const c = resetPasswordContent[locale]
  const { token_hash: tokenHash } = Route.useSearch()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>(tokenHash ? 'form' : 'expired')
  // The token works once: after it's verified, a password the server turns
  // down is retried on the session it gave rather than on the spent token.
  const verified = useRef(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'saving' || !tokenHash) return

    if (password.length < PASSWORD_MIN_LENGTH) {
      setErrors({ password: c.tooShort })
      return
    }
    if (confirm !== password) {
      setErrors({ confirm: c.mismatch })
      return
    }

    setErrors({})
    setStatus('saving')

    if (!verified.current) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery',
      })
      if (error) {
        // Expired, already used, or never valid: all the same to the reader.
        const spent = error.code === 'otp_expired' || error.status === 403
        setStatus(spent ? 'expired' : 'form')
        if (!spent) setErrors({ form: c.failed })
        return
      }
      verified.current = true
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus('form')
      if (error.code === 'same_password')
        setErrors({ password: c.samePassword })
      else if (error.code === 'weak_password')
        setErrors({ password: c.weakPassword })
      else setErrors({ form: c.failed })
      return
    }

    // Whoever knew the old password shouldn't stay signed in anywhere.
    await supabase.auth.signOut({ scope: 'global' })
    setStatus('done')
  }

  return (
    <>
      <Seo title={c.metaTitle} />
      <meta name="robots" content="noindex" />
      <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-16">
        <LocalizedLink to="/" aria-label={c.home}>
          <Logo />
        </LocalizedLink>

        <div className="mt-10 w-full max-w-110 rounded-[28px] bg-[#181818] bg-[radial-gradient(70%_120%_at_50%_0%,rgba(255,255,255,.10),rgba(255,255,255,.02)_60%)] px-6 py-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] md:px-9 md:py-12">
          {status === 'done' || status === 'expired' ? (
            <div role="status" className="animate-fade-up">
              <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
                {status === 'done' ? c.doneTitle : c.expiredTitle}
              </h1>
              <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
                {status === 'done' ? c.doneBody : c.expiredBody}
              </p>
              <Button asChild variant="outline" className="mt-7">
                <LocalizedLink to="/">{c.home}</LocalizedLink>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
                {c.title}
              </h1>
              <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
                {c.subtitle}
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <PasswordField
                  label={c.newPassword}
                  value={password}
                  onChange={(value) => {
                    setPassword(value)
                    if (errors.password) setErrors({})
                  }}
                  error={errors.password}
                  showLabel={c.show}
                  hideLabel={c.hide}
                  autoFocus
                />
                <PasswordField
                  label={c.repeatPassword}
                  value={confirm}
                  onChange={(value) => {
                    setConfirm(value)
                    if (errors.confirm) setErrors({})
                  }}
                  error={errors.confirm}
                  showLabel={c.show}
                  hideLabel={c.hide}
                />
              </div>

              {errors.form && (
                <p role="alert" className="m-0 mt-4 text-sm text-[#ff8a7e]">
                  {errors.form}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-7 w-full"
                disabled={status === 'saving'}
              >
                {status === 'saving' ? c.submitting : c.submit}
              </Button>
            </form>
          )}
        </div>
      </main>
    </>
  )
}

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  showLabel: string
  hideLabel: string
  autoFocus?: boolean
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  showLabel,
  hideLabel,
  autoFocus,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="text-sm text-foreground/65">{label}</span>
      <span
        className={cn(
          'mt-1.5 flex items-center rounded-2xl bg-white/8 pr-2 pl-5 transition-shadow duration-250 focus-within:ring-2 focus-within:ring-foreground/30',
          error && 'ring-2 ring-[#ff8a7e]/70 focus-within:ring-[#ff8a7e]/70',
        )}
      >
        <input
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className="h-13 min-w-0 flex-1 border-none bg-transparent text-base text-foreground outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          className="flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="size-4.5" />
          ) : (
            <Eye className="size-4.5" />
          )}
        </button>
      </span>
      {error && (
        <span role="alert" className="mt-1.5 block text-sm text-[#ff8a7e]">
          {error}
        </span>
      )}
    </label>
  )
}
