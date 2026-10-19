import type { LocalizedLegalDoc } from '#/components/legal/legal-page'

export const supportContent: LocalizedLegalDoc = {
  bs: {
    title: 'Podrška',
    blocks: [
      {
        type: 'p',
        text: 'Trebate pomoć s Chairo-om? Pišite nam na **support@chairo.app**. Obično odgovaramo u roku od 2 radna dana.',
      },
      {
        type: 'p',
        text: 'Problem možete prijaviti i u aplikaciji: **Profil → Postavke → Prijavi problem**. Ako priložite snimak ekrana, brže ćemo pronaći grešku.',
      },

      { type: 'h2', text: 'Česta pitanja' },
      {
        type: 'p',
        text: '**Zaboravio/la sam lozinku.** Na ekranu za prijavu dodirnite „Zaboravljena lozinka?“ i unesite email. Poslat ćemo vam kod za aplikaciju i link za novu lozinku. Ako email ne stiže, provjerite spam.',
      },
      {
        type: 'p',
        text: '**Kako se pridružiti salonu?** Skenirajte QR kod salona, unesite kod salona ili otvorite link koji vam je salon poslao.',
      },
      {
        type: 'p',
        text: '**Kako otkazati termin?** Otvorite termin u aplikaciji i dodirnite **Otkaži**. Ako je prekasno za otkazivanje u aplikaciji, javite se direktno salonu.',
      },
      {
        type: 'p',
        text: '**Kako obrisati račun?** Koraci su na stranici [chairo.app/delete-account](/delete-account).',
      },
      {
        type: 'p',
        text: '**Pitanja o privatnosti?** Pišite na privacy@chairo.app ili pogledajte [politiku privatnosti](/privacy).',
      },
    ],
  },

  en: {
    title: 'Support',
    blocks: [
      {
        type: 'p',
        text: 'Need help with Chairo? Email us at **support@chairo.app**. We usually reply within 2 working days.',
      },
      {
        type: 'p',
        text: 'You can also report a problem in the app: **Profile → Settings → Report a problem**. Attaching a screenshot helps us find the issue faster.',
      },

      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'p',
        text: '**I forgot my password.** On the sign-in screen, tap "Forgot password?" and enter your email. We\'ll send you a code for the app and a link to set a new password. If it doesn\'t arrive, check your spam folder.',
      },
      {
        type: 'p',
        text: "**How do I join a shop?** Scan the shop's QR code, enter the shop code, or open the link the shop sent you.",
      },
      {
        type: 'p',
        text: "**How do I cancel an appointment?** Open the appointment in the app and tap **Cancel**. If it's too late to cancel in the app, contact the shop directly.",
      },
      {
        type: 'p',
        text: '**How do I delete my account?** The steps are on [chairo.app/delete-account](/delete-account).',
      },
      {
        type: 'p',
        text: '**Privacy questions?** Email privacy@chairo.app or read our [privacy policy](/privacy).',
      },
    ],
  },
}
