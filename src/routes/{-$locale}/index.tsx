import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'
import { CTASection } from '#/components/sections/CTA-section'
import { FAQSection } from '#/components/sections/faq-sections'
import StepsSection from '#/components/sections/steps-section'
import Hero from '#/components/sections/hero-section'
import { Footer } from '#/components/sections/footer'
import { Seo } from '#/i18n/seo'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'

export const Route = createFileRoute('/{-$locale}/')({
  component: Home,
})

function Home() {
  const { locale } = useLocale()
  const { meta } = landingContent[locale]

  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <Navbar />
      <Hero />
      <FeaturesGridSection />
      <StepsSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </>
  )
}
