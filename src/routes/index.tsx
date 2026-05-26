import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <div className="p-8 gap-4 flex">
        <Navbar></Navbar>
      </div>
      <FeaturesGridSection></FeaturesGridSection>
    </>
  )
}
