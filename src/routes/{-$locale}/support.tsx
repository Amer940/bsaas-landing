import { createFileRoute } from '@tanstack/react-router'
import { LegalPage, legalHead } from '#/components/legal/legal-page'
import { supportContent } from '#/content/legal/support'

export const Route = createFileRoute('/{-$locale}/support')({
  head: legalHead(supportContent, '/support'),
  component: SupportPage,
})

function SupportPage() {
  return <LegalPage content={supportContent} />
}
