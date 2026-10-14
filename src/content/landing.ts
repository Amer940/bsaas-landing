import type { Locale } from '#/i18n/translations'

/**
 * Landing page copy. Headings use `==text==` for the highlighted (accent
 * underline) part and `\n` for a line break; see `RichText`.
 */
interface LandingContent {
  meta: { title: string; description: string }
  hero: {
    eyebrow: string
    title: string
    body: string
    howItWorks: string
    note: string
    imageAlt: string
  }
  features: {
    eyebrow: string
    title: string
    /** Order matches the screenshots in `FeaturesGridSection`. */
    items: Array<{ title: string; description: string }>
  }
  steps: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ title: string; text: string }>
  }
  pricing: {
    eyebrow: string
    title: string
    plan: string
    price: string
    period: string
    description: string
    cta: string
    note: string
    includedLabel: string
    features: Array<string>
  }
  cta: {
    title: string
    body: string
    emailPlaceholder: string
    submit: string
    success: string
    error: string
  }
  faq: {
    eyebrow: string
    title: string
    /** `id` makes the item linkable as `#id`, opening it. */
    items: Array<{ id?: string; title: string; answer: string }>
  }
}

export const landingContent: Record<Locale, LandingContent> = {
  bs: {
    meta: {
      title: 'Chairo | Aplikacija za frizere i barbere',
      description:
        'Chairo je aplikacija za zakazivanje termina za frizere i barbere. Klijenti rezervišu 0-24, bez poziva i poruka. Manje propuštenih termina, pun raspored.',
    },
    hero: {
      eyebrow: 'Za frizere i salone',
      title: 'Klijenti zakazuju online.\nTi samo ==šišaš==.',
      body: 'Nema više poruka i poziva za termine. Cijeli dan vidiš na jednom ekranu: termine, pauze, nedolaske i zaradu.',
      howItWorks: 'Pogledaj kako radi',
      note: 'Besplatno tokom ranog pristupa',
      imageAlt:
        'chairo aplikacija: današnji raspored salona i obavijest o novom terminu',
    },
    features: {
      eyebrow: 'Šta dobiješ',
      title: 'Sve što salon treba,\nništa što ne treba.',
      items: [
        {
          title: 'Cijeli dan na jednom ekranu',
          description: 'Termini, pauze i slobodna mjesta — i za cijeli tim.',
        },
        {
          title: 'Klijenti zakazuju sami',
          description: 'Frizer, usluga, vrijeme — tri dodira.',
        },
        {
          title: 'Stalni termini',
          description: 'Isti klijent, isto vrijeme — bez dopisivanja.',
        },
        {
          title: 'Zarada i nedolasci',
          description: 'Sedmica, mjesec, po frizeru.',
        },
        {
          title: 'Tim i šabloni',
          description: 'Jedna sedmica za cijeli tim, slobodni dani uz zahtjev.',
        },
      ],
    },
    steps: {
      eyebrow: 'Kako radi',
      title: 'Od prijave do prvog\ntermina za ==minut==.',
      body: 'Bez instalacije kod klijenta, bez obuke. Ti postaviš salon, klijenti dođu sami.',
      items: [
        {
          title: 'Prijavi se i kreni',
          text: 'Postavi radno vrijeme i usluge. Stranica za zakazivanje je online čim objaviš.',
        },
        {
          title: 'Podijeli kod',
          text: 'Klijenti upišu kod salona ili skeniraju QR na ogledalu — i već su kod tebe.',
        },
        {
          title: 'Termin stiže u kalendar',
          text: 'Svaki novi termin odmah vidiš u Rasporedu, a klijent dobija podsjetnik.',
        },
      ],
    },
    pricing: {
      eyebrow: 'Cijena',
      title: 'Jedna cijena.\n==Sve== uključeno.',
      plan: 'Jedna stolica · mjesečno',
      price: '29 KM',
      period: '/ mjesečno',
      description:
        'Za salone koji žele brže zakazivanje, manje nedolazaka i mirniji dan.',
      cta: 'Uzmi svoju stolicu',
      note: '14 dana besplatno · otkaži kad hoćeš',
      includedLabel: 'Sve uključeno',
      features: [
        'Online zakazivanje 0–24',
        'SMS i email podsjetnici',
        'Tim, šabloni i neradni dani',
        'Historija klijenata i stalni termini',
        'Pregled zarade i nedolazaka',
      ],
    },
    cta: {
      title: 'Brini o klijentima,\nne o ==rasporedu==.',
      body: 'Ostavi email i javimo se s pristupom za tvoj salon.',
      emailPlaceholder: 'tvoj@email.com',
      submit: 'Prijavi se',
      success: 'Hvala! Javit ćemo ti se čim chairo bude spreman.',
      error: 'Nešto nije u redu. Pokušaj ponovo.',
    },
    faq: {
      eyebrow: 'Pitanja',
      title: 'Pitanja i odgovori.',
      items: [
        {
          title: 'Koliko brzo mogu početi primati termine?',
          answer:
            'Čim uneseš usluge i radno vrijeme i podijeliš kod salona. Za većinu salona to traje nekoliko minuta.',
        },
        {
          title: 'Šta je kod za preporuku i kako radi?',
          answer:
            'Svaki salon ima svoj kod i QR, a klijenti ga mogu podijeliti s prijateljima. Ko se registruje s tim kodom, odmah je u tvom salonu — bez traženja.',
        },
        {
          id: 'nedolasci',
          title: 'Šta ako klijent ne dođe?',
          answer:
            'Označiš nedolazak jednim dodirom. Kad klijent dođe do granice koju postaviš (npr. 3 nedolaska), više ne može zakazati sam u aplikaciji — mora pozvati salon.',
        },
        {
          title: 'Ima li chairo za Android?',
          answer: 'Da. chairo radi na iPhone i Android telefonima.',
        },
        {
          title: 'Kada mogu početi koristiti chairo?',
          answer:
            'Ostavi email iznad i javit ćemo ti se čim aplikacija bude spremna.',
        },
      ],
    },
  },

  en: {
    meta: {
      title: 'Chairo | The app for barbers',
      description:
        'Chairo is the booking app barbers use to save time. 24/7 online booking, no more DMs and calls, fewer no-shows and a fully booked chair.',
    },
    hero: {
      eyebrow: 'For barbers and salons',
      title: 'Clients book online.\nYou just ==cut==.',
      body: 'No more DMs and calls to set up appointments. See your whole day on one screen: bookings, breaks, no-shows and earnings.',
      howItWorks: 'See how it works',
      note: 'Free during early access',
      imageAlt:
        "The chairo app: today's salon schedule and a new booking notification",
    },
    features: {
      eyebrow: 'What you get',
      title: "Everything a salon needs,\nnothing it doesn't.",
      items: [
        {
          title: 'Your whole day on one screen',
          description:
            'Appointments, breaks and open slots — for the whole team.',
        },
        {
          title: 'Clients book themselves',
          description: 'Barber, service, time — three taps.',
        },
        {
          title: 'Recurring appointments',
          description: 'Same client, same time — no back-and-forth.',
        },
        {
          title: 'Earnings and no-shows',
          description: 'By week, by month, by barber.',
        },
        {
          title: 'Team and templates',
          description: 'One week for the whole team, days off on request.',
        },
      ],
    },
    steps: {
      eyebrow: 'How it works',
      title: 'From sign-up to your first\nbooking in a ==minute==.',
      body: 'Nothing for clients to install, no training. You set up the salon, clients come on their own.',
      items: [
        {
          title: 'Sign up and go',
          text: 'Set your hours and services. Your booking page is live as soon as you publish.',
        },
        {
          title: 'Share your code',
          text: "Clients enter your salon code or scan the QR on the mirror — and they're in.",
        },
        {
          title: 'Bookings land in your calendar',
          text: 'Every new booking shows up in your Schedule right away, and the client gets a reminder.',
        },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'One price.\n==Everything== included.',
      plan: 'One chair · monthly',
      price: '29 KM',
      period: '/ month',
      description:
        'For salons that want faster booking, fewer no-shows and a calmer day.',
      cta: 'Claim your chair',
      note: '14 days free · cancel anytime',
      includedLabel: 'Everything included',
      features: [
        'Online booking 24/7',
        'SMS and email reminders',
        'Team, templates and days off',
        'Client history and recurring appointments',
        'Earnings and no-show overview',
      ],
    },
    cta: {
      title: 'Focus on clients,\nnot ==scheduling==.',
      body: "Leave your email and we'll get in touch with access for your salon.",
      emailPlaceholder: 'your@email.com',
      submit: 'Sign up',
      success: "Thanks! We'll be in touch as soon as chairo is ready.",
      error: 'Something went wrong. Please try again.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions, answered.',
      items: [
        {
          title: 'How quickly can I start taking bookings?',
          answer:
            'As soon as you add your services and opening hours and share your salon code. For most salons that takes a few minutes.',
        },
        {
          title: 'What is the referral code, and how does it work?',
          answer:
            'Every salon has its own code and QR, and clients can share it with friends. Anyone who signs up with that code is in your salon straight away — no searching.',
        },
        {
          id: 'nedolasci',
          title: "What if a client doesn't show up?",
          answer:
            "Mark the no-show with one tap. Once a client reaches the limit you set (say, 3 no-shows), they can't book in the app on their own anymore — they have to call the salon.",
        },
        {
          title: 'Is chairo available on Android?',
          answer: 'Yes. chairo works on iPhone and Android phones.',
        },
        {
          title: 'When can I start using chairo?',
          answer:
            "Leave your email above and we'll let you know as soon as the app is ready.",
        },
      ],
    },
  },
}
