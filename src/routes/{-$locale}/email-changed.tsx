import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { AuthCard } from '#/components/auth-card'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import { emailChangedContent } from '#/content/email-changed'

// Where the email-change link lands (sent to the new address by the app
// repo's supabase/functions/auth-email). Supabase has already confirmed the
// change by the time the browser gets here; it redirects with a session in
// the hash on success and an error there (or in the query) otherwise. The
// session isn't used: the page only says how it went, and the tokens are
// wiped from the address bar. The app picks the new email up by itself.

export const Route = createFileRoute('/{-$locale}/email-changed')({
  component: EmailChangedPage,
})

type Status = 'done' | 'expired'

function readStatus(): Status {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const query = new URLSearchParams(window.location.search)
  if (hash.has('error') || query.has('error')) return 'expired'
  return hash.has('access_token') || query.has('code') ? 'done' : 'expired'
}

function EmailChangedPage() {
  const { locale } = useLocale()
  const c = emailChangedContent[locale]
  const [status] = useState(readStatus)

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  return (
    <AuthCard metaTitle={c.metaTitle} homeLabel={c.home}>
      <div role="status" className="animate-fade-up">
        <h1 className="m-0 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em]">
          {status === 'done' ? c.doneTitle : c.expiredTitle}
        </h1>
        <p className="m-0 mt-3 text-base leading-normal text-foreground/65">
          {status === 'done' ? c.doneBody : c.expiredBody}
        </p>
        {status === 'done' ? (
          <p className="m-0 mt-7 text-sm text-foreground/50">{c.closeHint}</p>
        ) : (
          <Button asChild variant="outline" className="mt-7">
            <LocalizedLink to="/">{c.home}</LocalizedLink>
          </Button>
        )}
      </div>
    </AuthCard>
  )
}
