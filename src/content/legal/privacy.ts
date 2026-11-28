import type { LocalizedLegalDoc } from '#/components/legal/legal-page'

export const privacyContent: LocalizedLegalDoc = {
  bs: {
    title: 'Politika privatnosti',
    updated: 'Posljednja izmjena: 28. novembar 2026.',
    blocks: [
      {
        type: 'p',
        text: 'Ova politika objašnjava koje lične podatke prikupljaju aplikacija Chairo i web stranica chairo.app, zašto ih prikupljamo, koliko dugo ih čuvamo i koja su vaša prava.',
      },

      { type: 'h2', text: '1. Ko je odgovoran za vaše podatke' },
      {
        type: 'p',
        text: 'Za obradu vaših ličnih podataka odgovoran je Chairo, Tešanj, Bosna i Hercegovina.',
      },
      {
        type: 'p',
        text: 'Kontakt za sva pitanja o privatnosti: privacy@chairo.app',
      },

      { type: 'h2', text: '2. Na koga se ova politika odnosi' },
      {
        type: 'ul',
        items: [
          'klijente koji zakazuju termine,',
          'frizere i druge članove tima salona,',
          'vlasnike salona,',
          'osobe bez korisničkog računa koje salon upiše uz termin,',
          'osobe koje zakažu termin preko linka salona za online zakazivanje, bez korisničkog računa,',
          'posjetioce web stranice chairo.app.',
        ],
      },

      { type: 'h2', text: '3. Koje podatke prikupljamo' },
      { type: 'h3', text: 'Svi korisnici s računom' },
      {
        type: 'ul',
        items: [
          'Email adresa i lozinka, ako je koristite. Lozinka se čuva samo u obliku koji se ne može pročitati.',
          'Ako se prijavite putem Google ili Apple računa: Google nam daje vaše ime, email i profilnu fotografiju, a Apple ime i email. Apple umjesto vašeg pravog emaila može dati skrivenu adresu za prosljeđivanje. Google profilnu fotografiju čuvamo kao vašu profilnu fotografiju u aplikaciji. Vašu lozinku za Google ili Apple ne vidimo.',
          'Podaci o prijavi: kada je račun napravljen, kada ste se zadnji put prijavili i kada je email potvrđen.',
          'Ime, prezime, korisničko ime i kod salona preko kojeg ste se pridružili.',
          'Broj telefona, samo kod starijih računa. Aplikacija ga više ne traži.',
          'Profilna fotografija, ako je dodate.',
          'Vaši izbori za obavijesti i analitiku (email, push, SMS). Svi su isključeni dok ih sami ne uključite. Čuvamo i historiju promjena, da možemo dokazati vaš pristanak.',
          'Obavijesti u aplikaciji i kategorije koje ste utišali.',
          'Ako dozvolite push obavijesti: push token vašeg uređaja (oznaka preko koje obavijest stiže baš na taj telefon), vrsta uređaja (Android ili iOS), jezik aplikacije i kada je uređaj zadnji put korišten.',
          'Vrijeme neuspjelih pokušaja unosa lozinke, radi zaštite od pogađanja lozinke.',
          'Zahtjevi u vezi s privatnošću koje pošaljete.',
          'Prijave grešaka i povratne informacije: tekst, vrsta prijave, vaša uloga, salon, verzija aplikacije, operativni sistem, model telefona, jezik aplikacije i ekran s kojeg je prijava poslana. Do 3 snimka ekrana, ako ih priložite.',
          'Kodovi pozivnica za salon.',
        ],
      },
      { type: 'h3', text: 'Klijenti' },
      {
        type: 'ul',
        items: [
          'Saloni kojima ste se pridružili, način pridruživanja (kod, QR ili link), omiljeni frizer, ko vas je pozvao te datumi pridruživanja i odlaska.',
          'Termini: salon, frizer, usluga, cijena, trajanje, vrijeme, broj rezervacije, status, razlog otkazivanja i nedolasci.',
          'Osoblje salona vidi vaše ime, korisničko ime, telefon (ako postoji), fotografiju i broj nedolazaka u tom salonu.',
        ],
      },
      { type: 'h3', text: 'Frizeri i članovi tima' },
      {
        type: 'ul',
        items: [
          'Ime za prikaz, uloga, status, da li klijenti mogu rezervisati kod vas te ko vas je pozvao i kada.',
          'Raspored rada, odsustva s neobaveznom napomenom, napomene uz zahtjeve vlasniku, usluge i cijene te sačuvane smjene.',
          'Molimo vas da u napomene ne upisujete zdravstvene ni druge osjetljive podatke.',
        ],
      },
      { type: 'h3', text: 'Vlasnici salona' },
      {
        type: 'ul',
        items: [
          'Profil salona: naziv, opis, adresa, telefon, vremenska zona, usluge, cijene i pravila rezervacije.',
          'Fotografije salona (logo, naslovna i galerija). One su javno vidljive.',
        ],
      },
      { type: 'h3', text: 'Osobe bez korisničkog računa' },
      {
        type: 'p',
        text: 'Ako vas salon upiše za termin bez korisničkog računa u aplikaciji, čuvamo ime i broj telefona koje je salon unio.',
      },
      { type: 'h3', text: 'Online zakazivanje preko linka salona' },
      {
        type: 'p',
        text: 'Salon može objaviti link za online zakazivanje (chairo.app/book/…), na primjer na svom Google profilu. Termin tamo zakazujete bez korisničkog računa. Takav termin se ne povezuje s računom u aplikaciji, ni kada imate račun s istim emailom.',
      },
      {
        type: 'ul',
        items: [
          'Uz termin čuvamo ime, prezime, email, broj telefona i napomenu ako je upišete, te jezik stranice. Salon i njegov tim vide ove podatke i broj nedolazaka za taj broj telefona u tom salonu.',
          'Na email vam šaljemo kod za potvrdu, potvrdu termina s linkom za otkazivanje, podsjetnik dan prije termina i obavijest ako salon termin otkaže ili pomjeri.',
          'Kod za potvrdu čuvamo samo u obliku koji se ne može pročitati. Radi zaštite od zloupotrebe bilježimo vrijeme svakog poslanog koda i IP adresu u nečitljivom obliku (hash).',
          'Nakon potvrđenog koda, preglednik pamti oznaku za taj email, pa pri sljedećem zakazivanju s istim emailom na tom uređaju kod nije potreban.',
          'Prije slanja koda, ili kada zapamćeni email zakazuje bez koda, Cloudflare Turnstile provjerava da stranicu koristi osoba, a ne program.',
        ],
      },
      { type: 'h3', text: 'Web stranica' },
      {
        type: 'ul',
        items: [
          'Za registraciju i prijavu: ime, email i lozinka. To je isti račun kao u aplikaciji.',
          'Naš hosting (Cloudflare) bilježi IP adrese posjetilaca u tehničkim zapisima.',
          'Ako se prijavite za rani pristup: vaš email i jezik stranice.',
          'Analitika (Google Analytics), samo ako prihvatite kolačiće: koje stranice posjećujete, odakle ste došli na stranicu, približna lokacija (država i grad, iz IP adrese), vrsta uređaja i preglednika, jezik i vrijeme posjete. Google skraćuje IP adresu i ne čuva je. Ne šaljemo Googleu vaše ime, email ni druge podatke s računa.',
          'Ne koristimo kolačiće za reklame.',
        ],
      },
      { type: 'h3', text: 'Kolačići na web stranici' },
      {
        type: 'p',
        text: 'Kada prvi put otvorite stranicu, pitamo vas da li prihvatate kolačiće za analitiku. Dok ne prihvatite, Google Analytics se ne učitava. Odluku možete promijeniti bilo kada preko linka **Postavke kolačića** na dnu stranice. Ako odbijete nakon što ste prihvatili, brišemo kolačiće Google Analyticsa.',
      },
      {
        type: 'table',
        head: ['Naziv', 'Svrha', 'Trajanje'],
        rows: [
          [
            'chairo-cookie-consent-v1 (pohrana preglednika)',
            'Pamti vaš izbor o kolačićima. Neophodno, ne šalje se nikome.',
            'Dok ga ne obrišete u pregledniku',
          ],
          [
            'Prijava (pohrana preglednika)',
            'Drži vas prijavljenim. Neophodno.',
            'Do odjave',
          ],
          [
            'chairo-booking-device:<email> (pohrana preglednika)',
            'Pamti da je email potvrđen kodom pri online zakazivanju, pa kod ne treba ponovo. Postavlja se samo kada potvrdite kod.',
            '90 dana',
          ],
          [
            '_ga',
            'Google Analytics: razlikuje posjetioce. Samo uz pristanak.',
            '2 godine',
          ],
          [
            '_ga_<ID>',
            'Google Analytics: čuva stanje posjete. Samo uz pristanak.',
            '2 godine',
          ],
        ],
      },
      { type: 'h3', text: 'Na vašem telefonu' },
      {
        type: 'ul',
        items: [
          'Prijava je sačuvana na telefonu u šifriranom obliku. Jezik i izgled aplikacije brišu se pri odjavi.',
          'Kamera se koristi samo za skeniranje QR koda salona. Slike se ne čuvaju.',
          'Fotografije: aplikacija dobija samo one koje sami izaberete.',
          'Kalendar: aplikacija samo otvara ekran za dodavanje termina u vaš kalendar. Ne čita vaš kalendar.',
        ],
      },
      { type: 'h3', text: 'Šta ne radimo' },
      {
        type: 'p',
        text: 'Aplikacija ne koristi analitiku ni praćenje. Web stranica koristi Google Analytics samo uz vaš pristanak. Ne prikazujemo reklame. Aplikacija ne koristi vašu lokaciju. Ne prodajemo vaše podatke.',
      },

      { type: 'h2', text: '4. Zašto obrađujemo podatke i na kojoj osnovi' },
      {
        type: 'table',
        head: ['Svrha', 'Pravni osnov'],
        rows: [
          ['Vaš račun i prijava', 'Izvršenje ugovora (uslova korištenja)'],
          ['Zakazivanje termina i rad salona', 'Izvršenje ugovora'],
          [
            'Online zakazivanje preko linka salona i emailovi o tom terminu (kod, potvrda, podsjetnik, otkazivanje ili pomjeranje)',
            'Izvršenje ugovora, na vaš zahtjev za termin',
          ],
          ['Obavijesti u aplikaciji o terminima', 'Izvršenje ugovora'],
          [
            'Push obavijesti o vašim terminima i računu (novi, pomjereni i otkazani termini, podsjetnici prije termina, ponude i izmjene stalnih termina i odgovori na njih, propušteni termini, uklanjanje iz tima, zatvaranje salona)',
            'Izvršenje ugovora. Postavke obavijesti u aplikaciji isključuju grupe poruka, ali neke poruke stižu i tada jer traže odgovor ili se tiču termina ili računa: otkazani termini i završetak stalnog termina (za klijente), predložena izmjena termina, propušteni termini, uklanjanje iz tima i zatvaranje salona. Push obavijesti uvijek možete potpuno isključiti u postavkama telefona.',
          ],
          ['Zaštita od zloupotrebe i pogađanja lozinke', 'Legitimni interes'],
          ['Rješavanje prijavljenih grešaka', 'Legitimni interes'],
          ['Evidencija prošlih termina za salon', 'Legitimni interes salona'],
          [
            'Email, push ili SMS obavijesti o novostima',
            'Samo uz vaš pristanak',
          ],
          ['Odgovori na zahtjeve u vezi s privatnošću', 'Zakonska obaveza'],
          ['Obavijest o pokretanju aplikacije (rani pristup)', 'Vaš pristanak'],
          [
            'Analitika posjeta web stranici (Google Analytics)',
            'Vaš pristanak, koji možete povući bilo kada',
          ],
        ],
      },

      { type: 'h2', text: '5. Ko vidi vaše podatke' },
      {
        type: 'p',
        text: '**Salon i njegov tim** vide podatke potrebne za vaše termine, kako je opisano u dijelu 3.',
      },
      {
        type: 'p',
        text: '**Drugi korisnici** vide javni profil salona te ime i fotografiju frizera.',
      },
      {
        type: 'p',
        text: '**Pružaoci usluga** obrađuju podatke za nas, samo za svrhe iz ove politike:',
      },
      {
        type: 'table',
        head: ['Pružalac', 'Za šta ga koristimo'],
        rows: [
          [
            'Supabase',
            'Baza podataka, prijava i pohrana datoteka. Podaci su smješteni u Evropskoj uniji.',
          ],
          [
            'Resend',
            'Slanje emailova u vezi s računom, emaila dobrodošlice za rani pristup, emailova o terminima zakazanim online (kod, potvrda, podsjetnik, otkazivanje, pomjeranje), te internih upozorenja nama. Upozorenja samo javljaju da je stigla nova prijava greške ili zahtjev u vezi s privatnošću, bez ličnih podataka.',
          ],
          [
            'Cloudflare',
            'Hosting web stranice, provjera Turnstile pri prijavi za rani pristup i online zakazivanju, te prosljeđivanje emailova poslanih na support@ i privacy@',
          ],
          [
            'Google (Gmail)',
            'Prijem emailova koje nam pošaljete i naših internih upozorenja',
          ],
          [
            'Google (Google Analytics)',
            'Statistika posjeta web stranici, samo ako prihvatite kolačiće. Isključili smo Google signale i korištenje podataka za reklame.',
          ],
          [
            'Apple i Google',
            'Preuzimanje aplikacije i prijava putem Google ili Apple računa, prema njihovim pravilima privatnosti',
          ],
          [
            'Expo (650 Industries)',
            'Prosljeđivanje push obavijesti na vaš uređaj. Prima push token i tekst obavijesti.',
          ],
          [
            'Google (Firebase Cloud Messaging)',
            'Dostava push obavijesti na Android uređaje',
          ],
          [
            'Apple (Apple Push Notification service)',
            'Dostava push obavijesti na iPhone',
          ],
        ],
      },
      {
        type: 'p',
        text: 'Podatke možemo dati organima vlasti samo kada to zakon zahtijeva.',
      },

      { type: 'h2', text: '6. Prijenos podataka izvan BiH' },
      {
        type: 'p',
        text: 'Naša baza podataka nalazi se u Evropskoj uniji. Neki pružaoci usluga (Supabase, Resend, Cloudflare, Google, Apple i Expo) su kompanije iz SAD-a i mogu obrađivati podatke izvan BiH i EU. Za takve prijenose oslanjamo se na njihove ugovorne zaštite, kao što su standardne ugovorne klauzule.',
      },

      { type: 'h2', text: '7. Koliko dugo čuvamo podatke' },
      {
        type: 'table',
        head: ['Podaci', 'Koliko dugo'],
        rows: [
          [
            'Podaci vašeg računa',
            'Dok imate račun. Brišu se odmah kada obrišete račun.',
          ],
          [
            'Prošli termini kod salona',
            'Dok salon koristi Chairo, bez vašeg imena i telefona (prikazuju se kao "Obrisani korisnik")',
          ],
          [
            'Zapis člana tima i raspored',
            'Dok salon koristi Chairo, bez veze s vama (prikazuje se kao "Bivši član tima")',
          ],
          [
            'Prijave grešaka i snimci ekrana',
            '12 mjeseci nakon rješavanja, ili ranije ako obrišete račun',
          ],
          ['Obavijesti u aplikaciji', '60 dana'],
          [
            'Push token uređaja',
            'Dok ste na tom uređaju prijavljeni. Briše se kada se odjavite, obrišete račun ili kada uređaj prestane primati obavijesti (npr. nakon deinstalacije aplikacije).',
          ],
          [
            'Zahtjevi u vezi s privatnošću',
            '3 godine. Tekst poruke briše se kada obrišete račun.',
          ],
          [
            'Email za rani pristup',
            'Dok vas ne obavijestimo o pokretanju aplikacije, ili dok ne zatražite brisanje',
          ],
          [
            'Termini osoba bez korisničkog računa',
            'Dok salon koristi Chairo, ili dok ne zatražite brisanje',
          ],
          [
            'Termini zakazani online preko linka salona (ime, email, telefon, napomena)',
            'Dok salon koristi Chairo, ili dok ne zatražite brisanje',
          ],
          [
            'Kodovi za potvrdu i zapisi o poslanim kodovima (s IP adresom u nečitljivom obliku)',
            '24 sata',
          ],
          [
            'Emailovi poslani na support@ i privacy@',
            'Čuvaju se u našem email sandučetu. Na vaš zahtjev ih brišemo.',
          ],
          [
            'Podaci Google Analyticsa',
            '14 mjeseci, zatim ih Google automatski briše',
          ],
        ],
      },

      { type: 'h2', text: '8. Brisanje računa' },
      {
        type: 'p',
        text: 'Račun možete obrisati u aplikaciji, na web stranici ili emailom. Koraci su opisani na stranici [chairo.app/delete-account](/delete-account).',
      },

      { type: 'h2', text: '9. Vaša prava' },
      { type: 'p', text: 'Imate pravo da:' },
      {
        type: 'ul',
        items: [
          'dobijete kopiju svojih podataka (izvoz podataka dostupan je u aplikaciji),',
          'ispravite netačne podatke,',
          'obrišete svoje podatke,',
          'ograničite obradu ili joj se usprotivite,',
          'povučete pristanak za obavijesti u bilo kojem trenutku, u postavkama aplikacije.',
        ],
      },
      {
        type: 'p',
        text: 'Za ova prava pišite na privacy@chairo.app ili pošaljite zahtjev u aplikaciji. Odgovaramo u roku od 30 dana. Možemo tražiti da potvrdite identitet, na primjer porukom s emaila vašeg računa.',
      },
      {
        type: 'p',
        text: 'Ako smatrate da su vaša prava povrijeđena, možete podnijeti prigovor Agenciji za zaštitu ličnih podataka u Bosni i Hercegovini ([azlp.ba](https://azlp.ba)).',
      },

      { type: 'h2', text: '10. Sigurnost' },
      {
        type: 'p',
        text: 'Podaci se prenose šifrovanom vezom. Lozinke se ne mogu pročitati. Pristup podacima ograničen je pravilima baze, tako da svako vidi samo ono što mu je potrebno. Ako dođe do povrede podataka koja vas se tiče, obavijestit ćemo vas bez odgađanja.',
      },

      { type: 'h2', text: '11. Djeca' },
      {
        type: 'p',
        text: 'Chairo nije namijenjen djeci mlađoj od 13 godina. Korisnici mlađi od 16 godina mogu ga koristiti samo uz pristanak roditelja ili staratelja.',
      },

      { type: 'h2', text: '12. Izmjene politike' },
      {
        type: 'p',
        text: 'Ako promijenimo ovu politiku, ažurirat ćemo datum na vrhu. O važnim izmjenama obavijestit ćemo vas u aplikaciji ili emailom.',
      },

      { type: 'h2', text: '13. Kontakt' },
      {
        type: 'p',
        text: 'privacy@chairo.app',
      },
    ],
  },

  en: {
    title: 'Privacy policy',
    updated: 'Last updated: 28 November 2026',
    blocks: [
      {
        type: 'p',
        text: 'This policy explains what personal data the Chairo app and the chairo.app website collect, why, how long we keep it, and your rights.',
      },

      { type: 'h2', text: '1. Who is responsible for your data' },
      {
        type: 'p',
        text: 'Your personal data is controlled by Chairo, Tešanj, Bosnia and Herzegovina.',
      },
      {
        type: 'p',
        text: 'Contact for all privacy questions: privacy@chairo.app',
      },

      { type: 'h2', text: '2. Who this policy covers' },
      {
        type: 'ul',
        items: [
          'clients who book appointments,',
          'barbers and other shop team members,',
          'shop owners,',
          'people without an account whom a shop enters for an appointment,',
          "people without an account who book through a shop's online booking link,",
          'visitors to chairo.app.',
        ],
      },

      { type: 'h2', text: '3. What data we collect' },
      { type: 'h3', text: 'Everyone with an account' },
      {
        type: 'ul',
        items: [
          'Email address and password, if you use one. The password is stored only in a form that cannot be read.',
          'If you sign in with Google or Apple: Google shares your name, email and profile picture with us, and Apple shares your name and email. Apple may give us a hidden relay address instead of your real email. We keep the Google profile picture as your Chairo profile photo. We never see your Google or Apple password.',
          'Sign-in details: when the account was created, when you last signed in, and when your email was confirmed.',
          'First name, last name, username, and the shop code you joined with.',
          'Phone number, only on older accounts. The app no longer asks for it.',
          'Profile photo, if you add one.',
          'Your choices for notifications and analytics (email, push, SMS). All are off until you turn them on. We keep a history of changes so we can prove your consent.',
          'In-app notifications and the categories you muted.',
          "If you allow push notifications: your device's push token (the address a notification uses to reach that phone), the device type (Android or iOS), the app language, and when the device was last used.",
          'Times of failed password attempts, to stop password guessing.',
          'Privacy requests you send us.',
          'Bug reports and feedback: the text, report type, your role, shop, app version, operating system, phone model, app language, and the screen it was sent from. Up to 3 screenshots, if you attach them.',
          'Shop invite codes.',
        ],
      },
      { type: 'h3', text: 'Clients' },
      {
        type: 'ul',
        items: [
          'The shops you joined, how you joined (code, QR or link), your preferred barber, who invited you, and when you joined and left.',
          'Appointments: shop, barber, service, price, length, time, booking reference, status, cancellation reason, and no-shows.',
          'Shop staff can see your name, username, phone (if any), photo, and your no-show count at their shop.',
        ],
      },
      { type: 'h3', text: 'Barbers and team members' },
      {
        type: 'ul',
        items: [
          'Display name, role, status, whether clients can book you, and who invited you and when.',
          'Work schedule, time off with an optional note, notes on requests to the owner, services and prices, and saved shifts.',
          "Please don't put health or other sensitive details in notes.",
        ],
      },
      { type: 'h3', text: 'Shop owners' },
      {
        type: 'ul',
        items: [
          'Shop profile: name, description, address, phone, time zone, services, prices and booking rules.',
          'Shop photos (logo, cover and gallery). These are public.',
        ],
      },
      { type: 'h3', text: 'People without an account' },
      {
        type: 'p',
        text: 'If a shop books you without a Chairo account, we keep the name and phone number the shop entered.',
      },
      { type: 'h3', text: "Online booking through a shop's link" },
      {
        type: 'p',
        text: "A shop can publish an online booking link (chairo.app/book/…), for example on its Google profile. There you book without an account. Such a booking isn't linked to an app account, even if you have one with the same email.",
      },
      {
        type: 'ul',
        items: [
          'With the booking we keep your first and last name, email, phone number, the note if you write one, and the page language. The shop and its team see these, and the number of no-shows for that phone number at that shop.',
          'We email you a confirmation code, the booking confirmation with a link to cancel, a reminder the day before, and a message if the shop cancels or moves the booking.',
          "The confirmation code is stored only in a form that can't be read. To prevent abuse we record a hashed IP address and the time of each code sent.",
          "After a confirmed code, your browser remembers a token for that email, so booking again with the same email on that device doesn't need a code.",
          'Before a code is sent or a remembered email books, Cloudflare Turnstile checks that a person, not a program, is using the page.',
        ],
      },
      { type: 'h3', text: 'Website' },
      {
        type: 'ul',
        items: [
          "To sign up and sign in: name, email and password. It's the same account as in the app.",
          "Our host (Cloudflare) records visitors' IP addresses in technical logs.",
          'If you sign up for early access: your email and the site language.',
          "Analytics (Google Analytics), only if you accept cookies: which pages you visit, where you came from, approximate location (country and city, from your IP address), device and browser type, language and time of visit. Google truncates the IP address and doesn't store it. We don't send Google your name, email or any account data.",
          'We use no advertising cookies.',
        ],
      },
      { type: 'h3', text: 'Cookies on the website' },
      {
        type: 'p',
        text: "When you first open the site, we ask whether you accept analytics cookies. Google Analytics doesn't load until you do. You can change your choice at any time with the **Cookie settings** link at the bottom of the page. If you reject after accepting, we delete the Google Analytics cookies.",
      },
      {
        type: 'table',
        head: ['Name', 'Purpose', 'Duration'],
        rows: [
          [
            'chairo-cookie-consent-v1 (browser storage)',
            'Remembers your cookie choice. Necessary, never sent anywhere.',
            'Until you clear it in your browser',
          ],
          [
            'Sign-in (browser storage)',
            'Keeps you signed in. Necessary.',
            'Until you sign out',
          ],
          [
            'chairo-booking-device:<email> (browser storage)',
            "Remembers that an email was confirmed with a code for online booking, so it isn't asked for again. Set only when you confirm a code.",
            '90 days',
          ],
          [
            '_ga',
            'Google Analytics: tells visitors apart. Only with consent.',
            '2 years',
          ],
          [
            '_ga_<ID>',
            'Google Analytics: keeps the state of a visit. Only with consent.',
            '2 years',
          ],
        ],
      },
      { type: 'h3', text: 'On your phone' },
      {
        type: 'ul',
        items: [
          'Your sign-in is stored on the phone in encrypted form. Language and display settings are cleared when you sign out.',
          "The camera is used only to scan a shop's QR code. No images are saved.",
          'Photos: the app receives only the photos you pick.',
          "Calendar: the app only opens your phone's screen for adding an event. It doesn't read your calendar.",
        ],
      },
      { type: 'h3', text: "What we don't do" },
      {
        type: 'p',
        text: "The app has no analytics or tracking. The website uses Google Analytics only with your consent. We show no ads. The app doesn't use your location. We don't sell your data.",
      },

      { type: 'h2', text: '4. Why we process data and on what legal basis' },
      {
        type: 'table',
        head: ['Purpose', 'Legal basis'],
        rows: [
          [
            'Your account and sign-in',
            'Performance of a contract (terms of use)',
          ],
          [
            'Booking appointments and running the shop',
            'Performance of a contract',
          ],
          [
            "Online booking through a shop's link and the emails about that booking (code, confirmation, reminder, cancellation or move)",
            'Performance of a contract, at your request for a booking',
          ],
          [
            'In-app notifications about appointments',
            'Performance of a contract',
          ],
          [
            'Push notifications about your appointments and account (new, moved and cancelled bookings, reminders before them, repeat appointment offers and changes and the answers to them, missed appointments, removal from a team, a shop closing)',
            "Performance of a contract. Notification settings in the app turn groups of messages off, but some messages are still sent because they need an answer or affect an appointment or the account: cancelled appointments and a repeat appointment ending (for clients), a proposed appointment change, missed appointments, removal from a team, and a shop closing. Push can always be turned off entirely in your phone's settings.",
          ],
          ['Preventing abuse and password guessing', 'Legitimate interest'],
          ['Fixing reported problems', 'Legitimate interest'],
          [
            'Keeping past appointment records for the shop',
            "The shop's legitimate interest",
          ],
          ['Email, push or SMS news', 'Only with your consent'],
          ['Answering privacy requests', 'Legal obligation'],
          ['Telling you when the app launches (early access)', 'Your consent'],
          [
            'Website visit analytics (Google Analytics)',
            'Your consent, which you can withdraw at any time',
          ],
        ],
      },

      { type: 'h2', text: '5. Who sees your data' },
      {
        type: 'p',
        text: '**The shop and its team** see what they need for your appointments, as described in section 3.',
      },
      {
        type: 'p',
        text: "**Other users** see a shop's public profile and its barbers' names and photos.",
      },
      {
        type: 'p',
        text: '**Service providers** process data for us, only for the purposes in this policy:',
      },
      {
        type: 'table',
        head: ['Provider', 'What we use it for'],
        rows: [
          [
            'Supabase',
            'Database, sign-in and file storage. Data is stored in the European Union.',
          ],
          [
            'Resend',
            'Sending account emails, the early access welcome email, emails about bookings made online (code, confirmation, reminder, cancellation, move), plus internal alerts to us. Alerts only say that a new bug report or privacy request arrived, with no personal data.',
          ],
          [
            'Cloudflare',
            'Hosting the website, the Turnstile check on early access sign-up and online booking, and forwarding email sent to support@ and privacy@',
          ],
          [
            'Google (Gmail)',
            'Receiving the emails you send us and our internal alerts',
          ],
          [
            'Google (Google Analytics)',
            "Website visit statistics, only if you accept cookies. We've turned off Google signals and any use of the data for ads.",
          ],
          [
            'Apple and Google',
            'App downloads and sign-in with Google or Apple, under their own privacy policies',
          ],
          [
            'Expo (650 Industries)',
            'Relaying push notifications to your device. It receives the push token and the notification text.',
          ],
          [
            'Google (Firebase Cloud Messaging)',
            'Delivering push notifications to Android devices',
          ],
          [
            'Apple (Apple Push Notification service)',
            'Delivering push notifications to iPhones',
          ],
        ],
      },
      {
        type: 'p',
        text: 'We share data with authorities only when the law requires it.',
      },

      { type: 'h2', text: '6. Transfers outside Bosnia and Herzegovina' },
      {
        type: 'p',
        text: 'Our database is in the European Union. Some providers (Supabase, Resend, Cloudflare, Google, Apple and Expo) are US companies and may process data outside BiH and the EU. For these transfers we rely on their contractual safeguards, such as standard contractual clauses.',
      },

      { type: 'h2', text: '7. How long we keep data' },
      {
        type: 'table',
        head: ['Data', 'How long'],
        rows: [
          [
            'Your account data',
            'While you have an account. Deleted as soon as you delete the account.',
          ],
          [
            'Past appointments at a shop',
            'While the shop uses Chairo, without your name or phone (shown as "Deleted user")',
          ],
          [
            'Team member record and schedule',
            'While the shop uses Chairo, no longer linked to you (shown as "Former team member")',
          ],
          [
            'Bug reports and screenshots',
            '12 months after being resolved, or sooner if you delete your account',
          ],
          ['In-app notifications', '60 days'],
          [
            'Device push token',
            'While you are signed in on that device. Deleted when you sign out, delete your account, or the device stops receiving notifications (for example after uninstalling the app).',
          ],
          [
            'Privacy requests',
            '3 years. The message text is erased when you delete your account.',
          ],
          [
            'Early access email',
            'Until we tell you the app has launched, or until you ask us to delete it',
          ],
          [
            'Appointments of people without an account',
            'While the shop uses Chairo, or until you ask us to delete them',
          ],
          [
            "Bookings made online through a shop's link (name, email, phone, note)",
            'While the shop uses Chairo, or until you ask us to delete them',
          ],
          [
            'Confirmation codes and records of codes sent (with a hashed IP address)',
            '24 hours',
          ],
          [
            'Emails sent to support@ and privacy@',
            'Kept in our mailbox. We delete them on request.',
          ],
          [
            'Google Analytics data',
            '14 months, then Google deletes it automatically',
          ],
        ],
      },

      { type: 'h2', text: '8. Deleting your account' },
      {
        type: 'p',
        text: 'You can delete your account in the app, on the website or by email. The steps are on [chairo.app/delete-account](/delete-account).',
      },

      { type: 'h2', text: '9. Your rights' },
      { type: 'p', text: 'You have the right to:' },
      {
        type: 'ul',
        items: [
          'get a copy of your data (data export is available in the app),',
          'correct inaccurate data,',
          'delete your data,',
          'restrict or object to processing,',
          "withdraw consent for notifications at any time, in the app's settings.",
        ],
      },
      {
        type: 'p',
        text: "To use these rights, email privacy@chairo.app or send a request in the app. We reply within 30 days. We may ask you to confirm your identity, for example by writing from your account's email address.",
      },
      {
        type: 'p',
        text: 'If you think your rights have been violated, you can complain to the Personal Data Protection Agency of Bosnia and Herzegovina ([azlp.ba](https://azlp.ba)).',
      },

      { type: 'h2', text: '10. Security' },
      {
        type: 'p',
        text: 'Data is sent over encrypted connections. Passwords cannot be read. Database rules limit access so each person sees only what they need. If a data breach affects you, we will tell you without delay.',
      },

      { type: 'h2', text: '11. Children' },
      {
        type: 'p',
        text: "Chairo is not intended for children under 13. Users under 16 may use it only with a parent's or guardian's consent.",
      },

      { type: 'h2', text: '12. Changes to this policy' },
      {
        type: 'p',
        text: 'If we change this policy, we update the date at the top. We will tell you about important changes in the app or by email.',
      },

      { type: 'h2', text: '13. Contact' },
      {
        type: 'p',
        text: 'privacy@chairo.app',
      },
    ],
  },
}
