import { cn } from '#/lib/utils.ts'
import { useLocale } from '#/i18n/locale-context'
import { LOCALES } from '#/i18n/translations'

interface LanguageSwitcherProps {
  className?: string
}

function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={cn(
        'inline-flex items-center rounded-md border border-border p-0.5',
        className,
      )}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            'px-2 py-1 rounded-sm text-14-medium uppercase transition-colors duration-250',
            locale === code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-primary',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

export { LanguageSwitcher }
