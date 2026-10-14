import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { termsContent } from '#/content/legal/terms'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return <LegalPage content={termsContent} />
}
