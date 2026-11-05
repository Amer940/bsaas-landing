import { createFileRoute } from '@tanstack/react-router'
import { LegalPage, legalHead } from '#/components/legal/legal-page'
import { termsContent } from '#/content/legal/terms'

export const Route = createFileRoute('/{-$locale}/terms')({
  head: legalHead(termsContent, '/terms'),
  component: TermsPage,
})

function TermsPage() {
  return <LegalPage content={termsContent} />
}
