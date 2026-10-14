import type { Locale } from '#/i18n/translations'

interface ResetPasswordContent {
  metaTitle: string
  title: string
  subtitle: string
  newPassword: string
  repeatPassword: string
  show: string
  hide: string
  submit: string
  submitting: string
  tooShort: string
  mismatch: string
  samePassword: string
  weakPassword: string
  failed: string
  doneTitle: string
  doneBody: string
  expiredTitle: string
  expiredBody: string
  home: string
}

/** Minimum length, same as the app's sign-up and change-password forms. */
export const PASSWORD_MIN_LENGTH = 8

export const resetPasswordContent: Record<Locale, ResetPasswordContent> = {
  bs: {
    metaTitle: 'Nova lozinka | Chairo',
    title: 'Izaberi novu lozinku',
    subtitle: `Najmanje ${PASSWORD_MIN_LENGTH} znakova. Nakon promjene odjavljuješ se sa svih uređaja.`,
    newPassword: 'Nova lozinka',
    repeatPassword: 'Ponovi novu lozinku',
    show: 'Prikaži lozinku',
    hide: 'Sakrij lozinku',
    submit: 'Sačuvaj lozinku',
    submitting: 'Čuvam…',
    tooShort: `Najmanje ${PASSWORD_MIN_LENGTH} znakova`,
    mismatch: 'Lozinke se ne podudaraju',
    samePassword: 'Nova lozinka mora biti drugačija od stare',
    weakPassword: 'Izaberi jaču lozinku',
    failed: 'Nešto nije u redu. Pokušaj ponovo.',
    doneTitle: 'Lozinka je promijenjena',
    doneBody:
      'Vrati se u aplikaciju chairo i prijavi se novom lozinkom. Ostali uređaji su odjavljeni.',
    expiredTitle: 'Link više ne važi',
    expiredBody:
      'Link je istekao ili je već iskorišten. U aplikaciji dodirni „Zaboravljena lozinka?“ i zatraži novi.',
    home: 'Na početnu',
  },
  en: {
    metaTitle: 'New password | Chairo',
    title: 'Choose a new password',
    subtitle: `At least ${PASSWORD_MIN_LENGTH} characters. Changing it signs you out on every device.`,
    newPassword: 'New password',
    repeatPassword: 'Repeat new password',
    show: 'Show password',
    hide: 'Hide password',
    submit: 'Save password',
    submitting: 'Saving…',
    tooShort: `At least ${PASSWORD_MIN_LENGTH} characters`,
    mismatch: "Passwords don't match",
    samePassword: 'Your new password must be different from the old one',
    weakPassword: 'Choose a stronger password',
    failed: 'Something went wrong. Try again.',
    doneTitle: 'Password changed',
    doneBody:
      'Go back to the chairo app and sign in with your new password. Your other devices were signed out.',
    expiredTitle: 'This link no longer works',
    expiredBody:
      'It has expired or was already used. In the app, tap "Forgot password?" to get a new one.',
    home: 'Go to home page',
  },
}
