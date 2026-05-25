import { Button } from '#/components/ui/button'
import { EmailInput } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8 bg-amber-200 gap-4 flex">
      <Button>Benjamin</Button>
      <Button variant="outline">Benjamin</Button>
      <Button variant="submit">Sign Up</Button>
      <EmailInput></EmailInput>
    </div>
  )
}
