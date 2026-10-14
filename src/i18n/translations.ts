export const LOCALES = ['bs', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'bs'

export const translations = {
  bs: {
    'nav.howItWorks': 'Kako radi',
    'nav.faq': 'Pitanja',
    'nav.buy': 'Kupi',
    'nav.cta': 'Zapocni danas',
    'nav.home': 'Početna',
    'nav.openMenu': 'Otvori meni',
    'nav.closeMenu': 'Zatvori meni',
    'language.label': 'Jezik',
    'footer.privacy': 'Politika privatnosti',
    'footer.terms': 'Uslovi korištenja',
    'footer.support': 'Podrška',
    'footer.deleteAccount': 'Brisanje računa',
  },
  en: {
    'nav.howItWorks': 'How it works',
    'nav.faq': 'FAQ',
    'nav.buy': 'Pricing',
    'nav.cta': 'Get started',
    'nav.home': 'Home',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'language.label': 'Language',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of use',
    'footer.support': 'Support',
    'footer.deleteAccount': 'Delete account',
  },
} satisfies Record<Locale, Record<string, string>>

export type TranslationKey = keyof (typeof translations)['bs']
