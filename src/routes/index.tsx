import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'
import { CTASection } from '#/components/sections/CTA-section'
import { FAQSection } from '#/components/sections/faq-sections'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <Navbar />
      <FeaturesGridSection />
      <CTASection />
      <FAQSection />
    </>
  )
}
