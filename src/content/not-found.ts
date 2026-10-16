import type { Locale } from '#/i18n/translations'

interface NotFoundContent {
  metaTitle: string
  title: string
  body: string
  home: string
}

export const notFoundContent: Record<Locale, NotFoundContent> = {
  bs: {
    metaTitle: 'Stranica nije pronađena | Chairo',
    title: 'Stranica nije pronađena',
    body: 'Ova stranica ne postoji ili je premještena. Provjeri adresu ili se vrati na početnu.',
    home: 'Na početnu',
  },
  en: {
    metaTitle: 'Page not found | Chairo',
    title: 'Page not found',
    body: "This page doesn't exist or has moved. Check the address or head back home.",
    home: 'Back to home',
  },
}
