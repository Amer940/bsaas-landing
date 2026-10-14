import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { deleteAccountContent } from '#/content/legal/delete-account'

export const Route = createFileRoute('/delete-account')({
  component: DeleteAccountPage,
})

function DeleteAccountPage() {
  return <LegalPage content={deleteAccountContent} />
}
