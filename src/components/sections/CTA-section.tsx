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
    <div id="prijava" className="md:px-4 px-2 scroll-mt-24">
      <div className="site-container site-border bg-white md:py-20 py-10 md:px-10">
        <div className="bg-black rounded-2xl md:px-10 px-5 md:py-20 py-12">
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center text-center mx-auto md:mb-8 mb-6">
              <h2 className="md:text-[50px] text-[36px] leading-[110%] tracking-[-0.015em] font-medium text-white">
                <RichText text={c.title} />
              </h2>
              <p className="md:text-[18px] text-[14px] font-normal text-white/70 mt-4 md:max-w-165 max-w-66.25">
                {c.body}
              </p>
            </div>
            {status === 'success' ? (
              <p
                role="status"
                className="md:text-[18px] text-[14px] font-medium text-white text-center"
              >
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
                  <p role="alert" className="text-[14px] text-white mt-3">
                    {c.error}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
