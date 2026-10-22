import type { Locale } from '#/i18n/translations'

interface EmailChangedContent {
  metaTitle: string
  doneTitle: string
  doneBody: string
  closeHint: string
  expiredTitle: string
  expiredBody: string
  home: string
}

export const emailChangedContent: Record<Locale, EmailChangedContent> = {
  bs: {
    metaTitle: 'Email promijenjen | Chairo',
    doneTitle: 'Email je promijenjen',
    doneBody:
      'Novi email je potvrđen. Od sada se njime prijavljuješ u aplikaciju chairo.',
    closeHint: 'Možeš zatvoriti ovu stranicu.',
    expiredTitle: 'Link više ne važi',
    expiredBody:
      'Link je istekao ili je već iskorišten. U aplikaciji ponovo promijeni email i dobićeš novi.',
    home: 'Na početnu',
  },
  en: {
    metaTitle: 'Email changed | Chairo',
    doneTitle: 'Email changed',
    doneBody:
      'Your new email is confirmed. From now on you sign in to the chairo app with it.',
    closeHint: 'You can close this page now.',
    expiredTitle: 'This link no longer works',
    expiredBody:
      'It has expired or was already used. Change your email again in the app to get a new one.',
    home: 'Go to home page',
  },
}
