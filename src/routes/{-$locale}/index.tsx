import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'
import { CTASection } from '#/components/sections/CTA-section'
import { FAQSection } from '#/components/sections/faq-sections'
import StepsSection from '#/components/sections/steps-section'
import Hero from '#/components/sections/hero-section'
import { PricingSection } from '#/components/sections/pricing-section'
import { Footer } from '#/components/sections/footer'
import { pageHead } from '#/i18n/seo'
import { landingContent } from '#/content/landing'
import { SITE_URL, localizePath, routeLocale } from '#/i18n/translations'
import type { Locale } from '#/i18n/translations'
import { SHOW_PRICING } from '#/lib/features'

export const Route = createFileRoute('/{-$locale}/')({
  head: ({ params }) => {
    const locale = routeLocale(params.locale)
    return {
      ...pageHead({ locale, page: '/', ...landingContent[locale].meta }),
      scripts: [
        {
          type: 'application/ld+json',
          // Inserted as raw HTML: `<` escaped so the JSON can't end the tag.
          children: JSON.stringify(structuredData(locale)).replace(
            /</g,
            '\\u003c',
          ),
        },
      ],
    }
  },
  component: Home,
})

/**
 * Schema.org data for search engines and AI answers: who makes Chairo, what
 * the app is, and the FAQ. Only what the page itself says (no price or store
 * links until launch).
 */
function structuredData(locale: Locale) {
  const { meta, faq } = landingContent[locale]
  const url = SITE_URL + localizePath('/', locale)
  const organization = { '@id': `${SITE_URL}/#organization` }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        ...organization,
        name: 'Chairo',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo512.png`,
        email: 'support@chairo.app',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Chairo',
        url: `${SITE_URL}/`,
        inLanguage: ['bs', 'en'],
        publisher: organization,
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE_URL}/#mobile-app`,
        name: 'Chairo',
        url,
        description: meta.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'iOS, Android',
        inLanguage: locale,
        publisher: organization,
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: locale,
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.title,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  }
}

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesGridSection />
        <StepsSection />
        {SHOW_PRICING && <PricingSection />}
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
