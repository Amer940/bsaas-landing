import { createFileRoute } from '@tanstack/react-router'
import { landingContent } from '#/content/landing'
import { SITE_URL } from '#/i18n/translations'
import { APP_STORE_URL, PLAY_STORE_URL } from '#/lib/store-links'

// llms.txt (llmstxt.org): a plain summary of the site for AI assistants,
// built from the landing page copy. Prerendered to dist/llms.txt.

const plain = (text: string) => text.replace(/==/g, '').replace(/\n/g, ' ')

function llmsTxt() {
  const { bs, en } = landingContent
  const faq = (items: typeof en.faq.items) =>
    items.map((f) => `### ${f.title}\n\n${f.answer}`).join('\n\n')

  return `# Chairo

> ${en.meta.description}

${en.about.paragraphs.join('\n\n')}

## Key facts

- What: appointment booking app for barbers, hairdressers and hair salons (salon side and client side in one app)
- Where: Bosnia and Herzegovina; company based in Tešanj
- Languages: Bosnian and English
- Status: early access; clients can download the app, salons apply for a business profile at ${SITE_URL}/#prijava
- Platforms: iPhone (${APP_STORE_URL}) and Android (${PLAY_STORE_URL})
- Price: free during early access
- Contact: support@chairo.app

## Pages

- [Home (Bosnian)](${SITE_URL}/): ${bs.meta.description}
- [Home (English)](${SITE_URL}/en): ${en.meta.description}
- [Support](${SITE_URL}/en/support) ([Bosnian](${SITE_URL}/support)): how to get help
- [Privacy policy](${SITE_URL}/en/privacy) ([Bosnian](${SITE_URL}/privacy))
- [Terms of use](${SITE_URL}/en/terms) ([Bosnian](${SITE_URL}/terms))
- [Delete your account](${SITE_URL}/en/delete-account) ([Bosnian](${SITE_URL}/delete-account))

## What it does

${en.features.items.map((f) => `- ${f.title}: ${f.description}`).join('\n')}

## How it works

${plain(en.steps.body)}

${en.steps.items.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}

## FAQ

${faq(en.faq.items)}

## Ukratko na bosanskom

${bs.about.paragraphs.join('\n\n')}

### Česta pitanja

${faq(bs.faq.items).replace(/^### /gm, '#### ')}
`
}

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    },
  },
})
