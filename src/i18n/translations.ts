export const LOCALES = ['bs', 'en'] as const

export type Locale = (typeof LOCALES)[number]

/** Served without a URL prefix; every other locale lives under `/<locale>`. */
export const DEFAULT_LOCALE: Locale = 'bs'

export const SITE_URL = 'https://chairo.app'

/** Maps the optional `{-$locale}` route param to a locale, or null if invalid. */
export function localeFromParam(param: string | undefined): Locale | null {
  if (param === undefined) return DEFAULT_LOCALE
  if (param === DEFAULT_LOCALE) return null
  return (LOCALES as ReadonlyArray<string>).includes(param)
    ? (param as Locale)
    : null
}

/** The `{-$locale}` route param for a locale (undefined for the default). */
export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale
}

/** Prefixes an unlocalized path (`/privacy`) for a locale (`/en/privacy`). */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** Strips a locale prefix from a pathname (`/en/privacy` → `/privacy`). */
export function unlocalizePath(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1)
    }
  }
  return pathname
}

export const translations = {
  bs: {
    'nav.howItWorks': 'Kako radi',
    'nav.faq': 'Pitanja',
    'nav.cta': 'Rani pristup',
    'nav.home': 'Početna',
    'nav.openMenu': 'Otvori meni',
    'nav.closeMenu': 'Zatvori meni',
    'language.label': 'Jezik',
    'language.switch': 'Prebaci na engleski',
    'footer.privacy': 'Politika privatnosti',
    'footer.terms': 'Uslovi korištenja',
    'footer.support': 'Podrška',
    'footer.deleteAccount': 'Brisanje računa',
    'footer.rights': 'Sva prava zadržana.',
  },
  en: {
    'nav.howItWorks': 'How it works',
    'nav.faq': 'FAQ',
    'nav.cta': 'Early access',
    'nav.home': 'Home',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'language.label': 'Language',
    'language.switch': 'Switch to Bosnian',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of use',
    'footer.support': 'Support',
    'footer.deleteAccount': 'Delete account',
    'footer.rights': 'All rights reserved.',
  },
} satisfies Record<Locale, Record<string, string>>

export type TranslationKey = keyof (typeof translations)['bs']
