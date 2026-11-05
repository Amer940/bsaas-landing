import { createFileRoute } from '@tanstack/react-router'
import { landingContent } from '#/content/landing'
import { SITE_URL } from '#/i18n/translations'

// llms.txt (llmstxt.org): a plain summary of the site for AI assistants,
// built from the landing page copy. Prerendered to dist/llms.txt.

const plain = (text: string) => text.replace(/==/g, '').replace(/\n/g, ' ')

function llmsTxt() {
  const { bs, en } = landingContent
  return `# Chairo

> ${en.meta.description}

The site is in Bosnian (${SITE_URL}/) and English (${SITE_URL}/en).

## Pages

- [Home (Bosnian)](${SITE_URL}/): ${bs.meta.description}
- [Home (English)](${SITE_URL}/en): ${en.meta.description}
- [Support](${SITE_URL}/en/support): how to get help
- [Privacy policy](${SITE_URL}/en/privacy)
- [Terms of use](${SITE_URL}/en/terms)
- [Delete your account](${SITE_URL}/en/delete-account)

## What it does

${en.features.items.map((f) => `- ${f.title}: ${f.description}`).join('\n')}

## How it works

${plain(en.steps.body)}

${en.steps.items.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}

## FAQ

${en.faq.items.map((f) => `### ${f.title}\n\n${f.answer}`).join('\n\n')}
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
