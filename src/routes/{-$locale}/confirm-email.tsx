import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { AuthCard } from '#/components/auth-card'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import { confirmEmailContent } from '#/content/confirm-email'
import { supabase } from '#/lib/supabase'

// Where the sign-up confirmation email's button lands (the link is built in
// the app repo's supabase/functions/auth-email). Confirms on the press of a
// button, not on opening, so a mail scanner opening the link first can't use
// it up. The session it gives is dropped straight away: the account lives in
// the app, which signs in by itself if it's still open (screens/confirm-email).

export const Route = createFileRoute('/{-$locale}/confirm-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token_hash:
      typeof search.token_hash === 'string' ? search.token_hash : undefined,
  }),
  component: ConfirmEmailPage,
})

type Status = 'ready' | 'confirming' | 'done' | 'expired'

function ConfirmEmailPage() {
  const { locale } = useLocale()
  const c = confirmEmailContent[locale]
  const { token_hash: tokenHash } = Route.useSearch()

  const [status, setStatus] = useState<Status>(tokenHash ? 'ready' : 'expired')
  const [failed, setFailed] = useState(false)

  async function handleConfirm() {
    if (status === 'confirming' || !tokenHash) return
    setFailed(false)
    setStatus('confirming')

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email',
    })
    if (error) {
      // Expired, already used, or never valid: all the same to the reader.
      const spent = error.code === 'otp_expired' || error.status === 403
      setStatus(spent ? 'expired' : 'ready')
      setFailed(!spent)
      return
    }

    // Only this browser's session; the app signs in on its own.
    await supabase.auth.signOut({ scope: 'local' })
    setStatus('done')
  }

  return (
    <AuthCard metaTitle={c.metaTitle} homeLabel={c.home}>
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
        <div>
          <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
            {c.title}
          </h1>
          <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
            {c.subtitle}
          </p>
          {failed && (
            <p role="alert" className="m-0 mt-4 text-sm text-[#ff8a7e]">
              {c.failed}
            </p>
          )}
          <Button
            size="lg"
            className="mt-7 w-full"
            onClick={handleConfirm}
            disabled={status === 'confirming'}
          >
            {status === 'confirming' ? c.submitting : c.submit}
          </Button>
        </div>
      )}
    </AuthCard>
  )
}
