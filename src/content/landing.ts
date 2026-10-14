import type { Locale } from '#/i18n/translations'

/**
 * Landing page copy. Headings use `==text==` for the highlighted (primary
 * colour) part and `\n` for a line break; see `RichText`.
 */
interface LandingContent {
  meta: { title: string; description: string }
  hero: {
    eyebrow: string
    title: string
    body: string
    howItWorks: string
  }
  features: {
    profile: { title: string; description: string }
    calendar: { title: string; description: string }
    stats: { title: string; description: string }
    noShows: { title: string; description: string }
  }
  steps: {
    title: string
    body: string
    imageAlt: string
    items: Array<{ title: string; text: string }>
  }
  pricing: {
    title: string
    body: string
    plan: string
    price: string
    period: string
    description: string
    cta: string
    note: string
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
    title: string
    body: string
    items: Array<{ title: string; answer: string }>
  }
  calendar: {
    days: Array<string>
    service: string
  }
}

export const landingContent: Record<Locale, LandingContent> = {
  bs: {
    meta: {
      title: 'Chairo | Zakazivanje termina za frizerske salone',
      description:
        'Chairo je aplikacija za online zakazivanje termina u frizerskim salonima. Klijenti rezervišu sami, a vi imate kalendar, tim i nedolaske pod kontrolom.',
    },
    hero: {
      eyebrow: 'Zakazivanje za frizerske salone',
      title: 'Vaša stolica\nuvijek ==puna==.',
      body: 'Chairo je aplikacija za zakazivanje termina u frizerskim salonima. Klijenti rezervišu sami, a vi se bavite onim što najbolje radite.',
      howItWorks: 'Kako radi',
    },
    features: {
      profile: {
        title: 'Profil salona',
        description:
          'Usluge, cijene, radno vrijeme i fotografije salona na jednom mjestu.',
      },
      calendar: {
        title: 'Kalendar termina',
        description:
          'Svaka rezervacija odmah stiže u kalendar salona i frizera. Bez poziva i poruka.',
      },
      stats: {
        title: 'Pregled poslovanja',
        description: 'Termini i usluge po frizeru, na jednom ekranu.',
      },
      noShows: {
        title: 'Nedolasci pod kontrolom',
        description:
          'Chairo bilježi nedolaske, a vi možete ograničiti buduće rezervacije.',
      },
    },
    steps: {
      title: 'Od registracije do\nprvog termina ==za par minuta==.',
      body: 'Otvorite salon, podijelite kod i pustite klijente da sami rezervišu.',
      imageAlt: 'Chairo aplikacija na telefonu',
      items: [
        {
          title: 'Otvorite salon',
          text: 'Unesite usluge, cijene i radno vrijeme, i pozovite svoj tim.',
        },
        {
          title: 'Podijelite kod',
          text: 'Klijenti se pridružuju salonu skeniranjem QR koda, unosom koda ili preko linka.',
        },
        {
          title: 'Termini stižu u kalendar',
          text: 'Klijent bira frizera, uslugu i vrijeme, a termin se odmah pojavi u vašem kalendaru.',
        },
      ],
    },
    pricing: {
      title: 'Jedna ==cijena==.\nSve uključeno.',
      body: 'Za klijente je Chairo besplatan. Plaća samo salon, jednom mjesečno.',
      plan: 'Chairo • Mjesečno',
      price: '$29',
      period: '/ mjesečno',
      description:
        'Za frizerske salone koji žele brže rezervacije, manje nedolazaka i bolje iskustvo za klijente.',
      cta: 'Pokrenite salon',
      note: '14 dana besplatno • Otkažite bilo kada',
      features: [
        'Online rezervacije 0–24',
        'Obavijesti o terminima u aplikaciji',
        'Upravljanje timom i rasporedom',
        'Historija klijenata i nedolasci',
        'QR kod i link za vaš salon',
      ],
    },
    cta: {
      title: 'Zainteresovani?\nBudite ==među prvima==.',
      body: 'Ostavite email i javit ćemo vam se čim Chairo bude spreman za vaš salon.',
      emailPlaceholder: 'Unesite email',
      submit: 'Prijavi se',
      success: 'Hvala! Javit ćemo vam se čim Chairo bude spreman.',
      error: 'Nešto nije u redu. Pokušajte ponovo.',
    },
    faq: {
      title: 'Pitanja i ==odgovori==.',
      body: 'Sve što trebate znati prije nego počnete.',
      items: [
        {
          title: 'Koliko brzo mogu početi primati rezervacije?',
          answer:
            'Čim unesete usluge i radno vrijeme i podijelite kod salona. Za većinu salona to traje nekoliko minuta.',
        },
        {
          title: 'Šta je kod salona i kako radi?',
          answer:
            'Svaki salon dobija svoj kod, QR kod i link. Klijent ga unese ili skenira u aplikaciji i odmah može rezervisati termin kod vas.',
        },
        {
          title: 'Šta ako klijent ne dođe?',
          answer:
            'Chairo bilježi nedolaske za svakog klijenta, a vi možete ograničiti njegove buduće rezervacije.',
        },
        {
          title: 'Koliko Chairo košta?',
          answer: 'Chairo je trenutno besplatan, i za salone i za klijente.',
        },
        {
          title: 'Da li je Chairo dostupan na Androidu?',
          answer: 'Da. Chairo je dostupan za iPhone i Android telefone.',
        },
        {
          title: 'Kada mogu početi koristiti Chairo?',
          answer:
            'Ostavite email na dnu stranice i javit ćemo vam se čim aplikacija bude spremna.',
        },
      ],
    },
    calendar: {
      days: ['Pon', 'Uto', 'Sri', 'Čet', 'Pet'],
      service: 'Šišanje',
    },
  },

  en: {
    meta: {
      title: 'Chairo | Appointment booking for barbershops',
      description:
        'Chairo is an online booking app for barbershops. Clients book themselves, and you keep your calendar, team and no-shows under control.',
    },
    hero: {
      eyebrow: 'Booking for barbershops',
      title: 'Your chair\nalways ==full==.',
      body: 'Chairo is an appointment booking app for barbershops. Clients book themselves, so you can focus on what you do best.',
      howItWorks: 'How it works',
    },
    features: {
      profile: {
        title: 'Shop profile',
        description:
          "Your shop's services, prices, opening hours and photos, all in one place.",
      },
      calendar: {
        title: 'Appointment calendar',
        description:
          "Every booking lands straight in the shop's and the barber's calendar. No calls, no texts.",
      },
      stats: {
        title: 'Business overview',
        description: 'Appointments and services per barber, on one screen.',
      },
      noShows: {
        title: 'No-shows under control',
        description:
          'Chairo records no-shows, and you can limit future bookings.',
      },
    },
    steps: {
      title: 'From sign-up to\nfirst booking ==in minutes==.',
      body: 'Set up your shop, share your code and let clients book themselves.',
      imageAlt: 'The Chairo app on a phone',
      items: [
        {
          title: 'Set up your shop',
          text: 'Add your services, prices and opening hours, and invite your team.',
        },
        {
          title: 'Share your code',
          text: 'Clients join your shop by scanning the QR code, entering the code or opening a link.',
        },
        {
          title: 'Bookings land in your calendar',
          text: 'Clients pick a barber, service and time, and the booking shows up in your calendar instantly.',
        },
      ],
    },
    pricing: {
      title: 'One ==price==.\nEverything included.',
      body: 'Chairo is free for clients. Only the shop pays, once a month.',
      plan: 'Chairo • Monthly',
      price: '$29',
      period: '/ month',
      description:
        'Built for barbershops that want faster bookings, fewer no-shows and a smoother client experience.',
      cta: 'Start your shop',
      note: '14 days free • Cancel anytime',
      features: [
        'Online booking 24/7',
        'In-app appointment notifications',
        'Team and schedule management',
        'Client history and no-shows',
        'QR code and link for your shop',
      ],
    },
    cta: {
      title: 'Interested?\nBe ==among the first==.',
      body: "Leave your email and we'll let you know as soon as Chairo is ready for your shop.",
      emailPlaceholder: 'Enter your email',
      submit: 'Sign up',
      success: "Thanks! We'll be in touch as soon as Chairo is ready.",
      error: 'Something went wrong. Please try again.',
    },
    faq: {
      title: 'Questions, ==answered==.',
      body: 'Everything you need to know before you start.',
      items: [
        {
          title: 'How quickly can I start taking bookings?',
          answer:
            'As soon as you add your services and opening hours and share your shop code. For most shops that takes a few minutes.',
        },
        {
          title: 'What is a shop code, and how does it work?',
          answer:
            'Every shop gets its own code, QR code and link. Clients enter or scan it in the app and can book with you right away.',
        },
        {
          title: "What happens if a client doesn't show up?",
          answer:
            "Chairo records each client's no-shows, and you can limit their future bookings.",
        },
        {
          title: 'How much does Chairo cost?',
          answer: 'Chairo is currently free, for shops and clients alike.',
        },
        {
          title: 'Is Chairo available on Android?',
          answer: 'Yes. Chairo is available for iPhone and Android phones.',
        },
        {
          title: 'When can I start using Chairo?',
          answer:
            "Leave your email at the bottom of the page and we'll let you know as soon as the app is ready.",
        },
      ],
    },
    calendar: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      service: 'Haircut',
    },
  },
}
