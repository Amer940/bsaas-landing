import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { privacyContent } from '#/content/legal/privacy'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return <LegalPage content={privacyContent} />
}
