import { createFileRoute, notFound } from '@tanstack/react-router'
import { CodeLinkPage } from '#/components/code-link-page'
import { joinContent } from '#/content/join'

// A shop's QR and shared link: chairo.app/join/<code>. See CodeLinkPage.

// Same shape the server enforces (businesses_referral_code_format).
const CODE_FORMAT = /^[A-Z0-9-]{4,20}$/

export const Route = createFileRoute('/{-$locale}/join/$code')({
  beforeLoad: ({ params }) => {
    if (!CODE_FORMAT.test(normalizeCode(params.code))) throw notFound()
  },
  component: JoinPage,
})

function normalizeCode(code: string) {
  return code.replace(/\s/g, '').toUpperCase()
}

function JoinPage() {
  const code = normalizeCode(Route.useParams().code)
  return <CodeLinkPage code={code} kind="shop" content={joinContent} />
}
