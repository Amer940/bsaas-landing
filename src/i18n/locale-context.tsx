import { createContext, useCallback, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { translations } from './translations'
import type { Locale, TranslationKey } from './translations'

interface LocaleContextValue {
  locale: Locale
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/** Provides the locale taken from the URL (see `routes/{-$locale}/route.tsx`). */
function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key],
    [locale],
  )

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export { LocaleProvider, useLocale }
