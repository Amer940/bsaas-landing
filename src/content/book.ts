import type { Locale } from '#/i18n/translations'
import type { BookingHint } from '#/lib/web-booking'

// The booking link (book/$code) and the cancel link from the booking emails
// (book/cancel/$token). Every refusal the server can give (BookingHint) has
// its own line; raw server text is never shown.

interface BookContent {
  metaTitle: string
  cancelMetaTitle: string
  home: string
  back: string
  progress: (step: number, of: number) => string
  loading: string
  loadFailed: string
  retry: string

  offTitle: string
  offBody: string
  call: (phone: string) => string

  barberTitle: string
  noBarbers: string

  serviceTitle: string
  noServices: string
  minutes: (count: number) => string

  timeTitle: string
  noDays: string
  earlierDays: string
  laterDays: string
  noSlots: string
  slotTakenNotice: string

  detailsTitle: string
  detailsBody: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  note: string
  noteHint: string
  required: string
  nameTooLong: string
  emailInvalid: string
  phoneInvalid: string
  noteTooLong: string
  submitDetails: string
  submittingDetails: string
  rememberedHint: string

  codeTitle: string
  codeBody: (email: string) => string
  codeLabel: string
  submitCode: string
  submittingCode: string
  resend: string
  resendIn: (seconds: number) => string
  resent: string
  changeEmail: string

  doneTitle: string
  doneBody: (email: string) => string
  reference: string
  when: string
  at: string
  barber: string
  service: string
  shop: string
  appTitle: string
  appBody: string

  cancelTitle: string
  cancelBody: string
  cancelButton: string
  cancelling: string
  cancelConfirm: string
  keepButton: string
  cancelledTitle: string
  cancelledBody: string
  alreadyCancelledTitle: string
  pastTitle: string
  tooLateBody: string
  notFoundTitle: string
  notFoundBody: string
  bookAgain: string

  errors: Record<BookingHint, string>
}

export const bookContent: Record<Locale, BookContent> = {
  bs: {
    metaTitle: 'Zakaži termin | Chairo',
    cancelMetaTitle: 'Tvoj termin | Chairo',
    home: 'Na početnu',
    back: 'Nazad',
    progress: (step, of) => `Korak ${step} od ${of}`,
    loading: 'Učitavam…',
    loadFailed: 'Nismo uspjeli učitati podatke. Provjeri internet vezu.',
    retry: 'Pokušaj ponovo',

    offTitle: 'Online zakazivanje trenutno nije dostupno',
    offBody: 'Za termin se javi salonu direktno.',
    call: (phone) => `Nazovi ${phone}`,

    barberTitle: 'Izaberi frizera',
    noBarbers: 'Trenutno nema slobodnih frizera.',

    serviceTitle: 'Izaberi uslugu',
    noServices: 'Ovaj frizer trenutno nema usluga za online zakazivanje.',
    minutes: (count) => `${count} min`,

    timeTitle: 'Izaberi dan i vrijeme',
    noDays: 'Nema slobodnih termina u narednim sedmicama.',
    earlierDays: 'Raniji dani',
    laterDays: 'Kasniji dani',
    noSlots: 'Za ovaj dan više nema slobodnih termina.',
    slotTakenNotice:
      'Neko je upravo zauzeo to vrijeme. Izaberi neko od preostalih.',

    detailsTitle: 'Tvoji podaci',
    detailsBody:
      'Salon ih vidi uz termin. Na email ti šaljemo kod i potvrdu termina.',
    firstName: 'Ime',
    lastName: 'Prezime',
    email: 'Email',
    phone: 'Broj telefona',
    country: 'Država',
    note: 'Napomena za salon (nije obavezno)',
    noteHint: 'Bez zdravstvenih i drugih osjetljivih podataka.',
    required: 'Obavezno polje',
    nameTooLong: 'Najviše 40 znakova',
    emailInvalid: 'Upiši ispravan email',
    phoneInvalid: 'Upiši ispravan broj za izabranu državu',
    noteTooLong: 'Najviše 300 znakova',
    submitDetails: 'Nastavi',
    submittingDetails: 'Šaljem…',
    rememberedHint:
      'Ovaj email je već potvrđen na ovom uređaju, pa kod nije potreban.',

    codeTitle: 'Upiši kod iz emaila',
    codeBody: (email) =>
      `Poslali smo šestocifreni kod na ${email}. Kod važi 10 minuta. Ako ga ne vidiš, pogledaj i u neželjenu poštu.`,
    codeLabel: 'Kod',
    submitCode: 'Potvrdi termin',
    submittingCode: 'Potvrđujem…',
    resend: 'Pošalji novi kod',
    resendIn: (seconds) => `Novi kod možeš tražiti za ${seconds} s`,
    resent: 'Poslali smo novi kod.',
    changeEmail: 'Promijeni email',

    doneTitle: 'Termin je zakazan',
    doneBody: (email) =>
      `Potvrdu s linkom za otkazivanje poslali smo na ${email}.`,
    reference: 'Broj rezervacije',
    when: 'Kada',
    at: 'u',
    barber: 'Frizer',
    service: 'Usluga',
    shop: 'Salon',
    appTitle: 'Sljedeći put zakaži u aplikaciji',
    appBody:
      'U aplikaciji Chairo vidiš svoje termine, dobijaš podsjetnike i zakazuješ u par sekundi.',

    cancelTitle: 'Tvoj termin',
    cancelBody:
      'Ako ne možeš doći, otkaži termin da ga salon može dati drugom.',
    cancelButton: 'Otkaži termin',
    cancelling: 'Otkazujem…',
    cancelConfirm: 'Sigurno želiš otkazati ovaj termin?',
    keepButton: 'Ne, zadrži ga',
    cancelledTitle: 'Termin je otkazan',
    cancelledBody: 'Salon je obaviješten. Poslali smo ti i potvrdu na email.',
    alreadyCancelledTitle: 'Ovaj termin je otkazan',
    pastTitle: 'Ovaj termin je prošao',
    tooLateBody:
      'Termin se više ne može otkazati online. Ako ne možeš doći, javi se salonu.',
    notFoundTitle: 'Link nije ispravan',
    notFoundBody:
      'Ne možemo pronaći termin za ovaj link. Provjeri da je link iz emaila otvoren cijeli.',
    bookAgain: 'Zakaži novi termin',

    errors: {
      invalid_input:
        'Nešto u podacima nije u redu. Provjeri ih i pokušaj ponovo.',
      captcha_failed:
        'Nismo uspjeli provjeriti da je sve u redu. Pokušaj ponovo.',
      web_booking_off:
        'Online zakazivanje u ovom salonu trenutno nije dostupno. Za termin se javi salonu.',
      slot_taken: 'Neko je upravo zauzeo to vrijeme. Izaberi drugo.',
      too_many_codes:
        'Poslali smo previše kodova za kratko vrijeme. Pokušaj za sat vremena ili se javi salonu.',
      too_many_bookings:
        'Već imaš dva zakazana termina u ovom salonu. Za još jedan se javi salonu.',
      no_show_limit:
        'Online zakazivanje za ovaj broj nije moguće zbog propuštenih termina. Za termin se javi salonu.',
      code_wrong: 'Kod nije tačan. Provjeri ga i pokušaj ponovo.',
      code_expired: 'Kod je istekao. Pošalji novi kod.',
      code_attempts: 'Previše pogrešnih pokušaja. Pošalji novi kod.',
      resend_too_soon: 'Sačekaj malo prije nego što tražiš novi kod.',
      cancel_too_late:
        'Termin se više ne može otkazati online. Ako ne možeš doći, javi se salonu.',
      not_found: 'Ne možemo pronaći ovaj termin.',
      device_token_invalid:
        'Ovaj uređaj više ne pamti tvoj email. Poslat ćemo ti novi kod.',
      failed: 'Nešto nije uspjelo. Pokušaj ponovo.',
    },
  },
  en: {
    metaTitle: 'Book an appointment | Chairo',
    cancelMetaTitle: 'Your appointment | Chairo',
    home: 'Back to home',
    back: 'Back',
    progress: (step, of) => `Step ${step} of ${of}`,
    loading: 'Loading…',
    loadFailed: "We couldn't load this. Check your connection.",
    retry: 'Try again',

    offTitle: "Online booking isn't available right now",
    offBody: 'To book, contact the shop directly.',
    call: (phone) => `Call ${phone}`,

    barberTitle: 'Choose a barber',
    noBarbers: 'No barbers are taking bookings right now.',

    serviceTitle: 'Choose a service',
    noServices: 'This barber has no services to book online right now.',
    minutes: (count) => `${count} min`,

    timeTitle: 'Choose a day and time',
    noDays: 'No free times in the coming weeks.',
    earlierDays: 'Earlier days',
    laterDays: 'Later days',
    noSlots: 'No free times left on this day.',
    slotTakenNotice:
      'Someone just took that time. Choose one of the times still free.',

    detailsTitle: 'Your details',
    detailsBody:
      'The shop sees them with your booking. We email you a code and your confirmation.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    country: 'Country',
    note: 'Note for the shop (optional)',
    noteHint: 'Please leave out health or other sensitive details.',
    required: 'Required',
    nameTooLong: '40 characters at most',
    emailInvalid: 'Enter a valid email',
    phoneInvalid: 'Enter a valid number for the selected country',
    noteTooLong: '300 characters at most',
    submitDetails: 'Continue',
    submittingDetails: 'Sending…',
    rememberedHint:
      "This email is already confirmed on this device, so you won't need a code.",

    codeTitle: 'Enter the code from your email',
    codeBody: (email) =>
      `We sent a 6-digit code to ${email}. It works for 10 minutes. If you can't find it, check your spam folder.`,
    codeLabel: 'Code',
    submitCode: 'Confirm booking',
    submittingCode: 'Confirming…',
    resend: 'Send a new code',
    resendIn: (seconds) => `You can ask for a new code in ${seconds}s`,
    resent: 'We sent you a new code.',
    changeEmail: 'Change email',

    doneTitle: "You're booked",
    doneBody: (email) =>
      `We sent the confirmation, with a link to cancel, to ${email}.`,
    reference: 'Booking number',
    when: 'When',
    at: 'at',
    barber: 'Barber',
    service: 'Service',
    shop: 'Shop',
    appTitle: 'Book in the app next time',
    appBody:
      'In the Chairo app you see your bookings, get reminders and book in a few seconds.',

    cancelTitle: 'Your appointment',
    cancelBody:
      "If you can't make it, cancel so the shop can give the time to someone else.",
    cancelButton: 'Cancel appointment',
    cancelling: 'Cancelling…',
    cancelConfirm: 'Are you sure you want to cancel this appointment?',
    keepButton: 'No, keep it',
    cancelledTitle: 'Your appointment is cancelled',
    cancelledBody:
      "The shop has been told. We've also emailed you a confirmation.",
    alreadyCancelledTitle: 'This appointment is cancelled',
    pastTitle: 'This appointment has passed',
    tooLateBody:
      "It's too late to cancel online. If you can't make it, contact the shop.",
    notFoundTitle: "This link doesn't work",
    notFoundBody:
      "We can't find an appointment for this link. Check that you opened the full link from the email.",
    bookAgain: 'Book another appointment',

    errors: {
      invalid_input:
        "Something in your details isn't right. Check them and try again.",
      captcha_failed: "We couldn't check that everything's fine. Try again.",
      web_booking_off:
        "Online booking at this shop isn't available right now. To book, contact the shop.",
      slot_taken: 'Someone just took that time. Choose another.',
      too_many_codes:
        'We sent too many codes in a short time. Try again in an hour or contact the shop.',
      too_many_bookings:
        'You already have two upcoming bookings at this shop. For another, contact the shop.',
      no_show_limit:
        "Online booking isn't possible for this number because of missed appointments. To book, contact the shop.",
      code_wrong: "That code isn't right. Check it and try again.",
      code_expired: 'The code has expired. Send a new one.',
      code_attempts: 'Too many wrong tries. Send a new code.',
      resend_too_soon: 'Wait a moment before asking for a new code.',
      cancel_too_late:
        "It's too late to cancel online. If you can't make it, contact the shop.",
      not_found: "We can't find this appointment.",
      device_token_invalid:
        "This device no longer remembers your email. We'll send you a code.",
      failed: 'Something went wrong. Try again.',
    },
  },
}
