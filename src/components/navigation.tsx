import { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '#/lib/utils.ts'
import Logo from '../images/brat..svg'
import { LanguageSwitcher } from './language-switcher'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import type { TranslationKey } from '#/i18n/translations'

const NAV_LINKS: Array<{ labelKey: TranslationKey; hash: string }> = [
  { labelKey: 'nav.howItWorks', hash: 'kako-radi' },
  { labelKey: 'nav.faq', hash: 'pitanja' },
]

interface NavbarProps {
  className?: string
}

function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLocale()

  const toggle = () => setIsOpen((prev) => !prev)

  const close = () => setIsOpen(false)

  return (
    <header
      className={cn('sticky top-0 left-0 right-0 z-50 bg-white', className)}
    >
      <div className="md:border-b border-border">
        <div className="site-container">
          <div className="flex items-center justify-between py-6">
            <LocalizedLink to="/" aria-label={t('nav.home')}>
              <img src={Logo} alt="Chairo" />
            </LocalizedLink>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center">
              <ul className="flex items-center gap-4 list-none m-0 p-0">
                {NAV_LINKS.map((link) => (
                  <li key={link.hash}>
                    <LocalizedLink
                      to="/"
                      hash={link.hash}
                      className="text-14-medium text-muted-foreground no-underline hover:text-primary transition-colors duration-250"
                    >
                      {t(link.labelKey)}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>

              <LanguageSwitcher className="ml-6" />

              <div className="pl-4">
                <Button variant="default" asChild>
                  <LocalizedLink to="/" hash="prijava">
                    {t('nav.cta')}
                  </LocalizedLink>
                </Button>
              </div>
            </div>

            {/* Mobile: language + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={toggle}
                className="relative w-8 h-8 flex items-center justify-center"
                aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                aria-expanded={isOpen}
              >
                <span
                  className={cn(
                    'absolute h-[2px] w-5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                    isOpen ? 'rotate-45 translate-y-0' : '-translate-y-[6px]',
                  )}
                />
                <span
                  className={cn(
                    'absolute h-[2px] w-5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                    isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100',
                  )}
                />
                <span
                  className={cn(
                    'absolute h-[2px] w-5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                    isOpen ? '-rotate-45 translate-y-0' : 'translate-y-[6px]',
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-border',
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 border-b-0',
        )}
      >
        <nav className="site-container py-6">
          <ul className="flex flex-col gap-5 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <LocalizedLink
                  to="/"
                  hash={link.hash}
                  onClick={close}
                  className="text-18-medium text-foreground no-underline hover:text-primary transition-colors duration-250 block"
                >
                  {t(link.labelKey)}
                </LocalizedLink>
              </li>
            ))}
          </ul>
          <div className="pt-5">
            <Button variant="default" className="w-full" asChild>
              <LocalizedLink to="/" hash="prijava" onClick={close}>
                {t('nav.cta')}
              </LocalizedLink>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export { Navbar }
