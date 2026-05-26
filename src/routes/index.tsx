import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <Navbar />
      <FeaturesGridSection />
    </>
  )
}
