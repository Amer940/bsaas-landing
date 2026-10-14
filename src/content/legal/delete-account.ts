import type { LocalizedLegalDoc } from '#/components/legal/legal-page'

export const deleteAccountContent: LocalizedLegalDoc = {
  bs: {
    title: 'Brisanje računa u aplikaciji Chairo',
    blocks: [
      {
        type: 'p',
        text: 'Ova stranica objašnjava kako obrisati račun u aplikaciji **Chairo** i šta se dešava s vašim podacima.',
      },

      { type: 'h2', text: 'Kako obrisati račun' },
      {
        type: 'p',
        text: '**U aplikaciji:** otvorite [Profil → Postavke → Obriši račun] i potvrdite brisanje.',
      },
      {
        type: 'p',
        text: '**Na web stranici:** prijavite se na chairo.app, otvorite [Račun → Obriši račun] i potvrdite brisanje.',
      },
      {
        type: 'p',
        text: '**Emailom:** pošaljite poruku s email adrese svog računa na privacy@chairo.app, s naslovom "Brisanje računa". Račun ćemo obrisati u roku od 30 dana i potvrditi vam emailom.',
      },
      {
        type: 'p',
        text: '**Vlasnici salona:** brisanjem računa briše se i vaš salon. Prije brisanja obavezno otkažite pretplatu. Budući termini klijenata bit će otkazani, a klijenti obaviješteni.',
      },

      { type: 'h2', text: 'Šta se briše odmah' },
      {
        type: 'ul',
        items: [
          'email, lozinka i podaci o prijavi,',
          'ime, prezime, korisničko ime i telefon,',
          'profilna fotografija,',
          'izbori za obavijesti i historija pristanka,',
          'obavijesti u aplikaciji,',
          'prijave grešaka i snimci ekrana,',
          'članstva u salonima i pozivnice.',
        ],
      },
      {
        type: 'p',
        text: 'Vaši budući termini se otkazuju, a frizer dobija obavijest.',
      },

      { type: 'h2', text: 'Šta ostaje i koliko dugo' },
      {
        type: 'table',
        head: ['Šta ostaje', 'Zašto', 'Koliko dugo'],
        rows: [
          [
            'Prošli termini, bez vašeg imena i telefona ("Obrisani korisnik")',
            'Poslovna evidencija salona',
            'Dok salon koristi Chairo',
          ],
          [
            'Zapis člana tima i raspored, bez veze s vama ("Bivši član tima")',
            'Evidencija rada salona',
            'Dok salon koristi Chairo',
          ],
          [
            'Zapis zahtjeva u vezi s privatnošću, bez teksta poruke',
            'Dokaz da smo zahtjev obradili',
            '3 godine',
          ],
          [
            'Podaci o plaćanju kod Lemon Squeezy',
            'Zakonske obaveze prodavca',
            'Prema pravilima Lemon Squeezy',
          ],
        ],
      },

      { type: 'h2', text: 'Brisanje samo nekih podataka' },
      {
        type: 'p',
        text: 'Račun ne morate brisati da biste uklonili dio podataka. Profilnu fotografiju i podatke profila možete promijeniti ili obrisati u aplikaciji. Za ostale podatke pišite na privacy@chairo.app.',
      },
      {
        type: 'p',
        text: 'Ako vas je salon upisao za termin bez korisničkog računa, također pišite na privacy@chairo.app i obrisat ćemo vaše ime i broj telefona.',
      },
    ],
  },

  en: {
    title: 'Deleting your Chairo account',
    blocks: [
      {
        type: 'p',
        text: 'This page explains how to delete your account in the **Chairo** app and what happens to your data.',
      },

      { type: 'h2', text: 'How to delete your account' },
      {
        type: 'p',
        text: '**In the app:** open [Profile → Settings → Delete account] and confirm.',
      },
      {
        type: 'p',
        text: '**On the website:** sign in at chairo.app, open [Account → Delete account] and confirm.',
      },
      {
        type: 'p',
        text: '**By email:** email privacy@chairo.app from your account\'s email address with the subject "Delete account". We\'ll delete the account within 30 days and confirm by email.',
      },
      {
        type: 'p',
        text: "**Shop owners:** deleting your account also deletes your shop. Make sure you cancel your subscription before deleting. Clients' upcoming appointments will be cancelled and the clients notified.",
      },

      { type: 'h2', text: 'What is deleted immediately' },
      {
        type: 'ul',
        items: [
          'email, password and sign-in details,',
          'first name, last name, username and phone,',
          'profile photo,',
          'notification choices and consent history,',
          'in-app notifications,',
          'bug reports and screenshots,',
          'shop memberships and invites.',
        ],
      },
      {
        type: 'p',
        text: 'Your upcoming appointments are cancelled and the barber is notified.',
      },

      { type: 'h2', text: 'What is kept, and for how long' },
      {
        type: 'table',
        head: ['What is kept', 'Why', 'How long'],
        rows: [
          [
            'Past appointments, without your name or phone ("Deleted user")',
            "The shop's business records",
            'While the shop uses Chairo',
          ],
          [
            'Team member record and schedule, no longer linked to you ("Former team member")',
            "The shop's work records",
            'While the shop uses Chairo',
          ],
          [
            'Record of a privacy request, without the message text',
            'Proof that we handled it',
            '3 years',
          ],
          [
            'Payment records at Lemon Squeezy',
            "The seller's legal obligations",
            "Under Lemon Squeezy's rules",
          ],
        ],
      },

      { type: 'h2', text: 'Deleting only some data' },
      {
        type: 'p',
        text: "You don't have to delete your account to remove some of your data. You can change or remove your profile photo and profile details in the app. For anything else, email privacy@chairo.app.",
      },
      {
        type: 'p',
        text: "If a shop booked you without a Chairo account, email privacy@chairo.app too and we'll delete your name and phone number.",
      },
    ],
  },
}
