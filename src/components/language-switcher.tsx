import { useLocation, useNavigate } from '@tanstack/react-router'
import { Globe } from 'lucide-react'
import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { LOCALES, localizePath, unlocalizePath } from '#/i18n/translations'

interface LanguageSwitcherProps {
  className?: string
}

/** One link that switches to the next locale, keeping the current page. */
function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, t } = useLocale()
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()

  const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length]
  const href =
    localizePath(unlocalizePath(pathname), next) + (hash ? `#${hash}` : '')

  return (
    <a
      href={href}
      hrefLang={next}
      aria-label={t('language.switch')}
      title={t('language.switch')}
      onClick={(e) => {
        e.preventDefault()
        navigate({ href, resetScroll: false })
      }}
      className={cn(
        'group inline-flex h-9 items-center gap-2 rounded-full border border-border px-3',
        'text-14-medium uppercase no-underline select-none',
        'transition-colors duration-250 hover:border-foreground',
        className,
      )}
    >
      <Globe
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-colors duration-250 group-hover:text-foreground"
      />
      {LOCALES.map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-border" />}
          <span
            className={
              code === locale ? 'text-foreground' : 'text-muted-foreground'
            }
          >
            {code}
          </span>
        </span>
      ))}
    </a>
  )
}

export { LanguageSwitcher }
