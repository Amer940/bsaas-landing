import { useState } from 'react'
import { EmailInput } from '../ui/input'
import { RichText } from '../rich-text'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'
import { joinWaitlist } from '#/lib/waitlist'

type Status = 'idle' | 'pending' | 'success' | 'error'

export function CTASection() {
  const { locale } = useLocale()
  const c = landingContent[locale].cta
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (email: string) => {
    setStatus('pending')
    try {
      await joinWaitlist(email, locale)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="prijava"
      className="mx-auto max-w-300 scroll-mt-24 px-5 py-10 md:py-17.5 xl:px-0"
    >
      <div className="flex flex-col items-center rounded-[28px] bg-[#181818] bg-[radial-gradient(70%_120%_at_50%_0%,rgba(255,255,255,.12),rgba(255,255,255,.02)_60%)] px-6 py-12 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] md:rounded-[36px] md:px-10 md:py-18">
        <h2 className="m-0 text-[2rem] leading-[1.05] font-bold tracking-[-0.035em] md:text-5xl">
          <RichText text={c.title} />
        </h2>
        <p className="m-0 mt-3.5 max-w-115 text-base leading-normal text-foreground/65 md:text-[1.0625rem]">
          {c.body}
        </p>
        <div className="mt-7 flex w-full flex-col items-center">
          {status === 'success' ? (
            <p role="status" className="m-0 text-base font-semibold">
              {c.success}
            </p>
          ) : (
            <>
              <EmailInput
                placeholder={c.emailPlaceholder}
                buttonLabel={c.submit}
                onSubmit={handleSubmit}
                disabled={status === 'pending'}
              />
              {status === 'error' && (
                <p role="alert" className="m-0 mt-3 text-sm">
                  {c.error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
