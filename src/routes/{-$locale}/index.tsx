import { Navbar } from '#/components/navigation'
import { createFileRoute } from '@tanstack/react-router'
import { FeaturesGridSection } from '#/components/sections/features-grid-section'
import { CTASection } from '#/components/sections/CTA-section'
import { FAQSection } from '#/components/sections/faq-sections'
import StepsSection from '#/components/sections/steps-section'
import Hero from '#/components/sections/hero-section'
import { PricingSection } from '#/components/sections/pricing-section'
import { Footer } from '#/components/sections/footer'
import { AboutSection } from '#/components/sections/about-section'
import { ORGANIZATION_ID, WEBSITE_ID, jsonLdScript, pageHead } from '#/i18n/seo'
import { landingContent } from '#/content/landing'
import { SITE_URL, localizePath, routeLocale } from '#/i18n/translations'
import type { Locale } from '#/i18n/translations'
import { SHOW_PRICING } from '#/lib/features'

export const Route = createFileRoute('/{-$locale}/')({
  head: ({ params }) => {
    const locale = routeLocale(params.locale)
    return {
      ...pageHead({ locale, page: '/', ...landingContent[locale].meta }),
      scripts: [jsonLdScript(structuredData(locale))],
    }
  },
  component: Home,
})

/**
 * Schema.org data for search engines and AI answers: who makes Chairo, what
 * the app is, and the FAQ. Only what the page itself says: free during early
 * access, Android first (no store link until the listing is public). Add
 * profile URLs to `sameAs` as they go live.
 */
function structuredData(locale: Locale) {
  const { meta, faq, about } = landingContent[locale]
  const url = SITE_URL + localizePath('/', locale)
  const organization = { '@id': ORGANIZATION_ID }
  const bosnia = { '@type': 'Country', name: 'Bosnia and Herzegovina' }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        ...organization,
        name: 'Chairo',
        alternateName: ['Chairo app', 'Chairo booking app', 'chairo.app'],
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo512.png`,
        description: about.paragraphs[0],
        email: 'support@chairo.app',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tešanj',
          addressCountry: 'BA',
        },
        areaServed: bosnia,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@chairo.app',
          url: SITE_URL + localizePath('/support', locale),
          availableLanguage: ['bs', 'en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'Chairo',
        url: `${SITE_URL}/`,
        inLanguage: ['bs', 'en'],
        publisher: organization,
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE_URL}/#mobile-app`,
        name: 'Chairo',
        alternateName: 'Chairo booking app',
        url,
        description: meta.description,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Appointment scheduling',
        operatingSystem: 'Android',
        inLanguage: ['bs', 'en'],
        countriesSupported: 'BA',
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Barbers, hairdressers and hair salons',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BAM',
          description:
            locale === 'bs'
              ? 'Besplatno tokom ranog pristupa'
              : 'Free during early access',
        },
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
        <AboutSection />
        {SHOW_PRICING && <PricingSection />}
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
