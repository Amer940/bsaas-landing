import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '#/lib/utils.ts'
import { Logo } from './logo'
import { LanguageSwitcher } from './language-switcher'
import { useLocale } from '#/i18n/locale-context'
import { LocalizedLink } from '#/i18n/localized-link'
import type { TranslationKey } from '#/i18n/translations'
import { SHOW_PRICING } from '#/lib/features'

const NAV_LINKS: Array<{ labelKey: TranslationKey; hash: string }> = [
  { labelKey: 'nav.howItWorks', hash: 'kako-radi' },
  ...(SHOW_PRICING
    ? [{ labelKey: 'nav.pricing' as const, hash: 'cijena' }]
    : []),
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
      className={cn(
        'sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex max-w-300 items-center justify-between px-5 py-4 md:py-6.5 xl:px-0">
        <LocalizedLink
          to="/"
          aria-label={t('nav.home')}
          className="no-underline"
        >
          <Logo />
        </LocalizedLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8.5">
          <ul className="flex items-center gap-8.5 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <LocalizedLink
                  to="/"
                  hash={link.hash}
                  className="text-[0.9375rem] font-semibold text-foreground/75 no-underline hover:text-foreground transition-colors duration-250"
                >
                  {t(link.labelKey)}
                </LocalizedLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button asChild>
              <LocalizedLink to="/" hash="prijava">
                {t('nav.cta')}
                <ArrowRight aria-hidden="true" strokeWidth={2.3} />
              </LocalizedLink>
            </Button>
          </div>
        </div>

        {/* Mobile: language + menu */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggle}
            className="relative size-11 rounded-full bg-white/8 flex items-center justify-center"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isOpen}
          >
            <span
              className={cn(
                'absolute h-[2px] w-4 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                isOpen ? 'rotate-45 translate-y-0' : '-translate-y-[5px]',
              )}
            />
            <span
              className={cn(
                'absolute h-[2px] w-4 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100',
              )}
            />
            <span
              className={cn(
                'absolute h-[2px] w-4 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                isOpen ? '-rotate-45 translate-y-0' : 'translate-y-[5px]',
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border',
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 border-b-0',
        )}
      >
        <nav className="px-5 pt-2 pb-6">
          <ul className="flex flex-col gap-5 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <LocalizedLink
                  to="/"
                  hash={link.hash}
                  onClick={close}
                  className="text-lg font-semibold text-foreground no-underline block"
                >
                  {t(link.labelKey)}
                </LocalizedLink>
              </li>
            ))}
          </ul>
          <Button size="lg" className="w-full mt-6" asChild>
            <LocalizedLink to="/" hash="prijava" onClick={close}>
              {t('nav.cta')}
              <ArrowRight aria-hidden="true" strokeWidth={2.3} />
            </LocalizedLink>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export { Navbar, NAV_LINKS }
