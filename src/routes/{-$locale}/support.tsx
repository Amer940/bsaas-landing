import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { supportContent } from '#/content/legal/support'

export const Route = createFileRoute('/{-$locale}/support')({
  component: SupportPage,
})

function SupportPage() {
  return <LegalPage content={supportContent} />
}
