import { createFileRoute, notFound } from '@tanstack/react-router'
import { CodeLinkPage } from '#/components/code-link-page'
import { inviteContent } from '#/content/invite'

// A friend's invite, from their QR or shared link: chairo.app/invite/<code>.
// See CodeLinkPage.

// The server's alphabet (no 0/O, 1/I/L), six characters.
const CODE_FORMAT = /^[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{6}$/

export const Route = createFileRoute('/{-$locale}/invite/$code')({
  beforeLoad: ({ params }) => {
    if (!CODE_FORMAT.test(normalizeCode(params.code))) throw notFound()
  },
  component: InvitePage,
})

function normalizeCode(code: string) {
  return code.replace(/\s/g, '').toUpperCase()
}

function InvitePage() {
  const code = normalizeCode(Route.useParams().code)
  return <CodeLinkPage code={code} kind="invite" content={inviteContent} />
}
