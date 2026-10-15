import { useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { AuthCard } from '#/components/auth-card'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import { deleteAccountFormContent } from '#/content/delete-account-form'
import { supabase } from '#/lib/supabase'
import { cn } from '#/lib/utils.ts'

// Account deletion on the web, linked from /delete-account (and given to the
// Play Console as the deletion URL). Sign in, read what goes, confirm. The
// server re-checks the password and does everything in delete_my_account
// (app repo, supabase/migrations/20261015120000_owner_account_deletion.sql):
// an owner's shops close first, their clients and team are notified. There's
// no hand-over to another owner. Storage files go with the cleanup run the
// deletion triggers.

export const Route = createFileRoute('/{-$locale}/delete-account_/confirm')({
  component: DeleteAccountConfirmPage,
})

type Step = 'sign-in' | 'confirm' | 'done'

interface Signed {
  email: string
  password: string
  ownedShops: Array<string>
}

function DeleteAccountConfirmPage() {
  const { locale } = useLocale()
  const c = deleteAccountFormContent[locale]

  const [step, setStep] = useState<Step>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signed, setSigned] = useState<Signed | null>(null)
  const [understood, setUnderstood] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    if (!email.trim() || !password) {
      setError(c.missing)
      return
    }

    setError(null)
    setBusy(true)
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email: email.trim(), password },
    )
    if (signInError) {
      setBusy(false)
      setError(
        signInError.code === 'invalid_credentials'
          ? c.wrongCredentials
          : c.failed,
      )
      return
    }

    const { data: shops, error: shopsError } =
      await supabase.rpc('list_my_businesses')
    setBusy(false)
    if (shopsError) {
      await supabase.auth.signOut({ scope: 'local' })
      setError(c.failed)
      return
    }

    const ownedShops = (
      (shops ?? []) as Array<{ name: string; my_role: string }>
    )
      .filter((shop) => shop.my_role === 'owner')
      .map((shop) => shop.name)

    setSigned({ email: data.user.email ?? email.trim(), password, ownedShops })
    setPassword('')
    setUnderstood(false)
    setStep('confirm')
  }

  async function handleDelete() {
    if (!signed || !understood || busy) return

    setError(null)
    setBusy(true)
    const { data, error: deleteError } = await supabase.rpc(
      'delete_my_account',
      {
        p_password: signed.password,
        p_close_shops: signed.ownedShops.length > 0,
      },
    )
    setBusy(false)

    if (deleteError || data !== 'deleted') {
      setError(data === 'too_many_attempts' ? c.tooManyAttempts : c.failed)
      return
    }

    // The account and its sessions are gone; drop what's left in the browser.
    await supabase.auth.signOut({ scope: 'local' })
    setSigned(null)
    setStep('done')
  }

  async function handleCancel() {
    await supabase.auth.signOut({ scope: 'local' })
    setSigned(null)
    setError(null)
    setStep('sign-in')
  }

  return (
    <AuthCard metaTitle={c.metaTitle} homeLabel={c.home}>
      {step === 'done' ? (
        <div role="status" className="animate-fade-up">
          <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
            {c.doneTitle}
          </h1>
          <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
            {c.doneBody}
          </p>
          <Button asChild variant="outline" className="mt-7">
            <LocalizedLink to="/">{c.home}</LocalizedLink>
          </Button>
        </div>
      ) : step === 'confirm' && signed ? (
        <div>
          <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
            {c.confirmTitle}
          </h1>
          <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
            {c.confirmBody(signed.email)}
          </p>

          {signed.ownedShops.length > 0 && (
            <Section
              title={c.shopTitle}
              items={[
                c.shopClosed(signed.ownedShops.join(', ')),
                c.shopClients,
                c.shopTeam,
                c.shopNoHandover,
              ]}
            />
          )}
          <Section title={c.deletedTitle} items={c.deleted} />
          <Section title={c.keptTitle} items={c.kept} />

          <label className="mt-7 flex cursor-pointer items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="size-4.5 accent-[#ff7a6e]"
            />
            {c.understand}
          </label>

          {error && (
            <p role="alert" className="m-0 mt-4 text-sm text-[#ff8a7e]">
              {error}
            </p>
          )}

          <Button
            type="button"
            size="lg"
            className="mt-7 w-full bg-[#ff7a6e] text-[#0a0a0a] hover:bg-[#ff7a6e]/85"
            disabled={!understood || busy}
            onClick={() => void handleDelete()}
          >
            {busy ? c.deleting : c.delete}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-3 w-full"
            disabled={busy}
            onClick={() => void handleCancel()}
          >
            {c.cancel}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} noValidate>
          <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
            {c.signInTitle}
          </h1>
          <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
            {c.signInBody}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <label className="block">
              <span className="text-sm text-foreground/65">{c.email}</span>
              <span className="mt-1.5 flex items-center rounded-2xl bg-white/8 px-5 transition-shadow duration-250 focus-within:ring-2 focus-within:ring-foreground/30">
                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  className="h-13 min-w-0 flex-1 border-none bg-transparent text-base text-foreground outline-none"
                />
              </span>
            </label>
            <PasswordField
              label={c.password}
              value={password}
              onChange={(value) => {
                setPassword(value)
                if (error) setError(null)
              }}
              showLabel={c.show}
              hideLabel={c.hide}
              invalid={!!error}
            />
          </div>

          {error && (
            <p role="alert" className="m-0 mt-4 text-sm text-[#ff8a7e]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-7 w-full"
            disabled={busy}
          >
            {busy ? c.signingIn : c.signIn}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

function Section({ title, items }: { title: string; items: Array<string> }) {
  return (
    <div className="mt-6">
      <h2 className="m-0 text-xs font-semibold tracking-[0.08em] text-foreground/50 uppercase">
        {title}
      </h2>
      <ul className="m-0 mt-2 list-disc space-y-1.5 pl-5 text-sm leading-normal text-foreground/75">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  showLabel: string
  hideLabel: string
  invalid?: boolean
}

function PasswordField({
  label,
  value,
  onChange,
  showLabel,
  hideLabel,
  invalid,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="text-sm text-foreground/65">{label}</span>
      <span
        className={cn(
          'mt-1.5 flex items-center rounded-2xl bg-white/8 pr-2 pl-5 transition-shadow duration-250 focus-within:ring-2 focus-within:ring-foreground/30',
          invalid && 'ring-2 ring-[#ff8a7e]/70 focus-within:ring-[#ff8a7e]/70',
        )}
      >
        <input
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
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
    </label>
  )
}
