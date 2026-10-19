import type { CodeLinkContent } from '#/components/code-link-page'
import type { Locale } from '#/i18n/translations'

export const joinContent: Record<Locale, CodeLinkContent> = {
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
    qrTitle: 'Skeniraj telefonom',
    qrCaption:
      'Otvori kameru i usmjeri je na kod. Stranica se otvara na telefonu.',
    qrLabel: 'QR kod za link salona',
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
    qrTitle: 'Scan with your phone',
    qrCaption: 'Point your camera at the code to open this page on your phone.',
    qrLabel: 'QR code for the shop link',
    home: 'Back to home',
  },
}
