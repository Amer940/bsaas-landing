import type { CodeLinkContent } from '#/components/code-link-page'
import type { Locale } from '#/i18n/translations'
import { joinContent } from '#/content/join'

// The invite page differs from the shop's only in what it says the code is.
export const inviteContent: Record<Locale, CodeLinkContent> = {
  bs: {
    ...joinContent.bs,
    metaTitle: 'Poziv u salon | Chairo',
    title: 'Imaš poziv u salon na Chairo',
    body: 'Preuzmi aplikaciju, napravi račun i unesi kod za poziv. Pridružiš se istom salonu i termin zakažeš za par sekundi, bez telefoniranja.',
    codeLabel: 'Kod za poziv',
    qrLabel: 'QR kod za poziv',
  },
  en: {
    ...joinContent.en,
    metaTitle: 'Your invite | Chairo',
    title: "You're invited to a shop on Chairo",
    body: 'Get the app, create an account and enter the invite code. You join the same shop and book in a few seconds, no phone call needed.',
    codeLabel: 'Invite code',
    qrLabel: 'QR code for the invite',
  },
}
