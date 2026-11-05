import { createFileRoute } from '@tanstack/react-router'
import { LegalPage, legalHead } from '#/components/legal/legal-page'
import { privacyContent } from '#/content/legal/privacy'

export const Route = createFileRoute('/{-$locale}/privacy')({
  head: legalHead(privacyContent, '/privacy'),
  component: PrivacyPage,
})

function PrivacyPage() {
  return <LegalPage content={privacyContent} />
}
