import type { ReactNode } from 'react'
import { Logo } from '#/components/logo'
import { LocalizedLink } from '#/i18n/localized-link'
import { Seo } from '#/i18n/seo'

interface AuthCardProps {
  metaTitle: string
  homeLabel: string
  children: ReactNode
}

/**
 * The page an auth email's button opens (reset password, email changed), and
 * the 404: the
 * wordmark over one dark card, kept out of search results.
 */
function AuthCard({ metaTitle, homeLabel, children }: AuthCardProps) {
  return (
    <>
      <Seo title={metaTitle} />
      <meta name="robots" content="noindex" />
      <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-16">
        <LocalizedLink to="/" aria-label={homeLabel}>
          <Logo />
        </LocalizedLink>
        <div className="mt-10 w-full max-w-110 rounded-[28px] bg-[#181818] bg-[radial-gradient(70%_120%_at_50%_0%,rgba(255,255,255,.10),rgba(255,255,255,.02)_60%)] px-6 py-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] md:px-9 md:py-12">
          {children}
        </div>
      </main>
    </>
  )
}

export { AuthCard }
