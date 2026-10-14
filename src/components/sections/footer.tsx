import { Logo } from '../logo'
import { NAV_LINKS } from '../navigation'
import { facebookIcon } from '../ui/facebook-icon'
import { instagramIcon } from '../ui/instagram-icon'
import { linkedInIcon } from '../ui/linkedIn-icon'
import { xIcon } from '../ui/x-icon'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'

const SOCIAL_LINKS = [
  { icon: facebookIcon, href: '#', label: 'Facebook' },
  { icon: instagramIcon, href: '#', label: 'Instagram' },
  { icon: xIcon, href: '#', label: 'X' },
  { icon: linkedInIcon, href: '#', label: 'LinkedIn' },
]

const LEGAL_LINKS = [
  { labelKey: 'footer.privacy', to: '/privacy' },
  { labelKey: 'footer.terms', to: '/terms' },
  { labelKey: 'footer.support', to: '/support' },
  { labelKey: 'footer.deleteAccount', to: '/delete-account' },
] as const

function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-300 px-5 pt-10 pb-12.5 xl:px-0">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <LocalizedLink
            to="/"
            aria-label={t('nav.home')}
            className="no-underline"
          >
            <Logo className="text-[1.375rem]" />
          </LocalizedLink>
          <ul className="flex items-center gap-5.5 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <LocalizedLink
                  to="/"
                  hash={link.hash}
                  className="text-sm font-semibold text-foreground/70 no-underline hover:text-foreground transition-colors duration-250"
                >
                  {t(link.labelKey)}
                </LocalizedLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full bg-white/8 text-foreground transition-colors duration-250 hover:bg-white/14"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6.5 flex flex-wrap items-center gap-x-4.5 gap-y-2 border-t border-border pt-5.5 text-xs text-foreground/55">
          <p className="m-0">© {new Date().getFullYear()} chairo</p>
          {LEGAL_LINKS.map((link) => (
            <LocalizedLink
              key={link.to}
              to={link.to}
              className="no-underline text-inherit hover:text-foreground transition-colors duration-250"
            >
              {t(link.labelKey)}
            </LocalizedLink>
          ))}
        </div>
      </div>
    </footer>
  )
}

export { Footer }
