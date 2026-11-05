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
  about: {
    eyebrow: string
    title: string
    paragraphs: Array<string>
  }
  cta: {
    title: string
    body: string
    emailLabel: string
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
      title: 'Chairo | Aplikacija za zakazivanje termina za frizere',
      description:
        'Chairo je aplikacija za online zakazivanje termina za frizere, barbere i salone u BiH. Klijenti rezervišu 0-24, bez poziva i poruka. Manje nedolazaka, pun raspored.',
    },
    hero: {
      eyebrow: 'Aplikacija za zakazivanje termina',
      title: 'Klijenti zakazuju online.\nTi samo ==šišaš==.',
      body: 'Chairo je aplikacija za online zakazivanje termina za frizere, barbere i salone u BiH. Nema više poruka i poziva: cijeli dan vidiš na jednom ekranu, s terminima, pauzama, nedolascima i zaradom.',
      howItWorks: 'Pogledaj kako radi',
      note: 'Besplatno tokom ranog pristupa',
      imageAlt:
        'chairo aplikacija: današnji raspored salona i obavijest o novom terminu',
    },
    features: {
      eyebrow: 'Funkcije aplikacije',
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
      body: 'Bez obuke i bez komplikacija. Ti postaviš salon, klijenti dođu sami.',
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
    about: {
      eyebrow: 'Šta je chairo',
      title: 'Napravljeno u Tešnju,\nza salone u ==BiH==.',
      paragraphs: [
        'Chairo je aplikacija za zakazivanje termina namijenjena frizerima, barberima i frizerskim salonima u Bosni i Hercegovini. Klijenti sami biraju frizera, uslugu i slobodan termin, 0–24, a ti sve vidiš u jednom rasporedu, bez dopisivanja na Instagramu i Viberu i bez poziva usred šišanja.',
        'Radi jednako dobro za barbera sa jednom stolicom i za salon sa cijelim timom. Svaki frizer ima svoj raspored, radne sedmice postavljaš šablonima, a slobodne dane frizeri traže u aplikaciji. Stalni klijenti mogu imati stalni termin, pa se isti dogovor ne ponavlja svake sedmice.',
        'Chairo pravimo u Tešnju. Aplikacija je na bosanskom i engleskom jeziku, a tokom ranog pristupa je besplatna.',
      ],
    },
    cta: {
      title: 'Rani pristup\nza tvoj ==salon==.',
      body: 'Chairo je u ranom pristupu. Ostavi email i javimo se s pristupom za tvoj salon.',
      emailLabel: 'Email adresa za rani pristup',
      emailPlaceholder: 'tvoj@email.com',
      submit: 'Prijavi se',
      success: 'Hvala! Javit ćemo ti se s pristupom za tvoj salon.',
      error: 'Nešto nije u redu. Pokušaj ponovo.',
    },
    faq: {
      eyebrow: 'Česta pitanja',
      title: 'Pitanja i odgovori.',
      items: [
        {
          title: 'Koliko brzo mogu početi primati termine?',
          answer:
            'Kad dobiješ pristup, uneseš usluge i radno vrijeme i podijeliš kod salona ili QR kod s klijentima. Za većinu salona to traje nekoliko minuta. Ne treba ti obuka ni poseban uređaj, dovoljan je telefon.',
        },
        {
          title: 'Šta je kod salona i kako radi?',
          answer:
            'Svaki salon ima svoj kod i QR. Klijent upiše kod ili skenira QR, na primjer s ogledala ili s tvog Instagram profila, i odmah je u tvom salonu, bez traženja. Klijenti kod mogu podijeliti i s prijateljima, pa novi klijenti dolaze preko postojećih.',
        },
        {
          id: 'nedolasci',
          title: 'Šta ako klijent ne dođe?',
          answer:
            'Označiš nedolazak jednim dodirom. Kad klijent dođe do granice koju postaviš (npr. 3 nedolaska), više ne može zakazati sam u aplikaciji, nego mora pozvati salon. Broj nedolazaka po sedmici i mjesecu vidiš u pregledu zarade.',
        },
        {
          title: 'Dobijaju li klijenti podsjetnik?',
          answer:
            'Da. Klijent dobija podsjetnik prije termina, što smanjuje broj zaboravljenih termina. Svaki novi termin odmah vidiš u Rasporedu, pa ne moraš ništa prepisivati iz poruka.',
        },
        {
          title: 'Ima li chairo za Android i iPhone?',
          answer:
            'Android verzija dolazi prva, a verzija za iPhone stiže uskoro. Salon i klijenti koriste istu aplikaciju: ti upravljaš rasporedom, a klijenti zakazuju termine.',
        },
        {
          title: 'Koliko košta chairo?',
          answer:
            'Tokom ranog pristupa chairo je besplatan. Cijenu za period nakon ranog pristupa objavit ćemo na vrijeme, prije nego što bilo šta treba platiti.',
        },
        {
          title: 'Za koga je chairo i gdje radi?',
          answer:
            'Za frizere, barbere i frizerske salone u Bosni i Hercegovini, od jedne stolice do salona sa cijelim timom. Aplikacija je na bosanskom i engleskom jeziku, a pravimo je u Tešnju.',
        },
        {
          title: 'Kada mogu početi koristiti chairo?',
          answer:
            'Chairo je trenutno u ranom pristupu. Ostavi email na chairo.app/#prijava i javit ćemo ti se s pristupom za tvoj salon.',
        },
      ],
    },
  },

  en: {
    meta: {
      title: 'Chairo | Booking app for barbers and hair salons',
      description:
        'Chairo is an appointment booking app for barbers and hair salons in Bosnia and Herzegovina. Clients book 24/7, no DMs or calls. Fewer no-shows, a full chair.',
    },
    hero: {
      eyebrow: 'Booking app for barbers and salons',
      title: 'Clients book online.\nYou just ==cut==.',
      body: 'Chairo is an online booking app for barbers, hairdressers and salons in Bosnia and Herzegovina. No more DMs and calls: see your whole day on one screen, with bookings, breaks, no-shows and earnings.',
      howItWorks: 'See how it works',
      note: 'Free during early access',
      imageAlt:
        "The chairo app: today's salon schedule and a new booking notification",
    },
    features: {
      eyebrow: 'App features',
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
      body: 'No training, no hassle. You set up the salon, clients come on their own.',
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
    about: {
      eyebrow: 'What chairo is',
      title: 'Made in Tešanj,\nfor salons in ==Bosnia==.',
      paragraphs: [
        'Chairo is an appointment booking app for barbers, hairdressers and hair salons in Bosnia and Herzegovina. Clients pick their barber, service and an open slot themselves, 24/7, and you see everything in one schedule, without DMs on Instagram and Viber or calls in the middle of a cut.',
        'It works just as well for a barber with one chair as for a salon with a whole team. Every barber has their own schedule, you set up working weeks with templates, and barbers request days off in the app. Regular clients can have a recurring appointment, so the same booking never has to be arranged twice.',
        'We build Chairo in Tešanj. The app is in Bosnian and English, and it is free during early access.',
      ],
    },
    cta: {
      title: 'Early access\nfor your ==salon==.',
      body: "Chairo is in early access. Leave your email and we'll get in touch with access for your salon.",
      emailLabel: 'Email address for early access',
      emailPlaceholder: 'your@email.com',
      submit: 'Sign up',
      success: "Thanks! We'll be in touch with access for your salon.",
      error: 'Something went wrong. Please try again.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions, answered.',
      items: [
        {
          title: 'How quickly can I start taking bookings?',
          answer:
            'Once you have access, add your services and opening hours and share your salon code or QR code with clients. For most salons that takes a few minutes. No training or special hardware needed, your phone is enough.',
        },
        {
          title: 'What is the salon code, and how does it work?',
          answer:
            'Every salon has its own code and QR. A client enters the code or scans the QR, say from your mirror or your Instagram profile, and is in your salon straight away, no searching. Clients can share the code with friends, so new clients come through the ones you have.',
        },
        {
          id: 'nedolasci',
          title: "What if a client doesn't show up?",
          answer:
            "Mark the no-show with one tap. Once a client reaches the limit you set (say, 3 no-shows), they can't book in the app on their own anymore and have to call the salon. You see no-shows by week and month next to your earnings.",
        },
        {
          title: 'Do clients get reminders?',
          answer:
            'Yes. Clients get a reminder before their appointment, which cuts down on forgotten bookings. Every new booking shows up in your Schedule right away, so there is nothing to copy over from messages.',
        },
        {
          title: 'Is chairo available on Android and iPhone?',
          answer:
            'The Android version comes first, and the iPhone version is coming soon. Salons and clients use the same app: you manage the schedule, clients book appointments.',
        },
        {
          title: 'How much does chairo cost?',
          answer:
            "Chairo is free during early access. We'll announce pricing for after early access well in advance, before anything has to be paid.",
        },
        {
          title: 'Who is chairo for, and where does it work?',
          answer:
            'For barbers, hairdressers and hair salons in Bosnia and Herzegovina, from a single chair to a salon with a whole team. The app is in Bosnian and English, and we build it in Tešanj.',
        },
        {
          title: 'When can I start using chairo?',
          answer:
            "Chairo is in early access right now. Leave your email at chairo.app/en#prijava and we'll get in touch with access for your salon.",
        },
      ],
    },
  },
}
