import type { Locale } from '#/i18n/translations'

interface DeleteAccountFormContent {
  metaTitle: string
  home: string
  signInTitle: string
  signInBody: string
  email: string
  password: string
  show: string
  hide: string
  signIn: string
  signingIn: string
  missing: string
  wrongCredentials: string
  confirmTitle: string
  confirmBody: (email: string) => string
  shopTitle: string
  shopClosed: (shops: string) => string
  shopClients: string
  shopTeam: string
  shopNoHandover: string
  deletedTitle: string
  deleted: Array<string>
  keptTitle: string
  kept: Array<string>
  understand: string
  delete: string
  deleting: string
  cancel: string
  tooManyAttempts: string
  failed: string
  doneTitle: string
  doneBody: string
}

// What goes and what stays mirrors delete_my_account() and close_shop() in
// the app repo (supabase/migrations/20261015120000_owner_account_deletion.sql),
// as does the app's delete sheet. Keep the three in step.
export const deleteAccountFormContent: Record<
  Locale,
  DeleteAccountFormContent
> = {
  bs: {
    metaTitle: 'Brisanje računa | Chairo',
    home: 'Na početnu',
    signInTitle: 'Obrišite svoj račun',
    signInBody:
      'Prijavite se emailom i lozinkom računa koji želite obrisati. Na sljedećem koraku vidite šta se briše i potvrđujete brisanje.',
    email: 'Email',
    password: 'Lozinka',
    show: 'Prikaži lozinku',
    hide: 'Sakrij lozinku',
    signIn: 'Nastavi',
    signingIn: 'Prijavljujem…',
    missing: 'Upišite email i lozinku',
    wrongCredentials: 'Email ili lozinka nisu tačni',
    confirmTitle: 'Obrisati račun zauvijek?',
    confirmBody: (email) =>
      `Prijavljeni ste kao ${email}. Brisanje je odmah i ne može se poništiti. Ako želite kopiju svojih podataka, prvo ih preuzmite u aplikaciji.`,
    shopTitle: 'Zatvara se i vaš salon',
    shopClosed: (shops) =>
      `${shops} se briše zajedno s uslugama, rasporedima, fotografijama i svim terminima, i prošlim.`,
    shopClients:
      'Budući termini se otkazuju, a klijenti s računom dobijaju obavještenje.',
    shopTeam: 'Tim gubi pristup salonu i dobija obavještenje.',
    shopNoHandover: 'Salon se ne može prenijeti na drugog vlasnika.',
    deletedTitle: 'Briše se',
    deleted: [
      'Račun, prijava i sve aktivne sesije',
      'Ime, korisničko ime i email',
      'Članstvo u salonu, obavještenja i postavke',
      'Saglasnosti i njihova historija',
      'Budući termini i ponavljanja se otkazuju, a frizer dobija obavještenje',
    ],
    keptTitle: 'Ostaje, bez vašeg imena',
    kept: [
      'Prošli termini u drugim salonima ostaju kao evidencija, ali kao „Obrisani korisnik”',
      'Ako radite u tuđem salonu: vaš red u timu ostaje kao „Bivši član tima”',
      'Zahtjevi za privatnost ostaju kao zapis da su riješeni, bez teksta',
    ],
    understand: 'Razumijem da se brisanje ne može poništiti',
    delete: 'Obriši račun',
    deleting: 'Brišem…',
    cancel: 'Odustani i odjavi se',
    tooManyAttempts: 'Previše pokušaja. Pokušajte ponovo za 15 minuta.',
    failed: 'Nešto nije u redu. Pokušajte ponovo.',
    doneTitle: 'Račun je obrisan',
    doneBody:
      'Vaš račun i podaci su obrisani. Aplikaciju možete ukloniti s telefona.',
  },
  en: {
    metaTitle: 'Delete account | Chairo',
    home: 'Go to home page',
    signInTitle: 'Delete your account',
    signInBody:
      "Sign in with the email and password of the account you want to delete. On the next step you'll see what's deleted and confirm.",
    email: 'Email',
    password: 'Password',
    show: 'Show password',
    hide: 'Hide password',
    signIn: 'Continue',
    signingIn: 'Signing in…',
    missing: 'Enter your email and password',
    wrongCredentials: 'The email or password is incorrect',
    confirmTitle: 'Delete your account for good?',
    confirmBody: (email) =>
      `You're signed in as ${email}. It's deleted right away and can't be undone. If you want a copy of your data, download it in the app first.`,
    shopTitle: 'Your shop closes too',
    shopClosed: (shops) =>
      `${shops} is deleted with its services, schedules, photos and every booking, past ones too.`,
    shopClients:
      'Upcoming bookings are cancelled, and clients with an account are notified.',
    shopTeam: 'The team loses access to the shop and is notified.',
    shopNoHandover: "The shop can't be handed over to another owner.",
    deletedTitle: 'Deleted',
    deleted: [
      'Your account, sign-in and all active sessions',
      'Name, username and email',
      'Shop membership, notifications and settings',
      'Consents and their history',
      'Upcoming bookings and repeats are cancelled, and the barber is notified',
    ],
    keptTitle: 'Kept, without your name',
    kept: [
      'Past bookings at other shops stay as records, but as “Deleted user”',
      "If you work at someone else's shop: your team row stays as “Former team member”",
      'Privacy requests stay as a record that they were resolved, without their text',
    ],
    understand: "I understand that deleting can't be undone",
    delete: 'Delete account',
    deleting: 'Deleting…',
    cancel: 'Cancel and sign out',
    tooManyAttempts: 'Too many attempts. Try again in 15 minutes.',
    failed: 'Something went wrong. Try again.',
    doneTitle: 'Your account is deleted',
    doneBody:
      'Your account and data are deleted. You can remove the app from your phone.',
  },
}
