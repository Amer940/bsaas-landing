import type { Locale } from '#/i18n/translations'

interface JoinContent {
  metaTitle: string
  title: string
  body: string
  codeLabel: string
  copy: string
  copied: string
  googlePlay: string
  playHint: string
  iosSoon: string
  openApp: string
  home: string
}

export const joinContent: Record<Locale, JoinContent> = {
  bs: {
    metaTitle: 'Pridruži se salonu | Chairo',
    title: 'Zakazuj u svom salonu preko Chairo',
    body: 'Preuzmi aplikaciju, napravi račun i unesi kod salona. Termin zakažeš za par sekundi, bez telefoniranja.',
    codeLabel: 'Kod salona',
    copy: 'Kopiraj',
    copied: 'Kopirano',
    googlePlay: 'Preuzmi s Google Playa',
    playHint:
      'Preuzmeš li aplikaciju preko ovog dugmeta, kod će već biti upisan.',
    iosSoon: 'Chairo za iPhone stiže uskoro.',
    openApp: 'Već imaš aplikaciju? Otvori je',
    home: 'Na početnu',
  },
  en: {
    metaTitle: 'Join your shop | Chairo',
    title: 'Book at your shop with Chairo',
    body: 'Get the app, create an account and enter the shop code. Booking takes a few seconds, no phone call needed.',
    codeLabel: 'Shop code',
    copy: 'Copy',
    copied: 'Copied',
    googlePlay: 'Get it on Google Play',
    playHint:
      'Install through this button and the code will already be filled in.',
    iosSoon: 'Chairo for iPhone is coming soon.',
    openApp: 'Already have the app? Open it',
    home: 'Back to home',
  },
}
