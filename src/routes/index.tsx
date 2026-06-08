import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'
import { CTASection } from '#/components/sections/CTA-section'
import { FAQSection } from '#/components/sections/faq-sections'
import StepsSection from '#/components/sections/steps-section'
import { PricingSection } from '#/components/sections/pricing-section'
import Hero from '#/components/sections/hero-section'
import { Footer } from '#/components/sections/footer'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesGridSection />
      <StepsSection />
      <PricingSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </>
  )
}
