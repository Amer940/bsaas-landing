import type { Locale } from '#/i18n/translations'

interface ConfirmEmailContent {
  metaTitle: string
  title: string
  subtitle: string
  submit: string
  submitting: string
  failed: string
  doneTitle: string
  doneBody: string
  expiredTitle: string
  expiredBody: string
  home: string
}

export const confirmEmailContent: Record<Locale, ConfirmEmailContent> = {
  bs: {
    metaTitle: 'Potvrdi email | Chairo',
    title: 'Potvrdi svoj email',
    subtitle: 'Još jedan dodir i tvoj chairo nalog je spreman.',
    submit: 'Potvrdi email',
    submitting: 'Potvrđujem…',
    failed: 'Nešto nije u redu. Pokušaj ponovo.',
    doneTitle: 'Email je potvrđen',
    doneBody:
      'Vrati se u aplikaciju chairo. Ako je još otvorena, nastavlja sama, a ako nije, prijavi se.',
    expiredTitle: 'Link više ne važi',
    expiredBody:
      'Istekao je ili je već iskorišten. Ako se možeš prijaviti u aplikaciji, email je već potvrđen. Ako ne možeš, prijavi se i aplikacija će ti poslati novi kod.',
    home: 'Na početnu',
  },
  en: {
    metaTitle: 'Confirm your email | Chairo',
    title: 'Confirm your email',
    subtitle: 'One more tap and your chairo account is ready.',
    submit: 'Confirm email',
    submitting: 'Confirming…',
    failed: 'Something went wrong. Try again.',
    doneTitle: 'Email confirmed',
    doneBody:
      "Go back to the chairo app. If it's still open, it carries on by itself; if not, sign in.",
    expiredTitle: 'This link no longer works',
    expiredBody:
      "It has expired or was already used. If you can sign in to the app, your email is already confirmed. If you can't, sign in and the app will send you a new code.",
    home: 'Go to home page',
  },
}
