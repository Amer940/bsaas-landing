import { FAQAccordion } from '../ui/faq-item'
import { RichText } from '../rich-text'
import { SectionHeading } from '../section-heading'
import { useLocale } from '#/i18n/locale-context'
import { landingContent } from '#/content/landing'

export function FAQSection() {
  const { locale } = useLocale()
  const c = landingContent[locale].faq

  return (
    <section
      id="pitanja"
      className="mx-auto max-w-300 scroll-mt-24 px-5 pt-10 pb-14 md:pt-15 md:pb-25 xl:px-0"
    >
      <SectionHeading eyebrow={c.eyebrow} className="mb-6 md:mb-11">
        <RichText text={c.title} />
      </SectionHeading>
      <FAQAccordion items={c.items} />
    </section>
  )
}
